import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMembershipIndexes1776453959135 implements MigrationInterface {
  private tableName = 'memberships';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(this.tableName, 'idx_memberships_user');
    await queryRunner.dropIndex(this.tableName, 'idx_memberships_org');

    await queryRunner.query(`
      CREATE INDEX idx_memberships_user_org_composite
      ON ${this.tableName} (user_id, organization_id)
      INCLUDE (role);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_memberships_user_org_composite;
    `);

    await queryRunner.query(`
      CREATE INDEX idx_memberships_user
      ON ${this.tableName} (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_memberships_org
      ON ${this.tableName} (organization_id);
    `);
  }
}
