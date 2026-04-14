import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { AuthPayload } from '@auth/interfaces/auth-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '@auth/configs/auth.config';

@Injectable()
export class TokenFactory {
  private readonly authConfig: AuthConfigType;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = this.configService.get<AuthConfigType>('auth');
  }

  newJti(): string {
    return uuidv4();
  }

  generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }

  async generateAccessToken(userId: string, jti: string): Promise<string> {
    const payload: AuthPayload = { sub: userId, jti };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.authConfig.accessTokenExpiresIn,
    });
  }

  refreshTokenExpiresAt(): Date {
    return new Date(Date.now() + this.authConfig.refreshTokenExpiresIn * 1000);
  }
}
