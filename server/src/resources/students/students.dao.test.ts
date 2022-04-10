import { RestApiException } from '../../exceptions';
import { StudentsDao } from './students.dao';
import { CreateStudentPayload, FindStudentsPayload, Student } from './students.types';
import { MockMongooseModel } from '../../../__mock__';

jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  model: jest.fn().mockImplementation(() => (MockMongooseModel))
}));

function expectCorrectStudent (value: Record<string, any>, source: Student): void {
  expect(value).toHaveProperty('_id');
  expect(value._id).toEqual(source._id);
  expect(value).toHaveProperty('fullname');
  expect(value.fullname).toEqual(source.fullname);
  expect(value).toHaveProperty('nim');
  expect(value.nim).toEqual(source.nim);
  expect(value).toHaveProperty('dateOfBirth');
  expect(value.dateOfBirth).toEqual(source.dateOfBirth);
}

describe('students-dao', () => {
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

  const studentsDao = new StudentsDao();

  MockMongooseModel.mockSelect.mockImplementation(() => ({
    exec: (payload: any): void => MockMongooseModel.mockExec(payload)
  }));
  MockMongooseModel.mockCreate.mockReturnValue(Promise.resolve(mockStudent1));
  MockMongooseModel.mockPopulate.mockReturnValue(Promise.resolve());

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    beforeEach(() => {
      MockMongooseModel.mockFindOne.mockImplementation(() => ({
        exec: (payload: any): void => MockMongooseModel.mockExec(payload)
      }));
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve(mockStudent1));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully get student', async () => {
      const student = await studentsDao.get(mockStudent1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(student).toEqual(mockStudent1);
    });

    it('should throw an error when student not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      const student = await studentsDao.get(mockStudent1._id);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expect(student).toEqual(null);
    });

    it('should throw an error when model.findById throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(studentsDao.get(mockStudent1._id)).rejects.toThrow(RestApiException);
    });
  });

  describe('find', () => {
    const expectedStudents = {
      ...mockFindStudentsPayload,
      pagination: {
        ...mockFindStudentsPayload.pagination,
        pageCount: 1
      },
      data: [mockStudent1, mockStudent2]
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

    it('should successfully find students', async () => {
      const students = await studentsDao.find(mockFindStudentsPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(students).toEqual(expectedStudents);
    });

    it('should successfully find students (0)', async () => {
      MockMongooseModel.mockExec.mockReturnValue(Promise.resolve([{
        metadata: [],
        data: []
      }]));
      const students = await studentsDao.find(mockFindStudentsPayload);
      expect(MockMongooseModel.mockAggregate).toHaveBeenCalled();
      expect(students).toEqual({
        ...mockFindStudentsPayload,
        pagination: {
          ...mockFindStudentsPayload.pagination,
          pageCount: 0
        },
        data: []
      });
    });

    it('should throw an error when model.aggregate throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new RestApiException('not found'));
      await expect(studentsDao.find(mockFindStudentsPayload)).rejects.toThrow(RestApiException);
    });
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully create an student', async () => {
      const student = await studentsDao.create(mockCreateStudentPayload);
      expect(MockMongooseModel.mockCreate).toHaveBeenCalled();
      expect(student).toEqual(mockStudent1);
    });

    it('should throw an error when document.save throw an error', async () => {
      MockMongooseModel.mockCreate.mockRejectedValueOnce(new Error());
      await expect(studentsDao.create(mockCreateStudentPayload)).rejects.toThrowError();
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

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should successfully update student', async () => {
      const student = await studentsDao.update(mockStudent1);
      expect(MockMongooseModel.mockFindOne).toHaveBeenCalled();
      expectCorrectStudent(student, mockStudent1);
    });

    it('should throw an error when student not found', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(studentsDao.update(mockStudent1)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when document.updateOne() throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(studentsDao.update(mockStudent1)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    const expectedResult = {
      ...mockStudent1,
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

    it('should successfully delete student', async () => {
      const deletedStudentId = await studentsDao.delete(mockStudent1._id);
      expect(MockMongooseModel.mockFindOneAndUpdate).toHaveBeenCalled();
      expect(deletedStudentId).toEqual(expectedResult);
    });

    it('should throw api error when deletedCount is 0', async () => {
      MockMongooseModel.mockExec.mockReturnValueOnce(Promise.resolve(null));
      await expect(studentsDao.delete(mockStudent1._id)).rejects.toThrow(RestApiException);
    });

    it('should throw an error when model.deleteOne throw an error', async () => {
      MockMongooseModel.mockExec.mockRejectedValueOnce(new Error());
      await expect(studentsDao.delete(mockStudent1._id)).rejects.toThrowError();
    });
  });
});
