import { CreateStudentPayload, FindStudentsPayload, Student } from './students.types';
import { StudentsDao } from './students.dao';
import { RestApiException } from '../../exceptions';
import { StudentsService } from './students.service';

const mockStudentsDaoGet = jest.fn();
const mockStudentsDaoFind = jest.fn();
const mockStudentsDaoCreate = jest.fn();
const mockStudentsDaoUpdate = jest.fn();
const mockStudentsDaoGetDefault = jest.fn();
const mockStudentsDaoSetDefault = jest.fn();
const mockStudentsDaoDelete = jest.fn();

jest.mock('./students.dao', () => ({
  StudentsDao: jest.fn().mockImplementation(() => ({
    get: (payload: any): void => mockStudentsDaoGet(payload),
    find: (payload: any): void => mockStudentsDaoFind(payload),
    create: (payload: any): void => mockStudentsDaoCreate(payload),
    update: (payload: any): void => mockStudentsDaoUpdate(payload),
    getDefault: (payload: any): void => mockStudentsDaoGetDefault(payload),
    setDefault: (payload: any): void => mockStudentsDaoSetDefault(payload),
    delete: (payload: any): void => mockStudentsDaoDelete(payload)
  }))
}));

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => ({}))
}));

describe('students-service', () => {
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
  const mockFindStudentsPayload: FindStudentsPayload = {
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
  const mockCreateStudentPayload: CreateStudentPayload = {
    fullname: 'fullname',
    nim: 'nim',
    dateOfBirth: '1-1-1900'
  };

  mockStudentsDaoGet.mockReturnValue(Promise.resolve(mockStudent1));
  mockStudentsDaoFind.mockReturnValue(Promise.resolve({
    ...mockFindStudentsPayload,
    pagination: {
      ...mockFindStudentsPayload.pagination,
      pageCount: 1
    },
    data: [mockStudent1, mockStudent2]
  }));
  mockStudentsDaoCreate.mockReturnValue(Promise.resolve(mockStudent1));
  mockStudentsDaoUpdate.mockReturnValue(Promise.resolve(mockStudent1));
  mockStudentsDaoGetDefault.mockReturnValue(Promise.resolve(mockStudent1));
  mockStudentsDaoSetDefault.mockReturnValue(Promise.resolve(mockStudent1));
  mockStudentsDaoDelete.mockReturnValue(Promise.resolve(mockStudent1._id));

  const studentsService = new StudentsService({ studentsDao: new StudentsDao() });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should successfully return student', async () => {
      const student = await studentsService.get(mockStudent1._id);
      expect(mockStudentsDaoGet).toHaveBeenCalled();
      expect(student).toEqual(mockStudent1);
    });

    it('should throw an error when student not found', async () => {
      mockStudentsDaoGet.mockReturnValueOnce(Promise.resolve(null));
      const student = await studentsService.get(mockStudent1._id);
      expect(mockStudentsDaoGet).toHaveBeenCalled();
      expect(student).toEqual(null);
    });

    it('should throw an error when get student throw an error', async () => {
      mockStudentsDaoGet.mockRejectedValueOnce(new Error('error'));
      await expect(studentsService.get(mockStudent1._id)).rejects.toThrowError();
    });
  });

  describe('find', () => {
    it('should successfully find students', async () => {
      const response = await studentsService.find(mockFindStudentsPayload);
      expect(mockStudentsDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([mockStudent1, mockStudent2]);
    });

    it('should return empty students', async () => {
      mockStudentsDaoFind.mockReturnValue(Promise.resolve({
        ...mockFindStudentsPayload,
        pagination: {
          ...mockFindStudentsPayload.pagination,
          pageCount: 1
        },
        data: []
      }));

      const response = await studentsService.find(mockFindStudentsPayload);
      expect(mockStudentsDaoFind).toHaveBeenCalled();
      expect(response).toHaveProperty('data');
      expect(response.data).toEqual([]);
    });

    it('should throw an error when data access object throw an error', async () => {
      mockStudentsDaoFind.mockRejectedValueOnce(new RestApiException('internal server error', 500));

      await expect(studentsService.find(mockFindStudentsPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('create', () => {
    it('should successfully create a student with email', async () => {
      const response = await studentsService.create(mockCreateStudentPayload);
      expect(mockStudentsDaoCreate).toHaveBeenCalled();
      expect(response).toEqual(mockStudent1);
    });

    it('should throw api exception when studentsDao.create throw api exception', async () => {
      mockStudentsDaoCreate.mockRejectedValueOnce(new RestApiException('internal'));

      await expect(studentsService.create(mockCreateStudentPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('update', () => {
    it('should successfully update a student', async () => {
      mockStudentsDaoUpdate.mockReturnValueOnce(Promise.resolve(mockStudent1));
      const response = await studentsService.update(mockStudent1);
      expect(mockStudentsDaoUpdate).toHaveBeenCalled();
      expect(response).toEqual(mockStudent1);
    });

    it('should throw an error when studentsDao throw an error', async () => {
      mockStudentsDaoUpdate.mockRejectedValueOnce(new RestApiException('internal'));
      await expect(studentsService.update(mockStudent1)).rejects.toThrow(RestApiException);
    });
  });

  describe('delete', () => {
    it('should successfully delete a student', async () => {
      mockStudentsDaoDelete.mockReturnValueOnce(Promise.resolve('studentId'));
      const response = await studentsService.delete('studentId');
      expect(mockStudentsDaoDelete).toHaveBeenCalled();
      expect(response).toEqual('studentId');
    });

    it('should throw an error when data access object throw an error', async () => {
      mockStudentsDaoDelete.mockRejectedValueOnce(new RestApiException('internal server error', 500));
      await expect(studentsService.delete('studentId')).rejects.toThrow(RestApiException);
    });
  });
});
