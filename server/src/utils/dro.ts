import { Response } from '../types';

/**
 * DATA RESPONSE OBJECT
 */
export class dro {
  static response<T> (data: T): Response<T> {
    return ({ data, error: null });
  }

  static error (error: any): Response<any> {
    return { data: null, error };
  }
}
