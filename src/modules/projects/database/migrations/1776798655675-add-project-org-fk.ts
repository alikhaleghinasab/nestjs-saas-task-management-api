import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddProjectOrgFk1776798655675 implements MigrationInterface {
  private readonly fk = 'FK_projects_organization_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'projects',
      new TableForeignKey({
        name: this.fk,
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('projects', this.fk);
  }
}
