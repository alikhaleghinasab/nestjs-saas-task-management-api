import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateMembershipsTable1776341559381 implements MigrationInterface {
  tableName = 'memberships';
  enumName = 'membership_roles_enum';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role',
            type: this.enumName,
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: 'UQ_memberships_user_org',
            columnNames: ['user_id', 'organization_id'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'idx_memberships_user',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'idx_memberships_org',
        columnNames: ['organization_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.tableName, 'idx_memberships_org');
    await queryRunner.dropIndex(this.tableName, 'idx_memberships_user');

    await queryRunner.dropTable(this.tableName);
  }
}
