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
import { ArgonHasher } from '@common/security/argon-hasher.service';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtTokenService } from './services/jwt-token.service';
import { RefreshTokenFactory } from './services/refresh-token.factory';

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
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    RefreshTokenRepository,
    AuthService,
    RefreshTokenService,
    ArgonHasher,
    JwtTokenService,
    RefreshTokenFactory,
  ],
  exports: [JwtTokenService, JwtModule],
})
export class AuthModule {}
