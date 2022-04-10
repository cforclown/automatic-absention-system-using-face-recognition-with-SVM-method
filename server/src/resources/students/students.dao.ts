import { model, Model } from 'mongoose';
import { CreateStudentPayload, FindStudentsPayload, FindStudentsResult, Student, UpdateStudentPayload } from './students.types';
import { RestApiException } from '../../exceptions';

export class StudentsDao {
  studentsModel: Model<Student>;

  constructor () {
    this.studentsModel = model<Student>('students');
  }

  async get (studentId: string): Promise<Student | null> {
    return this.studentsModel.findOne({ _id: studentId, archived: false }).exec(); ;
  }

  async find ({ query, pagination }: FindStudentsPayload): Promise<FindStudentsResult> {
    const result = await this.studentsModel
      .aggregate([
        {
          $match: {
            name: {
              $regex: query ?? '',
              $options: 'i'
            },
            archived: false
          }
        },
        {
          $sort: {
            [pagination.sort.by]: pagination.sort.order
          }
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }, { $addFields: { page: pagination.page } }],
            data: [
              { $skip: (pagination.page - 1) * pagination.limit },
              { $limit: pagination.limit }
            ]
          }
        }
      ])
      .exec();

    const data = {
      data: [],
      query,
      pagination: {
        ...pagination,
        pageCount: 0
      }
    };

    if (result[0].metadata.length && result[0].data.length) {
      data.data = result[0].data;
      data.pagination.pageCount = Math.ceil(result[0].metadata[0].total / pagination.limit);
    }

    return data;
  }

  async create (payload: CreateStudentPayload): Promise<Student> {
    return this.studentsModel.create(payload);
  }

  async update (payload: UpdateStudentPayload): Promise<Student> {
    const student = await this.studentsModel.findOne({ _id: payload._id, archived: false }).exec();
    if (!student) {
      throw new RestApiException('Student not found');
    }
    student.fullname = payload.fullname ?? student.fullname;
    student.nim = payload.nim ?? student.nim;
    student.dateOfBirth = payload.dateOfBirth ?? student.dateOfBirth;
    await student.save();

    return student;
  }

  async delete (studentId: string): Promise<Student> {
    const student = await this.studentsModel.findOneAndUpdate({ _id: studentId }, { archived: true }, { new: true }).exec();
    if (!student) {
      throw new RestApiException('Student not found');
    }
    return student;
  }
}
