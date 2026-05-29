import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { uuidv7 } from 'uuidv7';
import { REFRESH_TOKEN_REGEX } from '@auth/constants/auth.constant';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '@auth/configs/auth.config';

@Injectable()
export class RefreshTokenFactory {
  private readonly authConfig: AuthConfigType;

  constructor(private readonly configService: ConfigService) {
    this.authConfig = this.configService.getOrThrow<AuthConfigType>('auth');
  }

  generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  generateJti(): string {
    return uuidv7();
  }

  isValidFormat(refreshToken: string): boolean {
    return !!refreshToken && REFRESH_TOKEN_REGEX.test(refreshToken);
  }

  calculateExpiresAt(): Date {
    return new Date(Date.now() + this.authConfig.refreshTokenExpiresIn * 1000);
  }
}
