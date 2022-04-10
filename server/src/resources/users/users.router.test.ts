import { when } from 'jest-when';
import request from 'supertest';
import { setup } from '../../di-config';
import App from '../../app';
import { MockRolesModel, MockUsersModel } from '../../../__mock__';
import { FindUsersPayload, User } from './users.types';
import { Role } from '../roles';
import { HttpCodes } from '../../exceptions';
import { SortOrder } from '../../types';

const mockJWTVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn().mockImplementation((token: string, secret: string) => mockJWTVerify(token, secret))
}));

const mockModel = jest.fn();
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation((collection: string): string => mockModel(collection))
}));

describe('users-router', () => {
  let app: any;

  const mockUserRole: Role = {
    _id: 'admin',
    name: 'admin',
    permissions: {
      users: {
        view: true,
        create: true,
        update: true,
        delete: true
      },
      masterData: {
        view: true,
        create: true,
        update: true,
        delete: true
      }
    },
    desc: ''
  };
  const mockUser1: User = {
    _id: 'id-1',
    username: 'username-1',
    fullname: 'fullname-1',
    role: mockUserRole
  };
  const mockUser2: User = {
    _id: 'id-2',
    username: 'username-2',
    fullname: 'fullname-2',
    role: mockUserRole
  };

  when(mockModel).calledWith('users').mockReturnValue(MockUsersModel);
  MockUsersModel.mockSelect.mockImplementation(() => ({
    exec: (payload: any): void => MockUsersModel.mockExec(payload)
  }));
  MockUsersModel.mockCreate.mockImplementation(() => Promise.resolve(mockUser1));
  MockUsersModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));

  when(mockModel).calledWith('roles').mockReturnValue(MockRolesModel);
  MockRolesModel.mockFindOne.mockImplementation(() => ({
    exec: (payload: any): void => MockRolesModel.mockExec(payload)
  }));
  MockRolesModel.mockExec.mockReturnValue(Promise.resolve(mockUserRole));

  mockJWTVerify.mockReturnValue(mockUser1);

  function expectCorrectUser (value: Record<string, any>, source: User): void {
    expect(value).toHaveProperty('_id');
    expect(value._id).toEqual(source._id);
    expect(value).toHaveProperty('fullname');
    expect(value.fullname).toEqual(source.fullname);
    expect(value).toHaveProperty('username');
    expect(value.username).toEqual(source.username);
    if (source.email) {
      expect(value).toHaveProperty('email');
      expect(value.email).toEqual(source.email);
    }
    expect(value).toHaveProperty('role');
    expect(value.role).toEqual(source.role);
  }

  beforeAll(() => {
    setup();
    app = App();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    beforeEach(() => {
      MockUsersModel.mockFindOne.mockImplementation(() => ({
        populate: (payload: any): void => MockUsersModel.mockPopulate(payload)
      }));
      MockUsersModel.mockPopulate.mockImplementation(() => ({
        select: (payload: any): void => MockUsersModel.mockSelect(payload)
      }));
      MockUsersModel.mockSelect.mockImplementation(() => ({
        exec: (payload: any): void => MockUsersModel.mockExec(payload)
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully return user', async () => {
      const response = await request(app)
        .get(`/api/users/${mockUser1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser1);
    });

    it('should return 404 when user not found', async () => {
      MockUsersModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .get(`/api/users/${mockUser1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.NotFound);
    });
  });

  describe('find', () => {
    const mockFindUsersPayload: FindUsersPayload = {
      query: 'query',
      pagination: {
        page: 1,
        limit: 10,
        sort: {
          order: SortOrder.ASC,
          by: 'fullname'
        }
      }
    };

    beforeEach(() => {
      MockUsersModel.mockAggregate.mockImplementation(() => ({
        exec: (payload: any): void => MockUsersModel.mockExec(payload)
      }));
      MockUsersModel.mockExec.mockReturnValue(Promise.resolve([{
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
      const response = await request(app)
        .post('/api/users/find')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockFindUsersPayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual({
        ...mockFindUsersPayload,
        pagination: {
          ...mockFindUsersPayload.pagination,
          pageCount: 1
        },
        data: [
          mockUser1,
          mockUser2
        ]
      });
    });

    it('should return empty users', async () => {
      MockUsersModel.mockExec.mockReturnValueOnce(Promise.resolve([{
        metadata: [{
          total: 0
        }],
        data: []
      }]));

      const response = await request(app)
        .post('/api/users/find')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockFindUsersPayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual({
        ...mockFindUsersPayload,
        pagination: {
          ...mockFindUsersPayload.pagination,
          pageCount: 0
        },
        data: []
      });
    });

    it('should return internal server error', async () => {
      MockUsersModel.mockExec.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .post('/api/users/find')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockFindUsersPayload)
        .expect(HttpCodes.Internal);
    });
  });

  describe('is-username-available', () => {
    beforeEach(() => {
      MockUsersModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockUsersModel.mockExec(payload)
      }));
      MockUsersModel.mockExec.mockReturnValue(Promise.resolve(mockUser1));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully return username availability (false)', async () => {
      const response = await request(app)
        .get('/api/users/username/available/check-username')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(false);
    });

    it('should successfully return username availability (true)', async () => {
      MockUsersModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const response = await request(app)
        .get('/api/users/username/available/username-to-check')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(true);
    });

    it('should successfully return username availability when excludeSelf provided', async () => {
      MockUsersModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const response = await request(app)
        .get('/api/users/username/available/username-to-check?excludeSelf=true')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(true);
    });

    it('should return internal server error', async () => {
      MockUsersModel.mockExec.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .get('/api/users/username/available/username-to-check')
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Internal);
    });
  });

  describe('create', () => {
    const mockCreateUserPayload = {
      username: 'username',
      fullname: 'fullname',
      email: 'email@email.com',
      role: 'role'
    };
    const mockCreateUserPayloadWithoutEmail = {
      username: 'username',
      fullname: 'fullname',
      role: 'role'
    };

    beforeEach(() => {
      when(MockUsersModel.mockFindOne).calledWith({
        username: mockCreateUserPayload.username,
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(null)
      });
      when(MockUsersModel.mockFindOne).calledWith({
        email: mockCreateUserPayload.email,
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(null)
      });
      MockUsersModel.mockPopulate.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create a user with email', async () => {
      const response = await request(app)
        .post('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateUserPayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser1);
    });

    it('should successfully create a user without email', async () => {
      const response = await request(app)
        .post('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateUserPayloadWithoutEmail)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockUser1);
    });

    it('should fail create user when username is taken', async () => {
      when(MockUsersModel.mockFindOne).calledWith({
        username: mockCreateUserPayload.username,
        archived: false
      }).mockReturnValueOnce({
        exec: () => Promise.resolve(mockUser2)
      });

      const response = await request(app)
        .post('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateUserPayloadWithoutEmail)
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });

    it('should fail create user when the email is already registered', async () => {
      when(MockUsersModel.mockFindOne).calledWith({
        email: mockCreateUserPayload.email,
        archived: false
      }).mockReturnValueOnce({
        exec: () => Promise.resolve(mockUser2)
      });

      const response = await request(app)
        .post('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateUserPayload)
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });

    it('should fail create user when role is not valid', async () => {
      MockRolesModel.mockExec.mockReturnValue(Promise.resolve(null));

      const response = await request(app)
        .post('/api/users')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateUserPayload)
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });

  describe('changeRole', () => {
    beforeEach(() => {
      when(MockUsersModel.mockFindOne).calledWith({
        _id: mockUser1._id,
        archived: false
      }).mockReturnValue({
        select: (): Record<string, any> => ({
          exec: async (): Promise<User> => Promise.resolve({
            ...mockUser1,
            save: () => jest.fn().mockImplementation(() => Promise.resolve())
          })
        })
      });
      MockUsersModel.mockPopulate.mockReturnValue(Promise.resolve());
      MockRolesModel.mockExec.mockReturnValue(Promise.resolve(mockUserRole));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully change user role', async () => {
      const response = await request(app)
        .put('/api/users/change-role')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: mockUser1._id, role: 'new-role-id' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectUser(body.data, {
        ...mockUser1,
        role: 'new-role-id'
      });
    });

    it('should throw an error when role id is invalid', async () => {
      MockRolesModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const response = await request(app)
        .put('/api/users/change-role')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: mockUser1._id, role: 'new-role-id' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
      expect(body.error).toBeTruthy();
    });
  });

  describe('update profile', () => {
    beforeEach(() => {
      when(MockUsersModel.mockFindOne).calledWith({
        _id: mockUser1._id,
        archived: false
      }).mockReturnValue({
        select: (): Record<string, any> => ({
          exec: async (): Promise<User> => Promise.resolve({
            ...mockUser1,
            save: () => jest.fn().mockImplementation(() => Promise.resolve())
          })
        })
      });
      when(MockUsersModel.mockFindOne).calledWith({
        username: 'username',
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(null)
      });
      when(MockUsersModel.mockFindOne).calledWith({
        email: 'email',
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(null)
      });
      MockUsersModel.mockPopulate.mockReturnValue(Promise.resolve());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully update a user', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ fullname: 'new-fullname' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectUser(body.data, {
        ...mockUser1,
        fullname: 'new-fullname'
      });
    });

    it('should successfully update a user', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ fullname: 'fullname', username: 'username', email: 'email' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectUser(body.data, {
        ...mockUser1,
        fullname: 'fullname',
        username: 'username',
        email: 'email'
      });
    });

    it('should throw an error when _id is provided', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: 'id' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
      expect(body.error).toBeTruthy();
    });

    it('should throw an error when username is taken', async () => {
      when(MockUsersModel.mockFindOne).calledWith({
        username: 'username',
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(mockUser2)
      });

      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: 'id', username: 'username' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
      expect(body.error).toBeTruthy();
    });

    it('should throw an error when the email is already registered', async () => {
      when(MockUsersModel.mockFindOne).calledWith({
        email: 'email',
        archived: false
      }).mockReturnValue({
        exec: () => Promise.resolve(mockUser2)
      });

      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: 'id', email: 'email' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
      expect(body.error).toBeTruthy();
    });

    it('should throw an error when usersDao throw an error', async () => {
      when(MockUsersModel.mockFindOne).calledWith({
        _id: mockUser1._id,
        archived: false
      }).mockReturnValue({
        select: async (): Promise<Record<string, any>> => Promise.resolve({
          exec: async (): Promise<User> => Promise.reject(new Error('error'))
        })
      });

      const response = await request(app)
        .put('/api/users/profile')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ fullname: 'fullname', username: 'username', email: 'email' })
        .expect(HttpCodes.Internal);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
      expect(body.error).toBeTruthy();
    });
  });

  // describe('getUserAvatar', () => {
  //   it('should successfully get user avatar', async () => {
  //     mockUsersDaoGetUserAvatar.mockReturnValueOnce(Promise.resolve(mockUser1.avatar));
  //     const response = await usersService.getUserAvatar(mockUser1._id);
  //     expect(mockUsersDaoGetUserAvatar).toHaveBeenCalled();
  //     expect(response).toEqual(mockUser1.avatar);
  //   });

  //   it('should throw an error when data access object throw an error', async () => {
  //     mockUsersDaoGetUserAvatar.mockRejectedValueOnce(new RestApiException('internal server error', 500));
  //     await expect(usersService.getUserAvatar(mockUser1._id)).rejects.toThrow(RestApiException);
  //   });
  // });

  // describe('changeAvatar', () => {
  //   it('should successfully change user avatar', async () => {
  //     mockUsersDaoChangeAvatar.mockReturnValueOnce(Promise.resolve(mockUser1));
  //     const response = await usersService.changeUserAvatar('userId', {
  //       data: 'data',
  //       filename: 'filename'
  //     });
  //     expect(mockUsersDaoChangeAvatar).toHaveBeenCalled();
  //     expect(response).toEqual(mockUser1);
  //   });

  //   it('should throw an error when data access object throw an error', async () => {
  //     mockUsersDaoChangeAvatar.mockRejectedValueOnce(new RestApiException('internal server error', 500));
  //     await expect(usersService.changeUserAvatar('userId', {
  //       data: 'data',
  //       filename: 'filename'
  //     })).rejects.toThrow(RestApiException);
  //   });
  // });

  // describe('delete', () => {
  //   it('should successfully delete a user', async () => {
  //     mockUsersDaoDelete.mockReturnValueOnce(Promise.resolve('userId'));
  //     const response = await usersService.delete('userId');
  //     expect(mockUsersDaoDelete).toHaveBeenCalled();
  //     expect(response).toEqual('userId');
  //   });

  //   it('should throw an error when data access object throw an error', async () => {
  //     mockUsersDaoDelete.mockRejectedValueOnce(new RestApiException('internal server error', 500));
  //     await expect(usersService.delete('userId')).rejects.toThrow(RestApiException);
  //   });
  // });

  // describe('getUserPermissions', () => {
  //   it('should successfully delete a user', async () => {
  //     mockUsersDaoGet.mockReturnValueOnce(Promise.resolve(mockUser1));
  //     const response = await usersService.getUserPermissions('userId');
  //     expect(mockUsersDaoGet).toHaveBeenCalled();
  //     expect(response).toEqual(mockUser1.role);
  //   });

  //   it('should throw an error when data access object throw an error', async () => {
  //     mockUsersDaoGet.mockRejectedValueOnce(new RestApiException('internal server error', 500));
  //     await expect(usersService.getUserPermissions('userId')).rejects.toThrow(RestApiException);
  //   });
  // });
});
