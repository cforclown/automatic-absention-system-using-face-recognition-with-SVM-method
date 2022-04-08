import { PaginationSchema } from './pagination';
import { validateSchema } from '../utils/validate-schema';
import { ValidationException } from '../exceptions';
import { FindSchema } from '.';

describe('pagination', () => {
  const paginationPayload = {
    page: 1,
    limit: 10,
    sort: {
      by: 'X',
      order: 'ASC'
    }
  };
  const findPayload = {
    query: 'find this',
    pagination: paginationPayload
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pagination-schema', () => {
    it('should successfully validate with correct payload', () => {
      const result = validateSchema({ schema: PaginationSchema, payload: paginationPayload });
      expect(result).toEqual(paginationPayload);
    });

    it('should throw an error when validate invalid payload', () => {
      const invalidPayload = { page: 1 };

      expect(() => validateSchema({ schema: PaginationSchema, payload: invalidPayload })).toThrow(ValidationException);
    });
  });

  describe('find-schema', () => {
    it('should successfully validate with correct payload', () => {
      const result = validateSchema({ schema: FindSchema, payload: findPayload });
      expect(result).toEqual(findPayload);
    });

    it('should throw an error when validate invalid payload', () => {
      const invalidPayload = { page: 1 };

      expect(() => validateSchema({ schema: FindSchema, payload: invalidPayload })).toThrow(ValidationException);
    });
  });
});
