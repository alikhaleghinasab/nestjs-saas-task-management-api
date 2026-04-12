import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DatabaseType } from './database.constant';

dotenvConfig({ path: '.env' });

export const typeormConfig = registerAs(
  'typeorm',
  (): DataSourceOptions => ({
    type: process.env.DATABASE_CONNECTION as DatabaseType,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB_NAME,

    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/**/migrations/*.js'],

    migrationsTableName: 'custom_migration_table',
    synchronize: false,

    logging: process.env.NODE_ENV !== 'production',
  }),
);

export const connectionSource = new DataSource(
  typeormConfig() as DataSourceOptions,
);
