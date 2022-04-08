import { Environment, Logger } from '../common';
import { IException } from '../types';

export abstract class BaseException extends Error {
  constructor (exception: IException, message?: string) {
    super(message);
    this.name = `[${exception.code}] ${exception.name}`;

    if (Environment.getNodeEnv() === 'test') {
      return;
    }
    Logger[exception.level](`${this.name}: ${this.message}`);
  }
}
