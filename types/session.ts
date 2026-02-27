export interface Session {
  id: string;
  date: string;
  period: string;
  category: string;
  completedCycles: number;
  targetCycles: number;
  success: boolean;
  totalFocusMinutes: number;
}

export interface SessionDetail extends Session {
  dayOfWeek: string;
  startTime: string;
  totalBreakMinutes: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface SessionFilters {
  category?: string;
  success?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDir?: string;
}
