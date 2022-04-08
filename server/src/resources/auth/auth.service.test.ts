import { Role, RolesDao, RolesService } from '../roles';
import { RestApiException } from '../../exceptions';
import { User, UsersDao, UsersService } from '../users';
import { AuthService } from './auth.service';
import { AccessToken } from './auth.types';

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

jest.mock('../users/users.dao', () => ({
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

const mockRolesDaoGet = jest.fn();
const mockRolesDaoCreate = jest.fn();
const mockRolesDaoUpdate = jest.fn();
const mockRolesDaoGetDefault = jest.fn();
const mockRolesDaoSetDefault = jest.fn();
const mockRolesDaoDelete = jest.fn();
const mockRolesServiceIsExists = jest.fn();
jest.mock('../roles/roles.dao', () => ({
  RolesDao: jest.fn().mockImplementation(() => ({
    get: (payload: any): void => mockRolesDaoGet(payload),
    create: (payload: any): void => mockRolesDaoCreate(payload),
    update: (payload: any): void => mockRolesDaoUpdate(payload),
    getDefault: (payload: any): void => mockRolesDaoGetDefault(payload),
    setDefault: (payload: any): void => mockRolesDaoSetDefault(payload),
    delete: (payload: any): void => mockRolesDaoDelete(payload),
    isExists: (payload: any): void => mockRolesServiceIsExists(payload)
  }))
}));

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => ({}))
}));

const mockJwtSign = jest.fn();
const mockJwtVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  sign: jest.fn().mockImplementation((): string => mockJwtSign()),
  verify: jest.fn().mockImplementation((): string => mockJwtVerify())
}));

describe('auth-service', () => {
  const mockRole: Role = {
    _id: 'role-id',
    name: 'role-name',
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
  const mockUser: User = {
    _id: 'id-1',
    username: 'username-1',
    fullname: 'fullname-1',
    role: mockRole
  };
  const mockAccessToken = 'generated-access-token';
  const mockRefreshToken = 'generated-refresh-token';
  const mockUserToken: AccessToken = {
    user: {
      ...mockUser,
      role: {
        _id: mockRole._id,
        name: mockRole.name,
        desc: mockRole.desc
      }
    },
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    expiresIn: 3600
  };

  mockUsersDaoAuthenticate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoGet.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoIsUsernameAvailable.mockReturnValue(Promise.resolve(true));
  mockUsersDaoIsEmailAvailable.mockReturnValue(Promise.resolve(true));
  mockUsersDaoCreate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoCreate.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoChangeRole.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoChangeAvatar.mockReturnValue(Promise.resolve(mockUser));
  mockUsersDaoDelete.mockReturnValue(Promise.resolve(mockUser._id));
  mockRolesServiceIsExists.mockReturnValue(Promise.resolve(true));

  mockRolesDaoGet.mockReturnValue(Promise.resolve(mockRole));
  mockRolesDaoCreate.mockReturnValue(Promise.resolve(mockRole));
  mockRolesDaoUpdate.mockReturnValue(Promise.resolve(mockRole));
  mockRolesDaoGetDefault.mockReturnValue(Promise.resolve(mockRole));
  mockRolesDaoSetDefault.mockReturnValue(Promise.resolve(mockRole));
  mockRolesDaoDelete.mockReturnValue(Promise.resolve(mockRole._id));
  mockRolesServiceIsExists.mockReturnValue(Promise.resolve(true));

  const rolesService = new RolesService({ rolesDao: new RolesDao() });
  const usersService = new UsersService({
    usersDao: new UsersDao(),
    rolesService: rolesService
  });
  const authService = new AuthService({
    usersService,
    rolesService
  });

  beforeEach(() => {
    mockJwtSign.mockReturnValueOnce(mockAccessToken);
    mockJwtSign.mockReturnValueOnce(mockRefreshToken);
    mockJwtVerify.mockReturnValue(mockUserToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should successfully return user', async () => {
      const user = await authService.getUser(mockUser._id);
      expect(mockUsersDaoGet).toHaveBeenCalled();
      expect(user).toEqual(user);
    });

    it('should throw an error when role not found', async () => {
      mockUsersDaoGet.mockRejectedValueOnce(new RestApiException('not found'));

      await expect(authService.getUser(mockUser._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('authenticate', () => {
    it('should successfully authenticate user', async () => {
      const user = await authService.authenticate({
        username: 'username',
        password: 'password'
      });
      expect(mockUsersDaoAuthenticate).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should throw an error when usersDao.authenticate throw an error', async () => {
      mockUsersDaoAuthenticate.mockRejectedValueOnce(new RestApiException('not found'));

      await expect(authService.authenticate({
        username: 'username',
        password: 'password'
      })).rejects.toThrow(RestApiException);
    });
  });

  describe('login', () => {
    it('should successfully authenticate user', async () => {
      const token = await authService.login({
        username: 'username',
        password: 'password'
      });
      expect(mockUsersDaoAuthenticate).toHaveBeenCalled();
      expect(token).toEqual(mockUserToken);
    });

    it('should throw an error when usersDao.authenticate throw an error', async () => {
      mockUsersDaoAuthenticate.mockRejectedValueOnce(new RestApiException('not found'));

      await expect(authService.login({
        username: 'username',
        password: 'password'
      })).rejects.toThrow(RestApiException);
    });
  });

  describe('verify', () => {
    it('should successfully verify authenticated user', async () => {
      const token = await authService.verify(mockUser);
      expect(mockJwtSign).toHaveBeenCalledTimes(2);
      expect(token).toEqual(mockUserToken);
    });
  });

  describe('refresh', () => {
    it('should successfully verify authenticated user', async () => {
      const token = await authService.refresh('refresh-token');
      expect(mockJwtVerify).toHaveBeenCalled();
      expect(mockJwtSign).toHaveBeenCalledTimes(2);
      expect(token).toEqual(mockUserToken);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockJwtVerify.mockReturnValueOnce(null);
      await expect(authService.refresh('refresh-token')).rejects.toThrowError();
      expect(mockJwtSign).not.toHaveBeenCalled();
    });
  });
});
