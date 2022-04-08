import { Document, model, Model } from 'mongoose';
import { CreateRolePayload, FindRolesPayload, FindRolesResult, Role } from './roles.types';
import { HttpCodes, RestApiException } from '../../exceptions';

export class RolesDao {
  rolesModel: Model<Role>;

  constructor () {
    this.rolesModel = model<Role>('roles');
  }

  async get (roleId: string): Promise<Role | null> {
    return this.rolesModel.findOne({ _id: roleId, archived: false }).exec(); ;
  }

  async find ({ query, pagination }: FindRolesPayload): Promise<FindRolesResult> {
    const result = await this.rolesModel
      .aggregate([
        {
          $match: {
            name: {
              $regex: query ?? '',
              $options: 'i'
            },
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
            metadata: [{ $count: 'total' }, { $addFields: { page: pagination.page } }],
            data: [
              { $skip: (pagination.page - 1) * pagination.limit },
              { $limit: pagination.limit }
            ]
          }
        }
      ])
      .exec();

    const data = {
      data: [],
      query,
      pagination: {
        ...pagination,
        pageCount: 0
      }
    };

    if (result[0].metadata.length && result[0].data.length) {
      data.data = result[0].data;
      data.pagination.pageCount = Math.ceil(result[0].metadata[0].total / pagination.limit);
    }

    return data;
  }

  async create (payload: CreateRolePayload): Promise<Role> {
    const roleDoc = await this.rolesModel.create(payload);
    return roleDoc;
  }

  async update (payload: Role): Promise<Role> {
    const role = await this.rolesModel.findOneAndUpdate({ _id: payload._id, archived: false }, payload, { new: true }).exec();
    if (!role) {
      throw new RestApiException('Role not found');
    }
    return role;
  }

  async delete (roleId: string): Promise<Role> {
    const role = await this.rolesModel.findOneAndUpdate({ _id: roleId }, { archived: true }, { new: true }).exec();
    if (!role) {
      throw new RestApiException('Role not found');
    }
    return role;
  }

  async getDefault (): Promise<Role> {
    const role = await this.rolesModel.findOne({ default: true }).exec();
    if (!role) {
      throw new RestApiException('Default role not found', HttpCodes.Internal);
    }
    return role;
  }

  async setDefault (roleId: string): Promise<Role> {
    const role = await this.get(roleId) as (Document<any, any, Role> & Role) | null;
    if (!role) {
      throw new RestApiException('Role not found', HttpCodes.NotFound);
    }
    await this.rolesModel.updateMany({}, { default: false }).exec();
    role.default = true;
    await role.save();

    return role;
  }
}
