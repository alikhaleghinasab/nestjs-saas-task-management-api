import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMembershipRolesEnum1776341559380 implements MigrationInterface {
  enumName = 'membership_roles_enum';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE ${this.enumName} AS ENUM ('owner', 'admin', 'member');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TYPE IF EXISTS ${this.enumName};
    `);
  }
}
