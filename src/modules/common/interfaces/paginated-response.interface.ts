import { PaginationMeta } from '@common/responses/pagination-meta.dto';

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;
}
