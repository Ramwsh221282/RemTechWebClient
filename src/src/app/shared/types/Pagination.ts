import { HttpParams } from '@angular/common/http';

export type Pagination = {
  page: number;
  pageSize: number;
};

export class PaginationService {
  public static updatePage(original: Pagination, page: number): Pagination {
    return { ...original, page: page };
  }
}

export const mapToHttpParameters = (pagination: Pagination): HttpParams => {
  return new HttpParams()
    .append('page', String(pagination.page))
    .append('pageSize', String(pagination.pageSize));
};
