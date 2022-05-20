export interface RestPage<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  number: number;
  size: number;
  empty: boolean;
}

export interface RestPageQuery {
  page: number | null;
  size: number | null;
  sort: string | null;
}

export const EMPTY_PAGE_QUERY: RestPageQuery = {page: null, size: null, sort: null};
