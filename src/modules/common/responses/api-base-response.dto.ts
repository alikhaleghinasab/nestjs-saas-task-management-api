import { ApiProperty } from '@nestjs/swagger';

export abstract class ApiBaseResponse {
  @ApiProperty()
  readonly success: boolean;

  protected constructor(success: boolean) {
    this.success = success;
  }
}
