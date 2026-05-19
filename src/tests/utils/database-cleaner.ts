import { DataSource } from 'typeorm';

export async function clearDatabase(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;

  const tableNames = entities
    .map((entity) => `"${entity.tableName}"`)
    .join(', ');

  await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
}
