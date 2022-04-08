import Joi from 'joi';
import { FindSchema, PaginationSchema } from '../../schemas';
import { SortOrder } from '../../types';

const FindUsersPaginationSchema = PaginationSchema.keys({
  sort: Joi.object({
    by: Joi.string().valid('username', 'email', 'fullname', 'role').allow(null).default('fullname'),
    order: Joi.string().valid(SortOrder.ASC, SortOrder.DESC).allow(null).default(SortOrder.ASC)
  })
});

export const FindUsersSchema = FindSchema.keys({
  pagination: FindUsersPaginationSchema.required()
});

export const UserIdSchema = Joi.object({
  userId: Joi.string().required()
});

export const UsernameAvailabilitySchema = Joi.object({
  username: Joi.string().required()
});

export const CreateUserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  role: Joi.string().required()
});

export const UpdateProfilePayloadSchema = Joi.object({
  username: Joi.string().allow(null).default(null),
  fullname: Joi.string().allow(null).default(null),
  email: Joi.string().allow(null).default(null)
});

export const ChangeUserRolePayloadSchema = Joi.object({
  _id: Joi.string().required(),
  role: Joi.string().required()
});

export const ChangeAvatarPayloadSchema = Joi.object({
  data: Joi.string().required(),
  filename: Joi.string().required()
});
