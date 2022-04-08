import { BaseException } from '.';
import { EXCEPTIONS } from '../configs';

export class ValidationException extends BaseException {
  constructor (message?: string) {
    super(EXCEPTIONS.VALIDATION_EXCEPTION, message);
  }
}
