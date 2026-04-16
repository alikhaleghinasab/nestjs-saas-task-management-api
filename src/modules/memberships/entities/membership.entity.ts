import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Organization } from '@organizations/entities/organization.entity';
import { User } from '@users/entities/user.entity';
import { Entity, Column, ManyToOne, Unique, Index } from 'typeorm';

@Entity('memberships')
@Unique(['user', 'organization'])
export class Membership extends BaseIdEntity {
  @ManyToOne(() => User)
  @Index('idx_memberships_user')
  user: User;

  @ManyToOne(() => Organization)
  @Index('idx_memberships_org')
  organization: Organization;

  @Column({ type: 'varchar', length: 50 })
  role: string;
}
