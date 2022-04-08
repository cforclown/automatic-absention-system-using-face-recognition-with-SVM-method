import { validateSchema } from '../../utils/validate-schema';
import { ValidationException } from '../../exceptions/validation-exception';
import { ChangeAvatarPayloadSchema, ChangeUserRolePayloadSchema, CreateUserPayloadSchema, FindUsersSchema, UpdateProfilePayloadSchema } from './users.dto';
import { FindUsersPayload } from './users.types';

describe('users-data-transfer-object', () => {
  const mockFindUsersPayload: FindUsersPayload = {
    query: '',
    pagination: {
      page: 1,
      limit: 10,
      sort: {
        by: 'fullname',
        order: 1
      }
    }
  };
  const mockCreateUserPayload = {
    username: 'username',
    fullname: 'fullname',
    email: 'email@email.com',
    role: 'role'
  };

  describe('FindUsersSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: FindUsersSchema, payload: mockFindUsersPayload });
      expect(result).toEqual(mockFindUsersPayload);
    });

    it('should throw validation exception when page not provided', () => {
      expect(() => validateSchema({
        schema: FindUsersSchema,
        payload: {
          query: '',
          pagination: {
            limit: 10,
            sort: {
              by: 'fullname',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when limit not provided', () => {
      expect(() => validateSchema({
        schema: FindUsersSchema,
        payload: {
          query: '',
          pagination: {
            page: 1,
            sort: {
              by: 'fullname',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });
  });

  describe('CreateUserPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: CreateUserPayloadSchema, payload: mockCreateUserPayload });
      expect(result).toEqual(mockCreateUserPayload);
    });

    it('should return value when email not provided', () => {
      const result = validateSchema({ schema: CreateUserPayloadSchema, payload: mockCreateUserPayload });
      expect(result).toEqual(mockCreateUserPayload);
    });

    it('should throw validation exception when username not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          username: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when fullname not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          fullname: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when role not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          role: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when email is invalid not provided', () => {
      expect(() => validateSchema({
        schema: CreateUserPayloadSchema,
        payload: {
          ...mockCreateUserPayload,
          email: 'invalid email'
        }
      })).toThrow(ValidationException);
    });
  });

  describe('UpdateProfilePayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({
        schema: UpdateProfilePayloadSchema,
        payload: { fullname: 'fullname' }
      });
      expect(result).toEqual({ fullname: 'fullname' });
    });

    it('should allow payload empty object', () => {
      const result = validateSchema({ schema: UpdateProfilePayloadSchema, payload: {} });
      expect(result).toEqual({});
    });

    it('should throw validation exception when payload is not object', () => {
      expect(() => validateSchema({ schema: UpdateProfilePayloadSchema, payload: null })).toThrow(ValidationException);
    });
  });

  describe('ChangeUserRolePayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({
        schema: ChangeUserRolePayloadSchema,
        payload: { _id: 'mock-id', role: 'mock-role-id' }
      });
      expect(result).toEqual({ _id: 'mock-id', role: 'mock-role-id' });
    });

    it('should not allow payload empty object', () => {
      expect(() => validateSchema({ schema: ChangeUserRolePayloadSchema, payload: {} })).toThrow(ValidationException);
    });
  });

  describe('ChangeAvatarPayloadSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({
        schema: ChangeAvatarPayloadSchema,
        payload: { data: 'data', filename: 'filename' }
      });
      expect(result).toEqual({ data: 'data', filename: 'filename' });
    });

    it('should throw validation exception when data not provided', () => {
      expect(() => validateSchema({
        schema: ChangeAvatarPayloadSchema,
        payload: { filename: 'filename' }
      })).toThrow(ValidationException);
    });
  });
});
