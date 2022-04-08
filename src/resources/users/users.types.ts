import { Role } from '..';
import { FindPayload, Pagination, PaginationSort } from '../../types';

export interface UserAvatar {
  data: string;
  filename: string;
}

export interface User {
  _id: string;
  username: string;
  password?: string;
  fullname: string;
  email?: string | null;
  role: Role | Omit<Role, 'permissions' | 'editable' | 'default'> | string;
  avatar?: UserAvatar;
}

export type FindUsersSortBy = 'username' | 'email' | 'fullname' | 'role';
export type FindUsersPayload = FindPayload & {
  pagination: {
    sort: PaginationSort & {
      by: FindUsersSortBy;
    };
  };
};
export type FindUsersResult = FindUsersPayload & {
  data: User[];
  pagination: Pagination & {
    pageCount: number;
  };
};

export type CreateUserPayload = Omit<User, '_id'> & {
  password: string;
  role: string;
};

export interface UpdateUserPayload {
  _id: string;
  username?: string | null;
  fullname?: string | null;
  email?: string | null;
  role?: string | null;
}

export interface ChangeUserRolePayload {
  _id: string;
  role: string;
}

export interface ChangeAvatarPayload {
  data: string;
  filename: string;
}
