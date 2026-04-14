import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRefreshTokenIndexes1776155136224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_refresh_tokens_expires_at"`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_refresh_tokens_user_id" ON refresh_tokens ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "idx_refresh_tokens_expires_at" ON refresh_tokens ("expires_at")`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_refresh_tokens_user_id"`,
    );
  }
}
