import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
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
import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { UniqueConstraintException } from '@common/exceptions/unique-constraint.exception';
import {
  InvalidCredentialsException,
  InvalidRefreshTokenException,
} from '@auth/exceptions/auth.exception';
import { USER_ERRORS } from '@users/constants/errors.constant';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';

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
  @ApiSuccessResponseDocs({
    status: 201,
    model: TokensOutputDto,
    description:
      'User created. Access token returned, refresh token set in httpOnly cookie.',
  })
  @ApiErrorResponsesDocs(
    {
      exception: UniqueConstraintException,
      message: USER_ERRORS.EMAIL_EXISTS,
    },
    {
      exception: ForbiddenException,
      message: ORGANIZATION_ERRORS.INVITATION_MISMATCH,
    },
    {
      exception: BadRequestException,
      message: ORGANIZATION_ERRORS.INVITATION_NOT_VALID,
    },
  )
  async register(@Body() dto: RegisterDto): Promise<TokensOutputForApi> {
    return this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(200)
  @UseInterceptors(SetRefreshTokenCookieInterceptor)
  @ApiOperation({ summary: 'Login using credentials' })
  @ApiSuccessResponseDocs({
    model: TokensOutputDto,
    description: 'Access token returned, refresh token set in httpOnly cookie.',
  })
  @ApiErrorResponsesDocs(
    { exception: ForbiddenException, message: USER_ERRORS.USER_BANNED },
    InvalidCredentialsException,
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
  @ApiSuccessResponseDocs({
    model: TokensOutputDto,
    description: 'Tokens refreshed successfully',
  })
  @ApiErrorResponsesDocs(InvalidRefreshTokenException)
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
  @ApiSuccessResponseDocs({
    model: User,
    description: 'User profile returned successfully',
  })
  async me(@CurrentUser() user: User) {
    return user;
  }
}
