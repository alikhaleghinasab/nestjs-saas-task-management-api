import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { Roles } from '@memberships/enums/roles.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { TENANT_HEADER_NAME } from '@organizations/constants/tenant.constant';
import { PermissionDeniedException } from '@organizations/exceptions/permission-denied.exception';
import { OrganizationRolesGuard } from '@organizations/guards/organization-roles.guard';

export const ROLES_KEY = 'organizationRoles';

export const OrganizationProtected = (...roles: Roles[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    ApiHeader({
      name: TENANT_HEADER_NAME,
      description:
        'Tenant/Organization identifier used for multi-tenancy isolation (UUID).',
      required: true,
    }),
    UseGuards(OrganizationRolesGuard),
    ApiErrorResponsesDocs({
      exception: PermissionDeniedException,
      message: ORGANIZATION_ERRORS.PERMISSION_DENIED,
    }),
  );
