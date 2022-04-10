import { when } from 'jest-when';
import request from 'supertest';
import { setup } from '../../di-config';
import App from '../../app';
import { MockMongooseModel } from '../../../__mock__';
import { CreateRolePayload, FindRolesPayload, Role } from './roles.types';
import { HttpCodes } from '../../exceptions';
import { SortOrder } from '../../types';
import { User } from '../users';

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

export function expectCorrectRole (value: Record<string, any>, source: Role): void {
  expect(value).toHaveProperty('_id');
  expect(value._id).toEqual(source._id);
  expect(value).toHaveProperty('name');
  expect(value.name).toEqual(source.name);
  expect(value).toHaveProperty('permissions');
  expect(value.permissions).toEqual(source.permissions);
  expect(value).toHaveProperty('desc');
  expect(value.desc).toEqual(source.desc);
}

describe('roles-router', () => {
  let app: any;

  const mockUserAdmin: User = {
    _id: 'id-1',
    username: 'username-1',
    fullname: 'fullname-1',
    role: {
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
    }
  };
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
  const mockCreateRolePayload: CreateRolePayload = {
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

  when(mockModel).calledWith('roles').mockReturnValue(MockMongooseModel);
  MockMongooseModel.mockFindOne.mockImplementation(() => ({
    exec: (payload: any): void => MockMongooseModel.mockExec(payload)
  }));
  MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockRole1));

  mockJWTVerify.mockReturnValue(mockUserAdmin);

  beforeAll(() => {
    setup();
    app = App();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully return role', async () => {
      const response = await request(app)
        .get(`/api/roles/${mockRole1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectRole(body.data, mockRole1);
    });

    it('should return 404 when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .get(`/api/roles/${mockRole1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.NotFound);
    });
  });

  describe('find', () => {
    const mockFindUsersPayload: FindRolesPayload = {
      query: 'query',
      pagination: {
        page: 1,
        limit: 10,
        sort: {
          order: SortOrder.ASC,
          by: 'name'
        }
      }
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

    it('should successfully find users', async () => {
      const response = await request(app)
        .post('/api/roles/find')
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
          mockRole1,
          mockRole2
        ]
      });
    });

    it('should return empty users', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve([{
        metadata: [{
          total: 0
        }],
        data: []
      }]));

      const response = await request(app)
        .post('/api/roles/find')
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
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error('error'));

      await request(app)
        .post('/api/roles/find')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockFindUsersPayload)
        .expect(HttpCodes.Internal);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create a role', async () => {
      const response = await request(app)
        .post('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateRolePayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectRole(body.data, mockRole1);
    });

    it('should fail create role when role id is not valid', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new Error('error'));

      const response = await request(app)
        .post('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateRolePayload)
        .expect(HttpCodes.Internal);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully update a role', async () => {
      const response = await request(app)
        .put('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({
          _id: mockRole1._id,
          name: 'new-name',
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
          desc: 'new-dateOfBirth'
        })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectRole(body.data, mockRole1);
    });

    it('should fail update a role when only name is provided', async () => {
      const response = await request(app)
        .put('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({
          _id: mockRole1._id,
          fullname: 'new-fullname'
        })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });

    it('should fail update role when role not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));

      const response = await request(app)
        .put('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateRolePayload)
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });

    it('should fail update role when only id is provided', async () => {
      const response = await request(app)
        .put('/api/roles')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: mockRole1._id })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOneAndUpdate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockRole1));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully delete a role', async () => {
      const response = await request(app)
        .delete('/api/roles/' + mockRole1._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockRole1);
    });

    it('should fail delete role when role is not valid', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(null));

      const response = await request(app)
        .delete('/api/roles/' + mockRole1._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });
});
