
import { BaseException } from '.';
import { EXCEPTIONS } from '../configs';

export class RestApiException extends BaseException {
  httpCode: number;
  constructor (message: string, httpCode = 400) {
    super(EXCEPTIONS.REST_API_EXCEPTION, message);
    this.httpCode = httpCode;
  }
}

export enum HttpCodes {
  Ok = 200,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  Forbidden = 403,
  Internal = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
}
