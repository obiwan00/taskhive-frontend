export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PagedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

