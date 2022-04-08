import { Document, model, Model } from 'mongoose';
import { HttpCodes, RestApiException } from '../../exceptions';
import { ChangeAvatarPayload, CreateUserPayload, FindUsersPayload, FindUsersResult, UpdateUserPayload, User, UserAvatar } from './users.types';
import { LoginPayload } from '../auth';

export class UsersDao {
  private readonly usersModel: Model<User>;

  constructor () {
    this.usersModel = model<User>('users');
  }

  async authenticate ({ username, password }: LoginPayload): Promise<User | null> {
    return this.usersModel.findOne({ username, password, archived: false }).select('-password -avatar -archived').exec();
  }

  async get (userId: string, leanObject?: boolean): Promise<User | null> {
    const user = (await this.usersModel.findOne({
      _id: userId,
      archived: false
    }).populate('role').select('-password -archived').exec()) as User | undefined;
    if (!user) {
      return null;
    }

    return leanObject ? (user as unknown as Document<User>).toObject() as unknown as User : user;
  }

  async find ({ query, pagination }: FindUsersPayload): Promise<FindUsersResult> {
    const matchQuery = {
      $regex: query ?? '',
      $options: 'i'
    };
    const selects = {
      username: 1,
      email: 1,
      fullname: 1,
      'role._id': 1,
      'role.name': 1
    };

    const result = await this.usersModel
      .aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $unwind: '$role' },
        {
          $match: {
            $or: [
              { username: matchQuery },
              { email: matchQuery },
              { fullname: matchQuery },
              { 'role.name': matchQuery }
            ],
            archived: false
          }
        },
        {
          $sort: {
            [pagination.sort.by]: pagination.sort.order
          }
        },
        {
          $facet: {
            metadata: [
              { $count: 'total' },
              { $addFields: { page: pagination.page } }
            ],
            data: [
              { $skip: (pagination.page - 1) * pagination.limit },
              { $limit: pagination.limit },
              {
                $project: selects
              }
            ]
          }
        }
      ])
      .exec();

    const data: FindUsersResult = {
      query,
      pagination: {
        ...pagination,
        pageCount: 0
      },
      data: []
    };

    if (result[0].metadata.length && result[0].data.length) {
      data.data = result[0].data;
      data.pagination.pageCount = Math.ceil(result[0].metadata[0].total / pagination.limit);
    }

    return data;
  }

  async isUsernameAvailable (username: string, exclude?: string): Promise<boolean> {
    const user = await this.usersModel.findOne(
      exclude
        ? {
          _id: { $ne: exclude },
          username,
          archived: false
        }
        : { username, archived: false }
    ).exec();
    return !user;
  }

  async isEmailAvailable (email: string, exclude?: string): Promise<boolean> {
    const user = await this.usersModel.findOne(
      exclude
        ? {
          _id: { $ne: exclude },
          email,
          archived: false
        }
        : { email, archived: false }
    ).exec();
    return !user;
  }

  async create (payload: CreateUserPayload): Promise<User> {
    const user = await this.usersModel.create({
      ...payload
    });
    await this.usersModel.populate(user, { path: 'role' });
    user.password = undefined;

    return user;
  }

  async update (payload: UpdateUserPayload): Promise<User> {
    const user = await this.usersModel.findOne({ _id: payload._id, archived: false }).select('-password -avatar').exec();
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    user.username = payload.username ?? user.username;
    user.fullname = payload.fullname ?? user.fullname;
    user.email = payload.email !== undefined ? payload.email : user.email;
    user.role = payload.role ?? user.role;
    await user.save();
    await this.usersModel.populate(user, { path: 'role' });

    return user;
  }

  async getUserAvatar (userId: string): Promise<UserAvatar | undefined> {
    const user = await this.usersModel.findById(userId).select('avatar').exec();
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }

    return user.avatar;
  }

  async changeUserAvatar (userId: string, avatar: ChangeAvatarPayload): Promise<User> {
    const user = await this.usersModel.findOne({ _id: userId, archived: false }).select('-password -avatar').exec();
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    user.avatar = avatar;
    await user.save();

    return user;
  }

  async delete (userId: string): Promise<User> {
    const user = await this.usersModel.findOneAndUpdate({ _id: userId }, { archived: true }, { new: true }).exec();
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    await this.usersModel.populate(user, { path: 'role' });
    return user;
  }
}
