import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class MakeOrganizationsSlugIndexPartial1776803006554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('organizations', 'idx_organizations_slug');

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'idx_organizations_slug',
        columnNames: ['slug'],
        isUnique: true,
        where: 'deleted_at IS NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('organizations', 'idx_organizations_slug');

    await queryRunner.createIndex(
      'organizations',
      new TableIndex({
        name: 'idx_organizations_slug',
        columnNames: ['slug'],
        isUnique: false,
      }),
    );
  }
}
