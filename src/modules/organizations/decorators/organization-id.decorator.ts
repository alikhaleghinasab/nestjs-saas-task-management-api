import { Headers } from '@nestjs/common';
import { TENANT_HEADER_NAME } from '@organizations/constants/tenant.constant';

export const OrganizationId = () => Headers(TENANT_HEADER_NAME);
