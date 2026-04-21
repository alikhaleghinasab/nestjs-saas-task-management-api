import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class MakeProjectsOrgNameUniquePartial1776803632297 implements MigrationInterface {
  private readonly tableName = 'projects';
  private readonly constraintAndIndexName = 'UQ_projects_organization_id_name';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      this.tableName,
      this.constraintAndIndexName,
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.constraintAndIndexName,
        columnNames: ['organization_id', 'name'],
        isUnique: true,
        where: '"deleted_at" IS NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.tableName, this.constraintAndIndexName);

    await queryRunner.createUniqueConstraint(
      this.tableName,
      new TableUnique({
        name: this.constraintAndIndexName,
        columnNames: ['organization_id', 'name'],
      }),
    );
  }
}
