import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(typeormConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
      async dataSourceFactory(options) {
        return addTransactionalDataSource({
          dataSource: new DataSource(options),
        });
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
