import { when } from 'jest-when';
import request from 'supertest';
import { setup } from '../../di-config';
import App from '../../app';
import { MockMongooseModel } from '../../../__mock__';
import { CreateStudentPayload, FindStudentsPayload, Student } from './students.types';
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

export function expectCorrectStudent (value: Record<string, any>, source: Student): void {
  expect(value).toHaveProperty('_id');
  expect(value._id).toEqual(source._id);
  expect(value).toHaveProperty('fullname');
  expect(value.fullname).toEqual(source.fullname);
  expect(value).toHaveProperty('nim');
  expect(value.nim).toEqual(source.nim);
  expect(value).toHaveProperty('dateOfBirth');
  expect(value.dateOfBirth).toEqual(source.dateOfBirth);
}

describe('students-router', () => {
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
  const mockStudent1: Student = {
    _id: 'id-1',
    fullname: 'fullname-1',
    nim: 'nim-1',
    dateOfBirth: '1-1-1900'
  };
  const mockStudent2: Student = {
    _id: 'id-2',
    fullname: 'fullname-2',
    nim: 'nim-2',
    dateOfBirth: '1-1-1900'
  };
  const mockCreateStudentPayload: CreateStudentPayload = {
    fullname: 'fullname',
    nim: 'nim',
    dateOfBirth: '1-1-1900'
  };

  when(mockModel).calledWith('students').mockReturnValue(MockMongooseModel);
  MockMongooseModel.mockFindOne.mockImplementation(() => ({
    exec: (payload: any): void => MockMongooseModel.mockExec(payload)
  }));
  MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockStudent1));
  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockStudent1));

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

    it('should successfully return student', async () => {
      const response = await request(app)
        .get(`/api/students/${mockStudent1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectStudent(body.data, mockStudent1);
    });

    it('should return 404 when student not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await request(app)
        .get(`/api/students/${mockStudent1._id}`)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.NotFound);
    });
  });

  describe('find', () => {
    const mockFindUsersPayload: FindStudentsPayload = {
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
      MockMongooseModel.mockAggregate.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [{
          total: 2
        }],
        data: [mockStudent1, mockStudent2]
      }]));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully find users', async () => {
      const response = await request(app)
        .post('/api/students/find')
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
          mockStudent1,
          mockStudent2
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
        .post('/api/students/find')
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
        .post('/api/students/find')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockFindUsersPayload)
        .expect(HttpCodes.Internal);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create a student', async () => {
      const response = await request(app)
        .post('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateStudentPayload)
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectStudent(body.data, mockStudent1);
    });

    it('should fail create student when student id is not valid', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new Error('error'));

      const response = await request(app)
        .post('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateStudentPayload)
        .expect(HttpCodes.Internal);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve({
        ...mockStudent1,
        save: async () => Promise.resolve()
      }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully update a student', async () => {
      const response = await request(app)
        .put('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({
          _id: mockStudent1._id,
          fullname: 'new-fullname',
          nim: 'new-nim',
          dateOfBirth: 'new-dateOfBirth'
        })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectStudent(body.data, {
        _id: mockStudent1._id,
        fullname: 'new-fullname',
        nim: 'new-nim',
        dateOfBirth: 'new-dateOfBirth'
      });
    });

    it('should successfully update a student when only fullname provided', async () => {
      const response = await request(app)
        .put('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({
          _id: mockStudent1._id,
          fullname: 'new-fullname'
        })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expectCorrectStudent(body.data, {
        ...mockStudent1,
        fullname: 'new-fullname'
      });
    });

    it('should fail update student when student id is not valid', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(null));

      const response = await request(app)
        .put('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send(mockCreateStudentPayload)
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });

    it('should fail update student when only id is provided', async () => {
      const response = await request(app)
        .put('/api/students')
        .set({ Authorization: 'Bearer fake-access-token' })
        .send({ _id: mockStudent1._id })
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
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockStudent1));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully delete a student', async () => {
      const response = await request(app)
        .delete('/api/students/' + mockStudent1._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.Ok);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(mockStudent1);
    });

    it('should fail delete student when role is not valid', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(null));

      const response = await request(app)
        .delete('/api/students/' + mockStudent1._id)
        .set({ Authorization: 'Bearer fake-access-token' })
        .expect(HttpCodes.BadRequest);
      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toEqual(null);
    });
  });
});
