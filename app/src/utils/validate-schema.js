import { ValidationError } from 'yup';

const validateValues = async (schema, values) => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    if (err instanceof ValidationError) {
      return normalizeValidationErrors(err);
    }

    return {
      internal: err.message,
    };
  }
};

const normalizeValidationErrors = (validationError) => {
  try {
    const errors = validationError.inner.reduce((acc, curr) => {
      acc[curr.path] = curr.message;
      return acc;
    }, {});
    return errors;
  } catch (err) {
    console.log(err.message);
    return {
      internal: err.message,
    };
  }
};

const validate = (schema) => async (values) => validateValues(schema, values);

export default validate;
