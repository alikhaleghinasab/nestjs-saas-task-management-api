import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '@users/users.module';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshToken } from './entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import authConfig from './configs/auth.config';
import { BcryptHasher } from '@common/security/bcrypt-hasher.service';
import { TokenFactory } from './services/token.factory';
import { ArgonHasher } from '@common/security/argon-hasher.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('auth.jwtAccessSecret'),
        signOptions: { algorithm: 'HS256' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [
    RefreshTokenRepository,
    AuthService,
    RefreshTokenService,
    BcryptHasher,
    ArgonHasher,
    TokenFactory,
  ],
})
export class AuthModule {}
