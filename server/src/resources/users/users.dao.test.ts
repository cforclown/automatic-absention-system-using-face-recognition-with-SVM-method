import { CreateUserPayload, FindUsersPayload, User, UsersDao } from '.';
import { RestApiException } from '../../exceptions';
import { MockMongooseModel } from '../../../__mock__';
import { ChangeAvatarPayload, UpdateUserPayload } from './users.types';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => (MockMongooseModel))
}));

describe('users-dao', () => {
  const mockUser1: User = {
    _id: 'id-1',
    username: 'username-1',
    fullname: 'fullname-1',
    role: 'role'
  };
  const mockUser2: User = {
    _id: 'id-2',
    username: 'username-2',
    fullname: 'fullname-2',
    role: 'role'
  };
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
  const mockCreateUserPayload: CreateUserPayload & { password: string } = {
    username: 'username',
    fullname: 'fullname',
    email: 'email',
    password: 'password',
    role: 'role'
  };
  const mockCreateUserPayloadWithoutEmail: CreateUserPayload & { password: string } = {
    username: 'username',
    fullname: 'fullname',
    password: 'password',
    role: 'role'
  };
  const mockUpdateUserPayload: UpdateUserPayload = {
    _id: mockUser1._id,
    username: 'username',
    fullname: 'fullname',
    email: 'email'
  };

  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockUser1));
  MockMongooseModel.mockPopulate.mockReturnValue(Promise.resolve());

  const usersDao = new UsersDao();

  MockMongooseModel.mockSelect.mockImplementation(() => ({
    exec: (payload: any): any => MockMongooseModel.mockExec(payload)
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    MockMongooseModel.mockFindOne.mockImplementation(() => ({
      select: (payload: any): void => MockMongooseModel.mockSelect(payload)
    }));

    beforeEach(() => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully authenticate user', async () => {
      const user = await usersDao.authenticate({ username: 'username', password: 'password' });
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.authenticate({ username: 'username', password: 'password' });
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.authenticate({ username: 'username', password: 'password' })).rejects.toThrowError();
    });
  });

  describe('get', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        populate: (payload: any): void => MockMongooseModel.mockPopulate(payload)
      }));
      MockMongooseModel.mockPopulate.mockImplementation(() => ({
        select: (payload: any): void => MockMongooseModel.mockSelect(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully get user', async () => {
      const user = await usersDao.get(mockUser1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const user = await usersDao.get(mockUser1._id);
      expect(user).toEqual(null);
    });

    it('should throw an error when model.findById throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.get(mockUser1._id)).rejects.toThrowError();
    });
  });

  describe('find', () => {
    const expectedUsers = {
      ...mockFindUsersPayload,
      pagination: {
        ...mockFindUsersPayload.pagination,
        pageCount: 1
      },
      data: [mockUser1, mockUser2]
    };

    beforeEach(() => {
      MockMongooseModel.mockAggregate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [{
          total: 2
        }],
        data: [mockUser1, mockUser2]
      }]));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully find users', async () => {
      const users = await usersDao.find(mockFindUsersPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(users).toEqual(expectedUsers);
    });

    it('should successfully find users (0)', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [],
        data: []
      }]));
      const users = await usersDao.find(mockFindUsersPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(users).toEqual({
        ...mockFindUsersPayload,
        pagination: {
          ...mockFindUsersPayload.pagination,
          pageCount: 0
        },
        data: []
      });
    });

    it('should throw an error when model.aggregate throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));
      await expect(usersDao.find(mockFindUsersPayload)).rejects.toThrowError();
    });
  });

  describe('isUsernameAvailable', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return false when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const isAvailable = await usersDao.isUsernameAvailable('username');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(true);
    });

    it('should successfully return true when user found', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
      const isAvailable = await usersDao.isUsernameAvailable('username');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(false);
    });

    it('should successfully return username availability (true) when exclude param is set', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const isAvailable = await usersDao.isUsernameAvailable('username', mockUser1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(true);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(usersDao.isUsernameAvailable('username')).rejects.toThrow(RestApiException);
    });
  });

  describe('isEmailAvailable', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return false when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const isAvailable = await usersDao.isEmailAvailable('email@email.com');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(true);
    });

    it('should successfully return true when user found', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
      const isAvailable = await usersDao.isEmailAvailable('email@email.com');
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(false);
    });

    it('should successfully return username availability (true) when exclude param is set', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const isAvailable = await usersDao.isEmailAvailable('email@email.com', mockUser1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(isAvailable).toEqual(true);
    });

    it('should throw an error when model.findOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(usersDao.isEmailAvailable('username')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create an user', async () => {
      const user = await usersDao.create(mockCreateUserPayload);
      expect(MockMongooseModel.mockCreate).toHaveBeenCalled();
      expect(MockMongooseModel.mockPopulate).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should successfully create an user without email', async () => {
      const user = await usersDao.create(mockCreateUserPayloadWithoutEmail);
      expect(MockMongooseModel.mockCreate).toHaveBeenCalled();
      expect(MockMongooseModel.mockPopulate).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should throw an error', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new RestApiException('error'));
      await expect(usersDao.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    async function executeUpdateUser (payload: UpdateUserPayload): Promise<User> {
      const response = await usersDao.update(payload) as any;
      response.save = undefined;
      return response;
    }

    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        select: (payload: any): void => MockMongooseModel.mockSelect(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockUser1,
        save: (): void => MockMongooseModel.mockSave(Promise.resolve())
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully update user', async () => {
      const user = await executeUpdateUser(mockUpdateUserPayload);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(MockMongooseModel.mockSave).toHaveBeenCalled();
      expect(user).toEqual({
        ...mockUser1,
        ...mockUpdateUserPayload
      });
    });

    it('should successfully update only users username', async () => {
      const user = await executeUpdateUser({
        _id: mockUser1._id,
        username: 'new-username'
      });
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(MockMongooseModel.mockSave).toHaveBeenCalled();
      expect(user).toEqual({
        ...mockUser1,
        username: 'new-username'
      });
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(executeUpdateUser(mockUpdateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when document.save() throw an error', async () => {
      MockMongooseModel.mockSave.mockRejectedValueOnce(new Error());
      await expect(executeUpdateUser(mockUpdateUserPayload)).rejects.toThrowError();
    });
  });

  describe('getUserAvatar', () => {
    beforeEach(() => {
      mockUser1.avatar = {
        data: 'data',
        filename: 'filename'
      };
      MockMongooseModel.mockFindById.mockImplementation(() => ({
        select: (payload: any): void => MockMongooseModel.mockSelect(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully get user avatar', async () => {
      const avatar = await usersDao.getUserAvatar(mockUser1._id);
      expect(MockMongooseModel.mockFindById).toHaveBeenCalled();
      expect(avatar).toEqual(mockUser1.avatar);
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(usersDao.getUserAvatar(mockUser1._id)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.findById throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(usersDao.getUserAvatar(mockUser1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('changeAvatar', () => {
    const userId = mockUser1._id;
    const avatar = {
      data: 'data',
      filename: 'filename'
    };
    async function executeChangeAvatar (userId: string, payload: ChangeAvatarPayload): Promise<User> {
      const response = await usersDao.changeUserAvatar(userId, payload) as any;
      response.save = undefined;
      return response;
    }

    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        select: (payload: any): void => MockMongooseModel.mockSelect(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockUser1,
        avatar,
        save: (): void => MockMongooseModel.mockSave(Promise.resolve())
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully change user avatar', async () => {
      const user = await executeChangeAvatar(userId, avatar);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(MockMongooseModel.mockSave).toHaveBeenCalled();
      expect(user).toEqual({
        ...mockUser1,
        avatar
      });
    });

    it('should throw an error when user not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(executeChangeAvatar(userId, avatar)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when document.save() throw an error', async () => {
      MockMongooseModel.mockSave.mockRejectedValueOnce(new Error());
      await expect(executeChangeAvatar(userId, avatar)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
        exec: (): void => MockMongooseModel.mockExec()
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockUser1,
        archived: true
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully delete user', async () => {
      const deletedUser = await usersDao.delete(mockUser1._id);
      expect(MockMongooseModel.mockFindOneAndUpdate).toHaveBeenCalled();
      expect(deletedUser).toEqual({
        ...mockUser1,
        archived: true
      });
    });

    it('should throw api error when deletedCount is 0', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(usersDao.delete(mockUser1._id)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.deleteOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(usersDao.get(mockUser1._id)).rejects.toThrowError();
    });
  });
});
