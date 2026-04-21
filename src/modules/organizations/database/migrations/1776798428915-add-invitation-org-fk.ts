import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddInvitationOrgFk1776798428915 implements MigrationInterface {
  private readonly fk = 'FK_invitation_organization_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'invitations',
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
    await queryRunner.dropForeignKey('invitations', this.fk);
  }
}
