import { ApiProperty } from '@nestjs/swagger';

export class TokensOutputDto {
  @ApiProperty()
  accessToken: string;
  refreshToken: string;
}
