import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { ApiSuccessResponse } from '@common/responses/api-success-response.dto';
import { SetRefreshTokenCookieInterceptor } from '@auth/interceptors/refresh-token.interceptor';
import { TokensOutput } from '@auth/interfaces/tokens-output.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiSuccessResponse<Omit<TokensOutput, 'refreshToken'>>> {
    return new ApiSuccessResponse(await this.authService.register(dto));
  }
}
