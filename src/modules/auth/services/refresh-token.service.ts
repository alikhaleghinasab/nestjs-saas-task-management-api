import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ArgonHasher } from '@common/security/argon-hasher.service';
import { RefreshTokenRepository } from '@auth/repositories/refresh-token.repository';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { TokenFactory } from './token.factory';
import { InvalidRefreshTokenException } from '@auth/exceptions/auth.exception';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly tokenFactory: TokenFactory,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly argonHasher: ArgonHasher,
  ) {}

  async generateTokens(userId: string): Promise<TokensOutputDto> {
    const jti = this.tokenFactory.newJti();

    try {
      const accessToken = await this.tokenFactory.generateAccessToken(
        userId,
        jti,
      );
      const refreshToken = this.tokenFactory.generateRefreshToken();

      await this.storeRefreshToken(userId, refreshToken, jti);

      return { accessToken, refreshToken: `${jti}.${refreshToken}` };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  async refresh(rawRefreshToken: string): Promise<TokensOutputDto> {
    const userId = await this.validateRefreshToken(rawRefreshToken);
    return this.generateTokens(userId);
  }

  private async validateRefreshToken(rawRefreshToken: string): Promise<string> {
    const invalid = new InvalidRefreshTokenException();

    if (!this.tokenFactory.isValidRefreshTokenFormat(rawRefreshToken)) {
      throw invalid;
    }

    const [jti, refreshToken] = rawRefreshToken.split('.');

    const refreshTokenRecord =
      await this.refreshTokenRepository.getRefreshTokenByJti(jti);

    if (!refreshTokenRecord) throw invalid;
    const isRefreshTokenValid = await this.argonHasher.compare(
      refreshToken,
      refreshTokenRecord.tokenHash,
    );
    if (!isRefreshTokenValid) {
      await this.refreshTokenRepository.deleteRefreshTokenByJti(jti);
      throw invalid;
    }

    return refreshTokenRecord.userId;
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    jti: string,
  ): Promise<void> {
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
