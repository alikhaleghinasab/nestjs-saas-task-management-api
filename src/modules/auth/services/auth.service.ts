import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../../users/repositories/user.repositroy';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '../configs/auth.config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokensOutputDto } from '@auth/dto/tokens-output.dto';

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
    const user = await this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
    return await this.refreshTokenService.generateTokens(user.id);
  }
}
