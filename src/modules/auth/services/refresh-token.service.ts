import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ArgonHasher } from '@common/security/argon-hasher.service';
import { RefreshTokenRepository } from '@auth/repositories/refresh-token.repository';
import { TokensOutput } from '@auth/interfaces/tokens-output.interface';
import { TokenFactory } from './token.factory';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly tokenFactory: TokenFactory,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly argonHasher: ArgonHasher,
  ) {}

  async generateTokens(userId: string): Promise<TokensOutput> {
    const jti = this.tokenFactory.newJti();

    try {
      const accessToken = await this.tokenFactory.generateAccessToken(
        userId,
        jti,
      );
      const refreshToken = this.tokenFactory.generateRefreshToken();

      await this.storeRefreshToken(userId, refreshToken, jti);

      return { accessToken, refreshToken };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    jti: string,
  ) {
    const tokenHash = await this.argonHasher.hash(refreshToken, {
      timeCost: 1,
      memoryCost: 2 ** 15,
    });
    const expiresAt = this.tokenFactory.refreshTokenExpiresAt();

    await this.refreshTokenRepository.upsertRefreshTokenByUser({
      userId,
      tokenHash,
      jti,
      expiresAt,
    });
  }
}
