import { BaseIdEntity } from '@common/database/entities/base-id.entity';
import { Organization } from '@organizations/entities/organization.entity';

export interface ITenantEntity extends BaseIdEntity {
  organizationId: string;
  organization: Organization;
}
