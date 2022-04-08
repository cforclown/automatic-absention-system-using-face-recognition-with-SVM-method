import { Request } from 'express';
import { UsersService } from './users.service';
import { FindUsersResult, User } from './users.types';
import { Role } from '../roles';
import { HttpCodes, RestApiException } from '../../exceptions';

export class UsersController {
  private readonly usersService: UsersService;

  constructor ({ usersService }: { usersService: UsersService; }) {
    this.usersService = usersService;

    this.get = this.get.bind(this);
    this.find = this.find.bind(this);
    this.isUsernameAvailable = this.isUsernameAvailable.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.delete = this.delete.bind(this);

    this.getPermissions = this.getPermissions.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getAvatar = this.getAvatar.bind(this);
    this.changeAvatar = this.changeAvatar.bind(this);
  }

  async get ({ params }: Request): Promise<User> {
    const user = await this.usersService.get(params.userId);
    if (!user) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    return user;
  }

  async find ({ body }: Request): Promise<FindUsersResult> {
    return this.usersService.find(body);
  }

  async isUsernameAvailable ({ params, query, user }: Request): Promise<boolean> {
    return this.usersService.isUsernameAvailable(params.username, query.excludeSelf ? (user as User)._id : undefined);
  }

  async create ({ body }: Request): Promise<User> {
    return this.usersService.create({
      ...body,
      password: 'root'
    });
  }

  async update ({ body }: Request): Promise<User> {
    return this.usersService.update(body);
  }

  async changeRole ({ body }: Request): Promise<User> {
    return this.usersService.update(body);
  }

  async delete ({ params }: Request): Promise<User> {
    return this.usersService.delete(params.userId);
  }

  async getPermissions ({ user }: Request): Promise<Role> {
    return this.usersService.getUserPermissions((user as User)._id);
  }

  async getAvatar ({ params }: Request): Promise<Buffer> {
    const avatar = await this.usersService.getUserAvatar(params.userId);
    if (!avatar || !avatar.data) {
      throw new RestApiException('Avatar not found', HttpCodes.NotFound);
    }

    const imageBuffer = Buffer.from(avatar.data.split(';base64,')[1], 'base64');
    return imageBuffer;
  }

  async getProfile ({ user }: Request): Promise<User> {
    const userDocument = await this.usersService.get((user as User)._id);
    if (!userDocument) {
      throw new RestApiException('User not found', HttpCodes.NotFound);
    }
    return userDocument;
  }

  async updateProfile ({ user, body }: Request): Promise<User> {
    return this.usersService.update({
      _id: (user as User)._id,
      ...body
    });
  }

  async changeAvatar ({ user, body }: Request): Promise<User> {
    return this.usersService.changeUserAvatar((user as User)._id, body);
  }
}
