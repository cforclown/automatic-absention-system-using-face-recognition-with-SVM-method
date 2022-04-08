import BaseException from './base-exception';
import EXCEPTIONS from './exceptions-types';

export class ApiRequestException extends BaseException {
  constructor(message, code) {
    super(EXCEPTIONS.API_REQUEST_EXCEPTION, message);
    this.code = code;
  }

  static ThrowStatus(status, message) {
    return new ApiRequestException(message, status);
  }
}

export const RequestCodes = {
  Ok: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Internal: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
};
