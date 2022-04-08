import { CreateUserPayload, FindUsersPayload, User, UserAvatar, UsersDao } from '.';
import { RolesDao, RolesService } from '..';
import { RestApiException } from '../../exceptions';
import { SortOrder } from '../../types';
import { UsersService } from './users.service';

const mockUsersDaoAuthenticate = jest.fn();
const mockUsersDaoGet = jest.fn();
const mockUsersDaoFind = jest.fn();
const mockUsersDaoIsUsernameAvailable = jest.fn();
const mockUsersDaoIsEmailAvailable = jest.fn();
const mockUsersDaoCreate = jest.fn();
const mockUsersDaoUpdate = jest.fn();
const mockUsersDaoChangeRole = jest.fn();
const mockUsersDaoGetUserAvatar = jest.fn();
const mockUsersDaoChangeAvatar = jest.fn();
const mockUsersDaoDelete = jest.fn();
jest.mock('./users.dao', () => ({
  UsersDao: jest.fn().mockImplementation(() => ({
    authenticate: (payload: any): void => mockUsersDaoAuthenticate(payload),
    get: (payload: any): void => mockUsersDaoGet(payload),
    find: (payload: any): void => mockUsersDaoFind(payload),
    isUsernameAvailable: (payload: any): void => mockUsersDaoIsUsernameAvailable(payload),
    isEmailAvailable: (payload: any): void => mockUsersDaoIsEmailAvailable(payload),
    create: (payload: any): void => mockUsersDaoCreate(payload),
    update: (payload: any): void => mockUsersDaoUpdate(payload),
    changeRole: (payload: any): void => mockUsersDaoChangeRole(payload),
    getUserAvatar: (payload: any): void => mockUsersDaoGetUserAvatar(payload),
    changeUserAvatar: (payload: any): void => mockUsersDaoChangeAvatar(payload),
    delete: (payload: any): void => mockUsersDaoDelete(payload)
  }))
}));

const mockRolesServiceGet = jest.fn();
jest.mock('../roles/roles.service', () => ({
  RolesService: jest.fn().mockImplementation(() => ({
    get: (payload: any): void => mockRolesServiceGet(payload)
  }))
}));

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => ({}))
}));

describe('users-service', () => {
  const mockFindUsersPayload: FindUsersPayload = {
    query: '',
    pagination: {
      page: 1,
      limit: 10,
      sort: {
        by: 'fullname',
        order: SortOrder.ASC
      }
    }
  };
  const mockCreateUserPayload: CreateUserPayload = {
    username: 'username',
    fullname: 'fullname',
    email: 'email',
    password: 'password',
    role: 'role'
  };
  const mockCreateUserPayloadWithoutEmail: CreateUserPayload = {
    username: 'username',
    fullname: 'fullname',
    password: 'password',
    role: 'role'
  };
  const mockUser1Avatar: UserAvatar = {
    data: 'data',
    filename: 'filename'
  };
  const mockUser1: User = {
    _id: 'id-1',
    username: 'username-1',
    fullname: 'fullname-1',
    role: 'role',
    avatar: mockUser1Avatar
  };
  const mockUser2: User = {
    _id: 'id-2',
    username: 'username-2',
    fullname: 'fullname-2',
    role: 'role'
  };

  mockUsersDaoAuthenticate.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoGet.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoFind.mockReturnValue(Promise.resolve({
    ...mockFindUsersPayload,
    pagination: {
      ...mockFindUsersPayload.pagination,
      pageCount: 1
    },
    data: [mockUser1, mockUser2]
  }));
  mockUsersDaoIsUsernameAvailable.mockReturnValue(Promise.resolve(true));
  mockUsersDaoIsEmailAvailable.mockReturnValue(Promise.resolve(true));
  mockUsersDaoCreate.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoCreate.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoChangeRole.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoChangeAvatar.mockReturnValue(Promise.resolve(mockUser1));
  mockUsersDaoDelete.mockReturnValue(Promise.resolve(mockUser1._id));
  mockRolesServiceGet.mockReturnValue(Promise.resolve(true));

  const usersService = new UsersService({
    usersDao: new UsersDao(),
    rolesService: new RolesService({
      rolesDao: new RolesDao()
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should successfully return user', async () => {
      const user = await usersService.authenticate({ username: 'username', password: 'password' });
      expect(mockUsersDaoAuthenticate).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should throw an error when user not found', async () => {
      mockUsersDaoAuthenticate.mockReturnValueOnce(null);

      const user = await usersService.authenticate({ username: 'username', password: 'password' });
      expect(user).toEqual(null);
    });

    it('should throw an error when dao throw an error', async () => {
      mockUsersDaoAuthenticate.mockRejectedValueOnce(new Error('error'));

      await expect(usersService.authenticate({ username: 'username', password: 'password' })).rejects.toThrowError();
    });
  });

  describe('get', () => {
    it('should successfully return user', async () => {
      const user = await usersService.get(mockUser1._id);
      expect(mockUsersDaoGet).toHaveBeenCalled();
      expect(user).toEqual(mockUser1);
    });

    it('should throw an error when user not found', async () => {
      mockUsersDaoGet.mockReturnValueOnce(null);

      const user = await usersService.get(mockUser1._id);
      expect(user).toEqual(null);
    });

    it('should throw an error when user not found', async () => {
      mockUsersDaoGet.mockRejectedValueOnce(new RestApiException('not found'));

      await expect(usersService.get(mockUser1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('find', () => {
    it('should successfully find users', async () => {
      const response = await usersService.find(mockFindUsersPayload);
      expect(mockUsersDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([mockUser1, mockUser2]);
    });

    it('should return empty users', async () => {
      mockUsersDaoFind.mockReturnValue(Promise.resolve({
        ...mockFindUsersPayload,
        pagination: {
          ...mockFindUsersPayload.pagination,
          pageCount: 1
        },
        data: []
      }));

      const response = await usersService.find(mockFindUsersPayload);
      expect(mockUsersDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([]);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoFind.mockRejectedValueOnce(new RestApiException('internal server error', 500));

      await expect(usersService.find(mockFindUsersPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('is-username-available', () => {
    it('should successfully return username availability', async () => {
      const response = await usersService.isUsernameAvailable(mockUser1._id);
      expect(mockUsersDaoIsUsernameAvailable).toHaveBeenCalled();
      expect(response).toEqual(true);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoIsUsernameAvailable.mockRejectedValueOnce(new RestApiException('internal server error', 500));

      await expect(usersService.isUsernameAvailable(mockUser1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('is-email-available', () => {
    it('should successfully return email availability', async () => {
      const response = await usersService.isEmailAvailable('email');
      expect(mockUsersDaoIsEmailAvailable).toHaveBeenCalled();
      expect(response).toEqual(true);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoIsEmailAvailable.mockRejectedValueOnce(new RestApiException('internal server error', 500));

      await expect(usersService.isEmailAvailable('email')).rejects.toThrow(RestApiException);
    });
  });

  describe('create', () => {
    it('should successfully create a user without email', async () => {
      const response = await usersService.create(mockCreateUserPayloadWithoutEmail);
      expect(mockUsersDaoIsUsernameAvailable).toHaveBeenCalled();
      expect(mockRolesServiceGet).toHaveBeenCalled();
      expect(mockUsersDaoIsEmailAvailable).not.toHaveBeenCalled();
      expect(mockRolesServiceGet).toHaveBeenCalled();
      expect(response).toEqual(mockUser1);
    });

    it('should successfully create a user with email', async () => {
      const response = await usersService.create(mockCreateUserPayload);
      expect(mockUsersDaoIsUsernameAvailable).toHaveBeenCalled();
      expect(mockRolesServiceGet).toHaveBeenCalled();
      expect(mockUsersDaoIsEmailAvailable).toHaveBeenCalled();
      expect(mockRolesServiceGet).toHaveBeenCalled();
      expect(response).toEqual(mockUser1);
    });

    it('should throw an error when username is taken', async () => {
      mockUsersDaoIsUsernameAvailable.mockReturnValueOnce(Promise.resolve(false));

      await expect(usersService.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when the email is already registered', async () => {
      mockUsersDaoIsEmailAvailable.mockReturnValueOnce(Promise.resolve(false));

      await expect(usersService.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when role is not valid', async () => {
      mockUsersDaoIsEmailAvailable.mockReturnValueOnce(Promise.resolve(false));

      await expect(usersService.create(mockCreateUserPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    it('should successfully update a user', async () => {
      mockUsersDaoUpdate.mockReturnValueOnce(Promise.resolve(mockUser1));
      const response = await usersService.update({ _id: 'id', fullname: 'fullname' });
      expect(mockUsersDaoUpdate).toHaveBeenCalled();
      expect(response).toEqual(mockUser1);
    });

    it('should successfully update a user', async () => {
      mockUsersDaoUpdate.mockReturnValueOnce(Promise.resolve(mockUser1));
      const response = await usersService.update({ _id: 'id', fullname: 'fullname', username: 'username', email: 'email' });
      expect(mockUsersDaoUpdate).toHaveBeenCalled();
      expect(mockUsersDaoIsUsernameAvailable).toHaveBeenCalled();
      expect(mockUsersDaoIsEmailAvailable).toHaveBeenCalled();
      expect(response).toEqual(mockUser1);
    });

    it('should throw an error when _id is provided', async () => {
      await expect(usersService.update({ _id: 'id' })).rejects.toThrow(RestApiException);
    });

    it('should throw an error when username is taken', async () => {
      mockUsersDaoIsUsernameAvailable.mockReturnValueOnce(Promise.resolve(false));
      await expect(usersService.update({ _id: 'id', username: 'username' })).rejects.toThrow(RestApiException);
    });

    it('should throw an error when the email is already registered', async () => {
      mockUsersDaoIsEmailAvailable.mockReturnValueOnce(Promise.resolve(false));
      await expect(usersService.update({ _id: 'id', email: 'email' })).rejects.toThrow(RestApiException);
    });

    it('should throw an error when usersDao throw an error', async () => {
      mockUsersDaoUpdate.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(usersService.update({ _id: 'id', fullname: 'fullname' })).rejects.toThrow(RestApiException);
    });
  });

  describe('getUserAvatar', () => {
    it('should successfully get user avatar', async () => {
      mockUsersDaoGetUserAvatar.mockReturnValueOnce(Promise.resolve(mockUser1.avatar));
      const response = await usersService.getUserAvatar(mockUser1._id);
      expect(mockUsersDaoGetUserAvatar).toHaveBeenCalled();
      expect(response).toEqual(mockUser1.avatar);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoGetUserAvatar.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(usersService.getUserAvatar(mockUser1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('changeAvatar', () => {
    it('should successfully change user avatar', async () => {
      mockUsersDaoChangeAvatar.mockReturnValueOnce(Promise.resolve(mockUser1));
      const response = await usersService.changeUserAvatar('userId', {
        data: 'data',
        filename: 'filename'
      });
      expect(mockUsersDaoChangeAvatar).toHaveBeenCalled();
      expect(response).toEqual(mockUser1);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoChangeAvatar.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(usersService.changeUserAvatar('userId', {
        data: 'data',
        filename: 'filename'
      })).rejects.toThrow(RestApiException);
    });
  });

  describe('delete', () => {
    it('should successfully delete a user', async () => {
      mockUsersDaoDelete.mockReturnValueOnce(Promise.resolve('userId'));
      const response = await usersService.delete('userId');
      expect(mockUsersDaoDelete).toHaveBeenCalled();
      expect(response).toEqual('userId');
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoDelete.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(usersService.delete('userId')).rejects.toThrow(RestApiException);
    });
  });

  describe('getUserPermissions', () => {
    it('should successfully delete a user', async () => {
      mockUsersDaoGet.mockReturnValueOnce(Promise.resolve(mockUser1));
      const response = await usersService.getUserPermissions('userId');
      expect(mockUsersDaoGet).toHaveBeenCalled();
      expect(response).toEqual(mockUser1.role);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockUsersDaoGet.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(usersService.getUserPermissions('userId')).rejects.toThrow(RestApiException);
    });
  });
});
