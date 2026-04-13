import { ApiProperty } from '@nestjs/swagger';
import { ApiBaseResponse } from './api-base-response.dto';

export class ApiErrorResponse extends ApiBaseResponse {
  @ApiProperty()
  readonly errorCode: string;

  @ApiProperty()
  readonly message: string | string[];

  constructor(errorCode: string, message: string | string[]) {
    super(false);
    this.errorCode = errorCode;
    this.message = message;
  }
}
