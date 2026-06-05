import { DomainExceptionFilter } from '@common/filters/domain-exception.filter';
import { ResponseExceptionFilter } from '@common/filters/response-exception.filter';
import { DatabaseModule } from '@database/database.module';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from 'configs/app.config';
import { configValidationSchema } from 'env.validation';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CoreModule } from '@core/core.module';
import { MembershipModule } from '@memberships/membership.module';
import { ClsModule } from 'nestjs-cls';
import { HealthModule } from 'modules/health/health.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      envFilePath: '.env',
    }),
    ConfigModule.forFeature(appConfig),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CoreModule,
    MembershipModule,
    HealthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
