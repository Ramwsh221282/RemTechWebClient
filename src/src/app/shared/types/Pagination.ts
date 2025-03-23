import { HttpParams } from '@angular/common/http';

export type Pagination = {
  page: number;
  pageSize: number;
};

export const mapToHttpParameters = (pagination: Pagination): HttpParams => {
  return new HttpParams()
    .append('page', String(pagination.page))
    .append('pageSize', String(pagination.pageSize));
};
