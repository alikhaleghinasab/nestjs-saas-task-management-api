import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserRepository } from '../../users/repositories/user.repositroy';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '../configs/auth.config';
import { User } from '@users/entities/user.entity';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly bcryptHasher: BcryptHasher,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const { saltRounds }: AuthConfigType = this.configService.get('auth');
    const hashedPassword = await this.bcryptHasher.hash(
      dto.password,
      saltRounds,
    );
    return await this.userRepository.createUser({
      email: dto.email,
      password: hashedPassword,
    });
  }
}
