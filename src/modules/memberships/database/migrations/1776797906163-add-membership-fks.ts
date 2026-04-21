import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddMembershipFks1776797906163 implements MigrationInterface {
  private readonly fkUser = 'FK_memberships_user_id';
  private readonly fkOrg = 'FK_memberships_organization_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('memberships', [
      new TableForeignKey({
        name: this.fkUser,
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: this.fkOrg,
        columnNames: ['organization_id'],
        referencedTableName: 'organizations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('memberships', this.fkUser);
    await queryRunner.dropForeignKey('memberships', this.fkOrg);
  }
}
