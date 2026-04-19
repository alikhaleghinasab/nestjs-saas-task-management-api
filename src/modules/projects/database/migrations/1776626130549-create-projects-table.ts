import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProjectsTable1776626130549 implements MigrationInterface {
  private readonly tableName = 'projects';

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
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'organization_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: 'UQ_projects_organization_id_name',
            columnNames: ['organization_id', 'name'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
