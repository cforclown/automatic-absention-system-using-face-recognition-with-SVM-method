import Joi from 'joi';
import { FindSchema, PaginationSchema } from '../../schemas';
import { SortOrder } from '../../types';

const FindStudentsPaginationSchema = PaginationSchema.keys({
  sort: Joi.object({
    by: Joi.string().valid('fullname').allow(null).default('fullname'),
    order: Joi.string().valid(SortOrder.ASC, SortOrder.DESC).allow(null).default(SortOrder.ASC)
  })
});

export const FindStudentsSchema = FindSchema.keys({
  pagination: FindStudentsPaginationSchema.required()
});

export const StudentSchema = Joi.object({
  _id: Joi.string().required(),
  fullname: Joi.string().required(),
  nim: Joi.string().required(),
  dateOfBirth: Joi.string().required()
});

export const UpdateStudentSchema = Joi.object({
  _id: Joi.string().required(),
  fullname: Joi.string(),
  nim: Joi.string(),
  dateOfBirth: Joi.string()
});

export const StudentIdSchema = Joi.object({
  studentId: Joi.string().required()
});

export const CreateStudentPayloadSchema = StudentSchema.keys({
  _id: Joi.forbidden()
});
