export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: Array<T>;
  pagination: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

