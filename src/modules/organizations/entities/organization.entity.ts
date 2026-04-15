import { BaseEntity } from '@common/database/entities/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Index('idx_organizations_slug', { unique: true })
@Column({ type: 'varchar', length: 80 })
  slug: string;
}
