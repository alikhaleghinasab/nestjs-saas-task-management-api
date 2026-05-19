import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import { typeormConfig } from '@database/typeorm.config';
import { prepareTestDatabase } from './prepare-test-db';

export default async () => {
  const dataSource = new DataSource(typeormConfig());
  await prepareTestDatabase(dataSource);
  await dataSource.destroy();
};
