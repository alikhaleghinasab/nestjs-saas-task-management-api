import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Organization } from '@organizations/entities/organization.entity';
import { User } from '@users/entities/user.entity';
import { Entity, Column, ManyToOne, Unique, Index, JoinColumn } from 'typeorm';
import { RolesEnum } from '../enums/roles.enum';

@Entity('memberships')
@Index('idx_memberships_user_org_composite', ['userId', 'organizationId'])
@Unique(['userId', 'organizationId'])
export class Membership extends BaseIdEntity {
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid', name: 'organization_id', nullable: false })
  organizationId: string;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'enum', enum: RolesEnum })
  role: RolesEnum;
}
