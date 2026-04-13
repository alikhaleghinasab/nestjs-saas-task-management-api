import { ResponseExceptionFilter } from '@common/filters/response-exception.filter';
import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ProjectModule } from '@project/project.module';
import { configValidationSchema } from 'env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ResponseExceptionFilter,
    },
  ],
})
export class AppModule {}
