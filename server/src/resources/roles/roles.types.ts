import { FindPayload, Pagination, PaginationSort } from '../../types';

export enum ResourceTypes {
  users = 'users',
  masterData = 'masterData',
}

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export type Permission = {
  [id in PermissionAction]: boolean;
};

export type Permissions = {
  [resourceTypes in ResourceTypes]: Permission;
};

export interface Role {
  _id: string;
  name: string;
  permissions: Permissions;
  default?: boolean;
  archived?: boolean;
  editable?: boolean;
  desc: string;
}

export type FindRolesSortBy = 'name';
export type FindRolesPayload = FindPayload & {
  pagination: {
    sort: PaginationSort & {
      by: FindRolesSortBy;
    };
  };
};
export type FindRolesResult = FindRolesPayload & {
  data: Role[];
  pagination: Pagination & {
    pageCount: number;
  };
};

export type CreateRolePayload = Omit<Role, '_id'>;
