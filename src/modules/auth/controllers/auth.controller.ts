import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { SetRefreshTokenCookieInterceptor } from '@auth/interceptors/refresh-token.interceptor';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from '@auth/dto/login.dto';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';

@Controller('auth')
@UseInterceptors(ApiSuccessResponseInterceptor)
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
  ): Promise<Omit<TokensOutputDto, 'refreshToken'>> {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(200)
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @ApiOperation({ summary: 'Login using credentials' })
  @ApiSuccessResponseDocs(
    TokensOutputDto,
    'Access token returned, refresh token set in httpOnly cookie.',
    200,
  )
  async login(
    @Body() dto: LoginDto,
  ): Promise<Omit<TokensOutputDto, 'refreshToken'>> {
    return this.authService.login(dto);
  }
}
