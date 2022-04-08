import Joi from 'Joi';

export const PaginationSchema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
  sort: {
    by: Joi.string(),
    order: Joi.string()
  }
});

export const FindSchema = Joi.object({
  query: Joi.string().allow(null).allow('').default(''),
  pagination: PaginationSchema.required()
});
