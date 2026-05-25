import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ArgonHasher } from '@common/security/argon-hasher.service';
import { RefreshTokenRepository } from '@auth/repositories/refresh-token.repository';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { TokenFactory } from './token.factory';
import { InvalidRefreshTokenException } from '@auth/exceptions/auth.exception';
import { UserService } from '@users/services/user.service';
import { USER_ERRORS } from '@users/constants/errors.constant';
import { User } from '@users/entities/user.entity';
import { AuthUser } from '@users/types/auth-user.type';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly tokenFactory: TokenFactory,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly argonHasher: ArgonHasher,
    private readonly userService: UserService,
  ) {}

  async generateTokens(user: AuthUser): Promise<TokensOutputDto> {
    const jti = this.tokenFactory.newJti();
    try {
      const accessToken = await this.tokenFactory.generateAccessToken(
        user.id,
        jti,
        user.email,
      );
      const refreshToken = this.tokenFactory.generateRefreshToken();

      await this.storeRefreshToken(user.id, refreshToken, jti);

      return { accessToken, refreshToken: `${jti}.${refreshToken}` };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  async refresh(rawRefreshToken: string): Promise<TokensOutputDto> {
    const userId = await this.validateRefreshToken(rawRefreshToken);
    const user = await this.userService.findUserById(userId);
    this.validateUser(user);
    return this.generateTokens(user);
  }

  private validateUser(user: User | null): asserts user is User {
    if (!user) {
      throw new NotFoundException(USER_ERRORS.USER_NOT_FOUND);
    }
    if (!user.isActive) {
      throw new ForbiddenException(USER_ERRORS.USER_BANNED);
    }
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
