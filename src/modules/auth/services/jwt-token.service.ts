import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '@auth/configs/auth.config';
import { AuthPayload } from '@auth/interfaces/auth-payload.interface';

@Injectable()
export class JwtTokenService {
  private readonly authConfig: AuthConfigType;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.authConfig = this.configService.getOrThrow<AuthConfigType>('auth');
  }

  async generateAccessToken(payload: AuthPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.authConfig.accessTokenExpiresIn,
    });
  }

  verifyAccessToken(token: string): AuthPayload {
    try {
      return this.jwtService.verify<AuthPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
