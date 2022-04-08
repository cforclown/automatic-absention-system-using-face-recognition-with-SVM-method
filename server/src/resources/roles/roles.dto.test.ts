import { validateSchema } from '../../utils/validate-schema';
import { ValidationException } from '../../exceptions/validation-exception';
import { CreateRolePayloadSchema, FindRolesSchema, RoleSchema } from './roles.dto';
import { CreateRolePayload, FindRolesPayload, Role } from './roles.types';

describe('roles-data-transfer-object', () => {
  const findRolesPayload: FindRolesPayload = {
    query: '',
    pagination: {
      page: 1,
      limit: 10,
      sort: {
        by: 'name',
        order: 1
      }
    }
  };
  const createRolePayload: CreateRolePayload = {
    name: 'name',
    permissions: {
      users: {
        view: true,
        create: false,
        update: false,
        delete: false
      },
      masterData: {
        view: true,
        create: false,
        update: false,
        delete: false
      }
    },
    desc: 'desc'
  };
  const role: Role = {
    _id: 'id',
    name: 'name',
    permissions: {
      users: {
        view: true,
        create: false,
        update: false,
        delete: false
      },
      masterData: {
        view: true,
        create: false,
        update: false,
        delete: false
      }
    },
    desc: 'desc'
  };

  describe('FindRolesSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: FindRolesSchema, payload: findRolesPayload });
      expect(result).toEqual(findRolesPayload);
    });

    it('should throw validation exception when page not provided', () => {
      expect(() => validateSchema({
        schema: FindRolesSchema,
        payload: {
          query: '',
          pagination: {
            limit: 10,
            sort: {
              by: 'name',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when limit not provided', () => {
      expect(() => validateSchema({
        schema: FindRolesSchema,
        payload: {
          query: '',
          pagination: {
            page: 1,
            sort: {
              by: 'name',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });
  });

  describe('CreateRolePayloadSchema', () => {
    it('should return validated values when payload is valid', () => {
      const result = validateSchema({ schema: CreateRolePayloadSchema, payload: createRolePayload });
      expect(result).toEqual(createRolePayload);
    });

    it('should return validated values when permissions not provided', () => {
      const result = validateSchema({
        schema: CreateRolePayloadSchema,
        payload: {
          ...createRolePayload,
          permissions: undefined
        }
      });
      expect(result).toEqual({
        ...createRolePayload,
        permissions: undefined
      });
    });

    it('should throw validation exception when name not provided', () => {
      expect(() => validateSchema({
        schema: CreateRolePayloadSchema,
        payload: {
          ...createRolePayload,
          name: undefined
        }
      })).toThrow(ValidationException);
    });
  });

  describe('RoleSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema<CreateRolePayload>({
        schema: RoleSchema,
        payload: role
      });
      expect(result).toEqual(role);
    });

    it('should throw validation exception when name not provided', () => {
      expect(() => validateSchema({
        schema: CreateRolePayloadSchema,
        payload: {
          ...role,
          name: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when permissions not provided', () => {
      expect(() => validateSchema({
        schema: CreateRolePayloadSchema,
        payload: {
          ...role,
          permissions: undefined
        }
      })).toThrow(ValidationException);
    });
  });
});
