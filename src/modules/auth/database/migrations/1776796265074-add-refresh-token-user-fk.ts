import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddRefreshTokenUserFk1776796265074 implements MigrationInterface {
  private readonly fkName = 'FK_refresh_tokens_user_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'refresh_tokens',
      new TableForeignKey({
        name: this.fkName,
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('refresh_tokens', this.fkName);
  }
}
