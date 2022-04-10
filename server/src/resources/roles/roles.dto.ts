import Joi from 'joi';
import { FindSchema, PaginationSchema } from '../../schemas';
import { SortOrder } from '../../types';
import { ResourceTypes } from './roles.types';

const FindRolesPaginationSchema = PaginationSchema.keys({
  sort: Joi.object({
    by: Joi.string().valid('name').allow(null).default('name'),
    order: Joi.string().valid(SortOrder.ASC, SortOrder.DESC).allow(null).default(SortOrder.ASC)
  })
});

export const FindRolesSchema = FindSchema.keys({
  pagination: FindRolesPaginationSchema.required()
});

export const PermissionSchema = Joi.object({
  view: Joi.boolean().default(true),
  create: Joi.boolean().default(false),
  update: Joi.boolean().default(false),
  delete: Joi.boolean().default(false)
});

export const RoleSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  permissions: Joi.object({
    [ResourceTypes.users]: PermissionSchema,
    [ResourceTypes.masterData]: PermissionSchema
  }),
  desc: Joi.string()
});

export const CreateRolePayloadSchema = RoleSchema.keys({
  _id: Joi.forbidden()
});

export const UpdateRoleSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string(),
  permissions: Joi.object({
    [ResourceTypes.users]: PermissionSchema,
    [ResourceTypes.masterData]: PermissionSchema
  }),
  desc: Joi.string()
});

export const RoleIdSchema = Joi.object({
  roleId: Joi.string().required()
});
