import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTasksTable1700000000000 implements MigrationInterface {
  private readonly tableName = 'tasks';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done')`,
    );
    await queryRunner.query(
      `CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high')`,
    );

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
            name: 'title',
            type: 'varchar(125)',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'task_status',
          },
          {
            name: 'priority',
            type: 'task_priority',
            isNullable: true,
          },

          {
            name: 'due_date',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'project_id',
            type: 'uuid',
          },
          {
            name: 'assignee_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
        indices: [
          {
            name: `idx_${this.tableName}_project`,
            columnNames: ['project_id'],
          },
          {
            name: `idx_${this.tableName}_org`,
            columnNames: ['organization_id'],
          },
          {
            name: `idx_${this.tableName}_assignee`,
            columnNames: ['assignee_id'],
          },
          {
            name: `idx_${this.tableName}_status`,
            columnNames: ['status'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      this.tableName,
      `idx_${this.tableName}_project`,
    );
    await queryRunner.dropIndex(this.tableName, `idx_${this.tableName}_org`);
    await queryRunner.dropIndex(
      this.tableName,
      `idx_${this.tableName}_assignee`,
    );
    await queryRunner.dropIndex(this.tableName, `idx_${this.tableName}_status`);

    await queryRunner.dropTable(this.tableName);

    await queryRunner.query(`DROP TYPE task_status`);
    await queryRunner.query(`DROP TYPE task_priority`);
  }
}
