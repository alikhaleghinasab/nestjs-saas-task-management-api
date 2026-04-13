import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;
}
