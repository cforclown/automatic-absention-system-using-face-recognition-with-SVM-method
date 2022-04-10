import { Request } from 'express';
import { FindStudentsResult, Student } from './students.types';
import { StudentsService } from './students.service';
import { HttpCodes, RestApiException } from '../../exceptions';

export class StudentsController {
  private readonly studentsService: StudentsService;

  constructor ({ studentsService }: { studentsService: StudentsService; }) {
    this.studentsService = studentsService;

    this.get = this.get.bind(this);
    this.find = this.find.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async find ({ body }: Request): Promise<FindStudentsResult> {
    return this.studentsService.find(body);
  }

  async get ({ params }: Request): Promise<Student> {
    const student = await this.studentsService.get(params.studentId);
    if (!student) {
      throw new RestApiException('Student not found', HttpCodes.NotFound);
    }
    return student;
  }

  async create ({ body }: Request): Promise<Student> {
    return this.studentsService.create(body);
  }

  async update ({ body }: Request): Promise<Student> {
    return this.studentsService.update(body);
  }

  async delete ({ params }: Request): Promise<Student> {
    return this.studentsService.delete(params.studentId);
  }
}
