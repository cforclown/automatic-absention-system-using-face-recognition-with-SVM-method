import { FindStudentsPayload, FindStudentsResult } from '.';
import { Student, UpdateStudentPayload } from './students.types';
import { StudentsDao } from './students.dao';
import { RestApiException } from '../../exceptions';

export class StudentsService {
  studentsDao: StudentsDao;

  constructor ({ studentsDao }: { studentsDao: StudentsDao; }) {
    this.studentsDao = studentsDao;
  }

  get (studentId: string): Promise<Student | null> {
    return this.studentsDao.get(studentId);
  }

  find (payload: FindStudentsPayload): Promise<FindStudentsResult> {
    return this.studentsDao.find(payload);
  }

  create (payload: Omit<Student, '_id'>): Promise<Student> {
    return this.studentsDao.create(payload);
  }

  update (payload: UpdateStudentPayload): Promise<Student> {
    if (!payload.fullname && !payload.nim && !payload.dateOfBirth) {
      throw new RestApiException('Payload should contain property to update');
    }
    return this.studentsDao.update(payload);
  }

  delete (studentId: string): Promise<Student> {
    return this.studentsDao.delete(studentId);
  }
}
