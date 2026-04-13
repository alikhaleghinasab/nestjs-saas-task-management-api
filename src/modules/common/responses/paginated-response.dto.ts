import { ApiProperty } from '@nestjs/swagger';
import { ApiSuccessResponse } from './api-success-response.dto';
import { PaginationMeta } from './pagination-meta.dto';

export class PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  @ApiProperty({ type: PaginationMeta })
  readonly meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    super(data);
    this.meta = meta;
  }
}
