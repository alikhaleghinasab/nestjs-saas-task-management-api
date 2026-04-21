import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UpdateTaskIndexes1776795609635 implements MigrationInterface {
  private readonly tableName = 'tasks';

  private readonly oldIndexes = [
    'idx_tasks_project',
    'idx_tasks_org',
    'idx_tasks_assignee',
    'idx_tasks_status',
  ];

  private readonly idxOrgProject = 'idx_tasks_org_project';
  private readonly idxOrgAssignee = 'idx_tasks_org_assignee';
  private readonly idxOrgTitle = 'idx_tasks_org_title';
  private readonly idxStatus = 'idx_tasks_status';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const indexName of this.oldIndexes) {
      await queryRunner.dropIndex(this.tableName, indexName);
    }

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.idxOrgProject,
        columnNames: ['organization_id', 'project_id'],
        where: 'deleted_at IS NULL',
      }),
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.idxOrgAssignee,
        columnNames: ['organization_id', 'assignee_id'],
        where: 'deleted_at IS NULL',
      }),
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.idxOrgTitle,
        columnNames: ['organization_id', 'title'],
        where: 'deleted_at IS NULL',
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.idxStatus,
        columnNames: ['status'],
        where: 'deleted_at IS NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.tableName, this.idxOrgProject);
    await queryRunner.dropIndex(this.tableName, this.idxOrgAssignee);
    await queryRunner.dropIndex(this.tableName, this.idxOrgTitle);
    await queryRunner.dropIndex(this.tableName, this.idxStatus);

    await queryRunner.createIndices(this.tableName, [
      new TableIndex({
        name: 'idx_tasks_project',
        columnNames: ['project_id'],
      }),
      new TableIndex({
        name: 'idx_tasks_org',
        columnNames: ['organization_id'],
      }),
      new TableIndex({
        name: 'idx_tasks_assignee',
        columnNames: ['assignee_id'],
      }),
    ]);
  }
}
