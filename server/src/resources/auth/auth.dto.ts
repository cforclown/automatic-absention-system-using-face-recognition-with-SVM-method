import Joi from 'Joi';

export const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
});
