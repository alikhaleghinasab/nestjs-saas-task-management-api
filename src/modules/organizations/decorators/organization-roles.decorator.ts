import { ApiErrorResponsesDocs } from '@common/decorators/api-error-response-docs.decorator';
import { Roles } from '@memberships/enums/roles.enum';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiHeader, ApiParam } from '@nestjs/swagger';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import {
  TENANT_HEADER_NAME,
  TENANT_PARAM_NAME,
} from '@organizations/constants/tenant.constant';
import { PermissionDeniedException } from '@organizations/exceptions/permission-denied.exception';

export const ROLES_KEY = 'organizationRoles';

export const TenantHeader = (required = true) =>
  ApiHeader({
    name: TENANT_HEADER_NAME,
    description:
      'Tenant/Organization identifier used for multi-tenancy isolation (UUID).',
    required,
  });

export const TenantParam = () => ApiParam({ name: TENANT_PARAM_NAME });

export const OrganizationPermissionErrorDocs = () =>
  applyDecorators(
    ApiErrorResponsesDocs({
      exception: PermissionDeniedException,
      message: ORGANIZATION_ERRORS.NOT_A_MEMBER,
    }),
    ApiErrorResponsesDocs({
      exception: PermissionDeniedException,
      message: ORGANIZATION_ERRORS.PERMISSION_DENIED,
    }),
  );

export const OrganizationProtected = (...roles: Roles[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    OrganizationPermissionErrorDocs(),
  );
