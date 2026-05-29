import { AuthConfigType } from '@auth/configs/auth.config';
import { REFRESH_TOKEN_HEADER } from '@auth/constants/auth.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

type WithRefreshToken<T> = T & { refreshToken?: string };

@Injectable()
export class SetRefreshTokenCookieInterceptor<
  T extends object,
> implements NestInterceptor<WithRefreshToken<T>, T> {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<WithRefreshToken<T>>,
  ): Observable<T> {
    const http = context.switchToHttp();
    const res = http.getResponse();

    return next.handle().pipe(
      map((data: WithRefreshToken<T>) => {
        const refreshToken = data?.refreshToken;

        if (!refreshToken) {
          return data as T;
        }

        const { refreshTokenExpiresIn } =
          this.configService.get<AuthConfigType>('auth');

        const isProd =
          this.configService.get<string>('NODE_ENV') === 'production';

        const cookieOptions = {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          maxAge: refreshTokenExpiresIn,
          path: '/api/auth/refresh',
        };

        res.setCookie(REFRESH_TOKEN_HEADER, refreshToken, cookieOptions);

        const { refreshToken: _, ...dataWithoutToken } = data;
        return dataWithoutToken as T;
      }),
    );
  }
}
