import { ObjectSchema, ValidationOptions } from 'joi';
import { ValidationException } from '../exceptions';

export const validateSchema = <T>({
  schema, payload, validationOptions: validateOptions, replaceSource
}: { schema: ObjectSchema, payload: T, validationOptions?: ValidationOptions, replaceSource?: boolean; }): T => {
  const { error, value } = schema.validate(payload, validateOptions);

  if (error) {
    throw new ValidationException(error.message);
  }
  if (replaceSource) {
    payload = value;
  }

  return payload;
};
