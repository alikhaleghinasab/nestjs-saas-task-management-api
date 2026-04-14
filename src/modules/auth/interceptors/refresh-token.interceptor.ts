import { AuthConfigType } from '@auth/configs/auth.config';
import { REFRESH_TOKEN_HEADER } from '@auth/constants/auth.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SetRefreshTokenCookieInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If no refresh token exists, do nothing
        const refreshToken = data?.refreshToken;
        if (!refreshToken) return data;

        const { refreshTokenExpiresIn }: AuthConfigType =
          this.configService.get('auth');

        const isProd = this.configService.get('NODE_ENV') === 'production';

        const cookieOptions = {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
          maxAge: refreshTokenExpiresIn,
          path: '/api/auth/refresh',
        };

        res.setCookie(REFRESH_TOKEN_HEADER, refreshToken, cookieOptions);

        const { refreshToken: _, ...dataWithoutToken } = data;
        return dataWithoutToken;
      }),
    );
  }
}
