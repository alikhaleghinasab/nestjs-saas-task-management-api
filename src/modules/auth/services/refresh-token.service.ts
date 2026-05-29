import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ArgonHasher } from '@common/security/argon-hasher.service';
import { RefreshTokenRepository } from '@auth/repositories/refresh-token.repository';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { InvalidRefreshTokenException } from '@auth/exceptions/auth.exception';
import { UserService } from '@users/services/user.service';
import { USER_ERRORS } from '@users/constants/errors.constant';
import { User } from '@users/entities/user.entity';
import { AuthUser } from '@users/types/auth-user.type';
import { RefreshTokenFactory } from './refresh-token.factory';
import { AuthPayload } from '@auth/interfaces/auth-payload.interface';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly refreshTokenFactory: RefreshTokenFactory,
    private readonly jwtTokenService: JwtTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly argonHasher: ArgonHasher,
    private readonly userService: UserService,
  ) {}

  async issueTokens(user: AuthUser): Promise<TokensOutputDto> {
    const jti = this.refreshTokenFactory.generateJti();

    const payload: AuthPayload = {
      sub: user.id,
      email: user.email,
      jti,
    };

    const accessToken = await this.jwtTokenService.generateAccessToken(payload);

    const refreshToken = this.refreshTokenFactory.generateToken();

    await this.storeRefreshToken(user.id, refreshToken, jti);

    return {
      accessToken,
      refreshToken: `${jti}.${refreshToken}`,
    };
  }

  async refresh(rawRefreshToken: string): Promise<TokensOutputDto> {
    const userId = await this.validateRefreshToken(rawRefreshToken);
    const user = await this.userService.findUserById(userId);
    this.validateUser(user);
    return this.issueTokens(user);
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

    if (!this.refreshTokenFactory.isValidFormat(rawRefreshToken)) {
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
    const tokenHash = await this.argonHasher.hash(refreshToken);
    const expiresAt = this.refreshTokenFactory.calculateExpiresAt();

    await this.refreshTokenRepository.upsertRefreshTokenByUser({
      userId,
      tokenHash,
      jti,
      expiresAt,
    });
  }
}
