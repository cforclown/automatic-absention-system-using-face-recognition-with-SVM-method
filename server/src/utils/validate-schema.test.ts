import Joi from 'joi';
import { validateSchema } from './validate-schema';
import { ValidationException } from '../exceptions';

describe('validateSchema', () => {
  const schema1 = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    message: Joi.string().optional()
  });
  const schema2 = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    message: Joi.string().default('message')
  });

  it('should return value when schema is valid', () => {
    const payload = {
      code: '000',
      name: 'example'
    };

    const result = validateSchema({ schema: schema1, payload });
    expect(result).toEqual(payload);
  });

  it('should return value when schema is valid with replaceSource option is true', () => {
    const payload = {
      code: '000',
      name: 'example'
    };

    const result = validateSchema({ schema: schema2, payload, replaceSource: true });
    expect(result).toEqual({
      ...payload,
      message: 'message'
    });
  });

  it('should throw ValidationException when schema is invalid', () => {
    expect(() => validateSchema({ schema: schema1, payload: {} })).toThrow(ValidationException);
  });
});
