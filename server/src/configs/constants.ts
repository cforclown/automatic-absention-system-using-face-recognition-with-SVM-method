import { IException } from '../types';

export const EXCEPTIONS: { [key: string]: IException; } = {
  VALIDATION_EXCEPTION: {
    level: 'error',
    code: 'EVE001',
    name: 'Validation Exception'
  },
  REST_API_EXCEPTION: {
    level: 'error',
    code: 'ERAE',
    name: 'Rest API Exception'
  }
};
