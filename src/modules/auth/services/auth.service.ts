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

    return this.generateUserTokens(user.id);
  }

  async login(dto: LoginDto) {
    const invalid = new InvalidCredentialsException();

    const user = await this.userService.findUserForAuth({
      email: dto.email,
    });
    if (!user) throw invalid;
    if (!user.isActive) throw new ForbiddenException(USER_ERRORS.USER_BANNED);

    const passwordMatch = await this.bcryptHasher.compare(
      dto.password,
      user.password,
    );
    if (!passwordMatch) throw invalid;

    return this.refreshTokenService.generateTokens(user.id);
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

  private async generateUserTokens(userId: string) {
    return this.refreshTokenService.generateTokens(userId);
  }
}
