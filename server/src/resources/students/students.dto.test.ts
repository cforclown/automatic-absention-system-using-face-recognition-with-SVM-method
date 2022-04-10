import { validateSchema } from '../../utils/validate-schema';
import { ValidationException } from '../../exceptions/validation-exception';
import { CreateStudentPayloadSchema, FindStudentsSchema, StudentSchema } from './students.dto';
import { CreateStudentPayload, FindStudentsPayload, Student } from './students.types';

describe('students-data-transfer-object', () => {
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
  const mockStudent: Student = {
    _id: 'id-1',
    fullname: 'fullname-1',
    nim: 'nim-1',
    dateOfBirth: '1-1-1900'
  };

  describe('FindStudentsSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema({ schema: FindStudentsSchema, payload: mockFindStudentsPayload });
      expect(result).toEqual(mockFindStudentsPayload);
    });

    it('should throw validation exception when page not provided', () => {
      expect(() => validateSchema({
        schema: FindStudentsSchema,
        payload: {
          query: '',
          pagination: {
            limit: 10,
            sort: {
              by: 'fullname',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when limit not provided', () => {
      expect(() => validateSchema({
        schema: FindStudentsSchema,
        payload: {
          query: '',
          pagination: {
            page: 1,
            sort: {
              by: 'fullname',
              order: 1
            }
          }
        }
      })).toThrow(ValidationException);
    });
  });

  describe('CreateStudentPayloadSchema', () => {
    it('should return validated values when payload is valid', () => {
      const result = validateSchema({ schema: CreateStudentPayloadSchema, payload: mockCreateStudentPayload });
      expect(result).toEqual(mockCreateStudentPayload);
    });

    it('should throw validation exception when fullname not provided', () => {
      expect(() => validateSchema({
        schema: CreateStudentPayloadSchema,
        payload: {
          ...mockCreateStudentPayload,
          fullname: undefined
        }
      })).toThrow(ValidationException);
    });
  });

  describe('StudentSchema', () => {
    it('should return value when schema is valid', () => {
      const result = validateSchema<CreateStudentPayload>({
        schema: StudentSchema,
        payload: mockStudent
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw validation exception when fullname not provided', () => {
      expect(() => validateSchema({
        schema: CreateStudentPayloadSchema,
        payload: {
          ...mockStudent,
          fullname: undefined
        }
      })).toThrow(ValidationException);
    });

    it('should throw validation exception when fullname not provided', () => {
      expect(() => validateSchema({
        schema: CreateStudentPayloadSchema,
        payload: {
          ...mockStudent,
          fullname: undefined
        }
      })).toThrow(ValidationException);
    });
  });
});
