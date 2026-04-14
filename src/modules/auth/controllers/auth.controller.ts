import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
import { SetRefreshTokenCookieInterceptor } from '@auth/interceptors/refresh-token.interceptor';
import {
  TokensOutputDto,
  TokensOutputForApi,
} from '@auth/dto/tokens-output.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiSuccessResponseDocs } from '@common/decorators/api-success-response-docs.decorator';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@auth/dto/login.dto';
import { ApiSuccessResponseInterceptor } from '@common/interceptors/api-success-response.interceptor';
import { RefreshTokenService } from '@auth/services/refresh-token.service';
import { REFRESH_TOKEN_HEADER } from '@auth/constants/auth.constant';
import { Cookies } from '@common/decorators/cookie.decorator';
import { JwtAuth } from '@auth/decorators/auth.decorator';
import { User } from '@users/entities/user.entity';
import { CurrentUser } from '@users/decorators/user.decorator';

@Controller('auth')
@ApiTags('Auth')
@Throttle({
  default: {
    limit: 5,
    ttl: 60000,
  },
})
@UseInterceptors(ApiSuccessResponseInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}
  @Post('register')
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @ApiOperation({ summary: 'Register new user account' })
  @ApiSuccessResponseDocs(
    TokensOutputDto,
    'User created. Access token returned, refresh token set in httpOnly cookie.',
  )
  async register(@Body() dto: RegisterDto): Promise<TokensOutputForApi> {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(200)
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @ApiOperation({ summary: 'Login using credentials' })
  @ApiSuccessResponseDocs(
    TokensOutputDto,
    'Access token returned, refresh token set in httpOnly cookie.',
    200,
  )
  async login(@Body() dto: LoginDto): Promise<TokensOutputForApi> {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  @HttpCode(200)
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @ApiOperation({
    summary: `Refresh access and refresh tokens with ${REFRESH_TOKEN_HEADER} header`,
  })
  @ApiSuccessResponseDocs(TokensOutputDto, 'Tokens refreshed successfully', 200)
  @ApiCookieAuth(REFRESH_TOKEN_HEADER)
  async refresh(
    @Cookies(REFRESH_TOKEN_HEADER) refreshToken: string,
  ): Promise<TokensOutputForApi> {
    return await this.refreshTokenService.refresh(refreshToken);
  }

  @Get('/me')
  @HttpCode(200)
  @Throttle({
    default: {
      limit: 10,
      ttl: 60000,
    },
  })
  @JwtAuth()
  @ApiOperation({ summary: 'Get current logged in user profile' })
  @ApiSuccessResponseDocs(User, 'User profile returned successfully', 200)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
