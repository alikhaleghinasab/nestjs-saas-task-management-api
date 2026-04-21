import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '@organizations/entities/organization.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('projects')
@Index('UQ_projects_organization_id_name', ['organizationId', 'name'], {
  unique: true,
})
export class Project extends BaseIdEntity {
  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: 'uuid', name: 'organization_id', nullable: false })
  organizationId: string;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ApiProperty({ default: null })
  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
