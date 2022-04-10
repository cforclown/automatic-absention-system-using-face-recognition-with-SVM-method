import { FindPayload, Pagination, PaginationSort } from '../../types';

export interface Student {
  _id: string;
  fullname: string;
  nim: string;
  dateOfBirth: string;
  archived?: boolean;
}

export type FindStudentsSortBy = 'fullname';
export type FindStudentsPayload = FindPayload & {
  pagination: {
    sort: PaginationSort & {
      by: FindStudentsSortBy;
    };
  };
};
export type FindStudentsResult = FindStudentsPayload & {
  data: Student[];
  pagination: Pagination & {
    pageCount: number;
  };
};

export type CreateStudentPayload = Omit<Student, '_id'>;

export interface UpdateStudentPayload {
  _id: string;
  fullname?: string;
  nim?: string;
  dateOfBirth?: string;
}
