import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Organization } from '@organizations/entities/organization.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity('projects')
@Index('UQ_projects_organization_id_name', ['organizationId', 'name'], {
  unique: true,
})
export class Project extends BaseIdEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', name: 'organization_id', nullable: false })
  organizationId: string;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
