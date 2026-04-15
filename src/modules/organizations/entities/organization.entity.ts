import { BaseEntity } from '@common/database/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';

@Entity('organizations')
export class Organization extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 80 })
  name: string;

  @ApiProperty()
  @Index('idx_organizations_slug', { unique: true })
  @Column({ type: 'varchar', length: 80 })
  slug: string;
}
