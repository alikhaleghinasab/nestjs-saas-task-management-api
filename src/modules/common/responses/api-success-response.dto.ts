import { ApiProperty } from '@nestjs/swagger';
import { ApiBaseResponse } from './api-base-response.dto';

export class ApiSuccessResponse<T> extends ApiBaseResponse {
  @ApiProperty()
  readonly data: T;

  @ApiProperty({ required: false })
  readonly message?: string;

  constructor(data: T, message?: string) {
    super(true);
    this.data = data;
    this.message = message;
  }
}
