import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '@users/users.module';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import authConfig from './configs/auth.config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';

@Module({
  imports: [UsersModule, ConfigModule.forFeature(authConfig)],
  controllers: [AuthController],
  providers: [AuthService, BcryptHasher],
})
export class AuthModule {}
