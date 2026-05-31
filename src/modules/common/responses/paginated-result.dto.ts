import { PaginationMeta } from './pagination-meta.dto';

export class PaginatedResult<T> {
  constructor(
    public readonly data: T[],
    public readonly meta: PaginationMeta,
  ) {}
}
