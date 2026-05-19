import { DataSource } from 'typeorm';

export async function prepareTestDatabase(
  dataSource: DataSource,
): Promise<void> {
  await dataSource.initialize();
  await dataSource.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await dataSource.runMigrations();
}
