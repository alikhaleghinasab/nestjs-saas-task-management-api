import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { ApiSuccessResponse } from '@common/responses/api-success-response.dto';
import { SetRefreshTokenCookieInterceptor } from '@auth/interceptors/refresh-token.interceptor';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @ApiOperation({ summary: 'Register new user account' })
  @ApiSuccessResponseDocs(
    TokensOutputDto,
    'User created. Access token returned, refresh token set in httpOnly cookie.',
  )
  async register(
    @Body() dto: RegisterDto,
  ): Promise<ApiSuccessResponse<Omit<TokensOutputDto, 'refreshToken'>>> {
    return new ApiSuccessResponse(await this.authService.register(dto));
  }
}
