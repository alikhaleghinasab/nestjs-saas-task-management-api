import { BaseEntity } from '@common/database/entities/base.entity';
import { Membership } from '@memberships/entities/membership.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, DeleteDateColumn, Entity, Index, OneToMany } from 'typeorm';

@Entity('organizations')
export class Organization extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 80 })
  name: string;

  @ApiProperty()
  @Index('idx_organizations_slug', { unique: true })
  @Column({ type: 'varchar', length: 80 })
  slug: string;

  @OneToMany(() => Membership, (membership) => membership.organization)
  memberships: Membership[];

  @ApiProperty({ default: null })
  @DeleteDateColumn({ name: 'deleted_at' })
  deleteAt: Date;
}
