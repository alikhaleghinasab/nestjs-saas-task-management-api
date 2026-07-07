import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '@organizations/entities/organization.entity';
import { ITenantEntity } from '@organizations/interfaces/tenant-entity.interface';
import {
  Entity,
  Column,
  Index,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('projects')
@Index('UQ_projects_organization_id_name', ['organizationId', 'name'], {
  unique: true,
  where: 'deleted_at IS NULL',
})
export class Project extends BaseIdEntity implements ITenantEntity {
  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ default: null })
  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
