import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { DatabaseType } from './database.constant';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const createTypeOrmOptions = (): DataSourceOptions => ({
  type: process.env.DATABASE_CONNECTION as DatabaseType,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,

  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../**/migrations/*.{js,ts}'],

  migrationsTableName: 'custom_migration_table',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

export const typeormConfig = registerAs('typeorm', createTypeOrmOptions);
