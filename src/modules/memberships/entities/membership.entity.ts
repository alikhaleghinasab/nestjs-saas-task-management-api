import { User } from '@users/entities/user.entity';
import { Entity, Column, ManyToOne, Unique, Index, JoinColumn } from 'typeorm';
import { Roles } from '../enums/roles.enum';
import { Organization } from '@organizations/entities/organization.entity';
import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { ITenantEntity } from '@organizations/interfaces/tenant-entity.interface';

@Entity('memberships')
@Index('idx_memberships_user_org_composite', ['userId', 'organizationId'])
@Unique(['userId', 'organizationId'])
export class Membership extends BaseIdEntity implements ITenantEntity {
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization, (org) => org.memberships, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;
}
