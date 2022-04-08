const EXCEPTIONS = {
  VALIDATION_EXCEPTION: {
    level: 'error',
    code: 'EVE001',
    name: 'Validation Exception',
  },
  API_REQUEST_EXCEPTION: {
    level: 'error',
    code: 'ERAE',
    name: 'API Request Exception',
  },
};

export const API_REQUEST_EXCEPTION_CODES = {
  unauthorized: 401,
  internal: 500,
}

export default EXCEPTIONS;
