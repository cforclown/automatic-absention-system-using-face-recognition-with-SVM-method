import { CreateRolePayload, FindRolesPayload, Role } from './roles.types';
import { RolesDao } from './roles.dao';
import { RestApiException } from '../../exceptions';
import { SortOrder } from '../../types';
import { RolesService } from './roles.service';

const mockRolesDaoGet = jest.fn();
const mockRolesDaoFind = jest.fn();
const mockRolesDaoCreate = jest.fn();
const mockRolesDaoUpdate = jest.fn();
const mockRolesDaoGetDefault = jest.fn();
const mockRolesDaoSetDefault = jest.fn();
const mockRolesDaoDelete = jest.fn();

jest.mock('./roles.dao', () => ({
  RolesDao: jest.fn().mockImplementation(() => ({
    get: (payload: any): void => mockRolesDaoGet(payload),
    find: (payload: any): void => mockRolesDaoFind(payload),
    create: (payload: any): void => mockRolesDaoCreate(payload),
    update: (payload: any): void => mockRolesDaoUpdate(payload),
    getDefault: (payload: any): void => mockRolesDaoGetDefault(payload),
    setDefault: (payload: any): void => mockRolesDaoSetDefault(payload),
    delete: (payload: any): void => mockRolesDaoDelete(payload)
  }))
}));

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => ({}))
}));

describe('roles-service', () => {
  const findRolesPayload: FindRolesPayload = {
    query: '',
    pagination: {
      page: 1,
      limit: 10,
      sort: {
        by: 'name',
        order: SortOrder.ASC
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
  const role1: Role = {
    _id: 'id-1',
    name: 'name-1',
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
  const role2: Role = {
    _id: 'id-2',
    name: 'name-2',
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

  mockRolesDaoGet.mockReturnValue(Promise.resolve(role1));
  mockRolesDaoFind.mockReturnValue(Promise.resolve({
    ...findRolesPayload,
    pagination: {
      ...findRolesPayload.pagination,
      pageCount: 1
    },
    data: [role1, role2]
  }));
  mockRolesDaoCreate.mockReturnValue(Promise.resolve(role1));
  mockRolesDaoUpdate.mockReturnValue(Promise.resolve(role1));
  mockRolesDaoGetDefault.mockReturnValue(Promise.resolve(role1));
  mockRolesDaoSetDefault.mockReturnValue(Promise.resolve(role1));
  mockRolesDaoDelete.mockReturnValue(Promise.resolve(role1._id));

  const rolesService = new RolesService({ rolesDao: new RolesDao() });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should successfully return role', async () => {
      const role = await rolesService.get(role1._id);
      expect(mockRolesDaoGet).toHaveBeenCalled();
      expect(role).toEqual(role1);
    });

    it('should throw an error when role not found', async () => {
      mockRolesDaoGet.mockReturnValueOnce(Promise.resolve(null));
      const role = await rolesService.get(role1._id);
      expect(mockRolesDaoGet).toHaveBeenCalled();
      expect(role).toEqual(null);
    });

    it('should throw an error when get role throw an error', async () => {
      mockRolesDaoGet.mockRejectedValueOnce(new Error('error'));
      await expect(rolesService.get(role1._id)).rejects.toThrowError();
    });
  });

  describe('find', () => {
    it('should successfully find roles', async () => {
      const response = await rolesService.find(findRolesPayload);
      expect(mockRolesDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([role1, role2]);
    });

    it('should return empty roles', async () => {
      mockRolesDaoFind.mockReturnValue(Promise.resolve({
        ...findRolesPayload,
        pagination: {
          ...findRolesPayload.pagination,
          pageCount: 1
        },
        data: []
      }));

      const response = await rolesService.find(findRolesPayload);
      expect(mockRolesDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([]);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockRolesDaoFind.mockRejectedValueOnce(new RestApiException('internal server error', 500));

      await expect(rolesService.find(findRolesPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('create', () => {
    it('should successfully create a role with email', async () => {
      const response = await rolesService.create(createRolePayload);
      expect(mockRolesDaoCreate).toHaveBeenCalled();
      expect(response).toEqual(role1);
    });

    it('should throw api exception when rolesDao.create throw api exception', async () => {
      mockRolesDaoCreate.mockRejectedValueOnce(new RestApiException('internal'));

      await expect(rolesService.create(createRolePayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    it('should successfully update a role', async () => {
      mockRolesDaoUpdate.mockReturnValueOnce(Promise.resolve(role1));
      const response = await rolesService.update(role1);
      expect(mockRolesDaoUpdate).toHaveBeenCalled();
      expect(response).toEqual(role1);
    });

    it('should throw an error when rolesDao throw an error', async () => {
      mockRolesDaoUpdate.mockRejectedValueOnce(new RestApiException('internal'));
      await expect(rolesService.update(role1)).rejects.toThrow(RestApiException);
    });
  });

  describe('delete', () => {
    it('should successfully delete a role', async () => {
      mockRolesDaoDelete.mockReturnValueOnce(Promise.resolve('roleId'));
      const response = await rolesService.delete('roleId');
      expect(mockRolesDaoDelete).toHaveBeenCalled();
      expect(response).toEqual('roleId');
    });

    it('should throw an error when data access object throw an error', async () => {
      mockRolesDaoDelete.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(rolesService.delete('roleId')).rejects.toThrow(RestApiException);
    });
  });

  describe('getDefault', () => {
    it('should successfully change role avatar', async () => {
      mockRolesDaoGetDefault.mockReturnValueOnce(Promise.resolve(role1));
      const defautRole = await rolesService.getDefault();
      expect(mockRolesDaoGetDefault).toHaveBeenCalled();
      expect(defautRole).toEqual(role1);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockRolesDaoGetDefault.mockRejectedValueOnce(new RestApiException('internal'));
      await expect(rolesService.getDefault()).rejects.toThrow(RestApiException);
    });
  });

  describe('setDefault', () => {
    it('should successfully delete a role', async () => {
      mockRolesDaoSetDefault.mockReturnValueOnce(Promise.resolve(role1));
      const response = await rolesService.setDefault('roleId');
      expect(mockRolesDaoSetDefault).toHaveBeenCalled();
      expect(response).toEqual(role1);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockRolesDaoSetDefault.mockRejectedValueOnce(new RestApiException('internal'));
      await expect(rolesService.setDefault('roleId')).rejects.toThrow(RestApiException);
    });
  });
});
