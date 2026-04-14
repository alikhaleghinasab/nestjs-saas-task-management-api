import { ApiProperty } from '@nestjs/swagger';

export type TokensOutputForApi = Omit<TokensOutputDto, 'refreshToken'>;
export class TokensOutputDto {
  @ApiProperty()
  accessToken: string;
  refreshToken: string;
}
