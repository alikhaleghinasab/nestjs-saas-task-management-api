import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '../configs/auth.config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { InvalidCredentialsException } from '@auth/exceptions/auth.exception';
import { USER_ERRORS } from '@users/constants/errors.constant';
import { Transactional } from 'typeorm-transactional';
import { UserService } from '@users/services/user.service';
import { AuthUser } from '@users/types/auth-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly bcryptHasher: BcryptHasher,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Transactional()
  async register(dto: RegisterDto): Promise<TokensOutputDto> {
    const user = await this.createUserWithHashedPassword(dto);
    return this.generateUserTokens(user);
  }

  async login(dto: LoginDto): Promise<TokensOutputDto> {
    const user = await this.getActiveUserByEmail(dto.email);

    await this.validatePassword(dto.password, user.password);

    return this.generateUserTokens(user);
  }

  private async getActiveUserByEmail(email: string) {
    const user = await this.userService.findUserForAuth({ email });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive) {
      throw new ForbiddenException(USER_ERRORS.USER_BANNED);
    }

    return user;
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const passwordMatch = await this.bcryptHasher.compare(
      plainPassword,
      hashedPassword,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
  }

  private async createUserWithHashedPassword(dto: RegisterDto) {
    const { saltRounds }: AuthConfigType = this.configService.get('auth');

    const hashedPassword = await this.bcryptHasher.hash(
      dto.password,
      saltRounds,
    );

    return this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  private async generateUserTokens(user: AuthUser): Promise<TokensOutputDto> {
    return this.refreshTokenService.generateTokens(user);
  }
}
