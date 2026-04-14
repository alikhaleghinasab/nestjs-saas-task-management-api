import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRefreshTokenIndexes1776155999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_refresh_tokens_token_hash"`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_refresh_tokens_jti" ON refresh_tokens ("jti")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_refresh_tokens_token_hash" ON refresh_tokens ("token_hash")`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_refresh_tokens_jti"`);
  }
}
