import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from './organization.entity';
import { BaseEntity } from '@common/database/entities/base.entity';
import { ITenantEntity } from '@organizations/interfaces/tenant-entity.interface';

export abstract class TenantBaseEntity
  extends BaseEntity
  implements ITenantEntity
{
  @ApiProperty()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
