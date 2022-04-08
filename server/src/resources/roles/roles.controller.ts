import { Request } from 'express';
import { FindRolesResult, Role } from './roles.types';
import { RolesService } from './roles.service';
import { HttpCodes, RestApiException } from '../../exceptions';

export class RolesController {
  private readonly rolesService: RolesService;

  constructor ({ rolesService }: { rolesService: RolesService; }) {
    this.rolesService = rolesService;

    this.get = this.get.bind(this);
    this.find = this.find.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.getDefault = this.getDefault.bind(this);
    this.setDefault = this.setDefault.bind(this);
    this.delete = this.delete.bind(this);
  }

  async find ({ body }: Request): Promise<FindRolesResult> {
    return this.rolesService.find(body);
  }

  async get ({ params }: Request): Promise<Role> {
    const role = await this.rolesService.get(params.roleId);
    if (!role) {
      throw new RestApiException('Role not found', HttpCodes.NotFound);
    }
    return role;
  }

  async create ({ body }: Request): Promise<Role> {
    return this.rolesService.create(body);
  }

  async update ({ body }: Request): Promise<Role> {
    return this.rolesService.update(body);
  }

  async delete ({ params }: Request): Promise<Role> {
    return this.rolesService.delete(params.roleId);
  }

  async getDefault (): Promise<Role> {
    return this.rolesService.getDefault();
  }

  async setDefault ({ body }: Request): Promise<Role> {
    return this.rolesService.setDefault(body.roleId);
  }
}
