import { InvitationStatus } from '@organizations/enums/invitation-status.enum';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInvitationsTable1776591121747 implements MigrationInterface {
  private readonly tableName = 'invitations';
  public async up(queryRunner: QueryRunner): Promise<void> {
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
            name: 'email',
            type: 'varchar(150)',
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'role',
            type: 'membership_roles_enum',
          },
          {
            name: 'invitation_token',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(InvitationStatus),
            default: `'${InvitationStatus.PENDING}'`,
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
            name: 'idx_invitations_invitation_token',
            columnNames: ['invitation_token'],
            isUnique: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      this.tableName,
      'idx_invitations_invitation_token',
    );
    await queryRunner.dropTable(this.tableName);
  }
}
