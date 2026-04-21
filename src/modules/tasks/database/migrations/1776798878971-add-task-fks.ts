import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddTaskFks1776798878971 implements MigrationInterface {
  private readonly fkOrg = 'FK_tasks_organization_id';
  private readonly fkProject = 'FK_tasks_project_id';
  private readonly fkAssignee = 'FK_tasks_assignee_id';
  private readonly fkCreatedBy = 'FK_tasks_created_by';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('tasks', [
      new TableForeignKey({
        name: this.fkOrg,
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: this.fkProject,
        columnNames: ['project_id'],
        referencedTableName: 'projects',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: this.fkAssignee,
        columnNames: ['assignee_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        name: this.fkCreatedBy,
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tasks', this.fkProject);
    await queryRunner.dropForeignKey('tasks', this.fkOrg);
    await queryRunner.dropForeignKey('tasks', this.fkAssignee);
    await queryRunner.dropForeignKey('tasks', this.fkCreatedBy);
  }
}
