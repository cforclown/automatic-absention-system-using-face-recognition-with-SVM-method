import { RestApiException } from '../../exceptions';
import { RolesDao } from './roles.dao';
import { CreateRolePayload, FindRolesPayload, Role } from './roles.types';
import { MockMongooseModel } from '../../../__mock__';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => (MockMongooseModel))
}));

describe('roles-dao', () => {
  const mockRole1: Role = {
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
  const mockRole2: Role = {
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

  const rolesDao = new RolesDao();

  MockMongooseModel.mockSelect.mockImplementation(() => ({
    exec: (payload: any): void => MockMongooseModel.mockExec(payload)
  }));
  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockRole1));
  MockMongooseModel.mockPopulate.mockReturnValue(Promise.resolve());

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully get role', async () => {
      const role = await rolesDao.get(mockRole1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(role).toEqual(mockRole1);
    });

    it('should throw an error when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const role = await rolesDao.get(mockRole1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(role).toEqual(null);
    });

    it('should throw an error when model.findById throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(rolesDao.get(mockRole1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('find', () => {
    const expectedRoles = {
      ...findRolesPayload,
      pagination: {
        ...findRolesPayload.pagination,
        pageCount: 1
      },
      data: [mockRole1, mockRole2]
    };

    beforeEach(() => {
      MockMongooseModel.mockAggregate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [{
          total: 2
        }],
        data: [mockRole1, mockRole2]
      }]));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully find roles', async () => {
      const roles = await rolesDao.find(findRolesPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(roles).toEqual(expectedRoles);
    });

    it('should successfully find roles (0)', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [],
        data: []
      }]));
      const roles = await rolesDao.find(findRolesPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(roles).toEqual({
        ...findRolesPayload,
        pagination: {
          ...findRolesPayload.pagination,
          pageCount: 0
        },
        data: []
      });
    });

    it('should throw an error when model.aggregate throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(rolesDao.find(findRolesPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create an role', async () => {
      const role = await rolesDao.create(createRolePayload);
      expect(MockMongooseModel.mockCreate).toHaveBeenCalled();
      expect(role).toEqual(mockRole1);
    });

    it('should throw an error when document.save throw an error', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new Error());
      await expect(rolesDao.create(createRolePayload)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully update role', async () => {
      const role = await rolesDao.update(mockRole1);
      expect(MockMongooseModel.mockFindOneAndUpdate).toHaveBeenCalled();
      expect(role).toEqual(mockRole1);
    });

    it('should throw an error when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(rolesDao.update(mockRole1)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when document.updateOne() throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(rolesDao.update(mockRole1)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    const expectedResult = {
      ...mockRole1,
      archived: true
    };
    beforeEach(() => {
      MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
        exec: (): void => MockMongooseModel.mockExec()
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(expectedResult));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully delete role', async () => {
      const deletedRoleId = await rolesDao.delete(mockRole1._id);
      expect(MockMongooseModel.mockFindOneAndUpdate).toHaveBeenCalled();
      expect(deletedRoleId).toEqual(expectedResult);
    });

    it('should throw api error when deletedCount is 0', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(rolesDao.delete(mockRole1._id)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.deleteOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(rolesDao.delete(mockRole1._id)).rejects.toThrowError();
    });
  });

  describe('getDefault', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully get role', async () => {
      const role = await rolesDao.getDefault();
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(role).toEqual(mockRole1);
    });

    it('should throw an error when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(rolesDao.getDefault()).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(rolesDao.getDefault()).rejects.toThrowError();
    });
  });

  describe('setDefault', () => {
    const mockUpdateManyExec = jest.fn();
    async function executeSetDefaultRole (roleId: string): Promise<Role> {
      const response = await rolesDao.setDefault(roleId) as any;
      response.save = undefined;
      return response;
    }

    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockRole1,
        save: (): void => MockMongooseModel.mockSave(Promise.resolve())
      }));
      MockMongooseModel.mockUpdateMany.mockImplementation(() => ({
        exec: (payload: any): void => mockUpdateManyExec(payload)
      }));
      mockUpdateManyExec.mockReturnValue(Promise.resolve());
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully set default role', async () => {
      const defaultRole = await executeSetDefaultRole(mockRole1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(mockUpdateManyExec).toHaveBeenCalled();
      expect(defaultRole).toEqual({
        ...mockRole1,
        default: true
      });
    });

    it('should throw api exception when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(executeSetDefaultRole(mockRole1._id)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.updateMany throw an error', async () => {
      mockUpdateManyExec.mockRejectedValueOnce(new Error());
      await expect(executeSetDefaultRole(mockRole1._id)).rejects.toThrowError();
    });

    it('should throw an error when document.save throw an error', async () => {
      MockMongooseModel.mockSave.mockRejectedValueOnce(new Error());
      await expect(executeSetDefaultRole(mockRole1._id)).rejects.toThrowError();
    });
  });
});
