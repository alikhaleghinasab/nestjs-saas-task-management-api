import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../../users/repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '../configs/auth.config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';
import { LoginDto } from '@auth/dto/login.dto';
import { InvalidCredentialsException } from '@auth/exceptions/auth.exception';
import { USER_ERRORS } from '@users/constants/errors.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly bcryptHasher: BcryptHasher,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(dto: RegisterDto): Promise<TokensOutputDto> {
    const { saltRounds }: AuthConfigType = this.configService.get('auth');
    const hashedPassword = await this.bcryptHasher.hash(
      dto.password,
      saltRounds,
    );
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return await this.refreshTokenService.generateTokens(user.id);
  }

  async login(dto: LoginDto) {
    const invalid = new InvalidCredentialsException();

    const user = await this.userRepository.findOneForAuth({
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
}
