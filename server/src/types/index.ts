import { LogLevel } from '../common';

export interface Response<T> {
  data: T,
  error: string | object | [] | null | undefined;
}

export enum SortOrder {
  ASC = -1,
  DESC = 1
}

export interface PaginationSort {
  by: string;
  order: SortOrder;
}

export interface Pagination {
  page: number;
  limit: number;
  sort: PaginationSort;
}

export interface FindPayload {
  query?: string;
  pagination: Pagination;
}

export interface IException {
  code: string;
  name: string;
  level: LogLevel;
}
