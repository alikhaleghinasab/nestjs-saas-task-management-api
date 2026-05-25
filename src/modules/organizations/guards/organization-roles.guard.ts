import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';

import { MembershipService } from '@memberships/services/membership.service';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { ROLES_KEY } from '@organizations/decorators/organization-roles.decorator';
import { PermissionDeniedException } from '@organizations/exceptions/permission-denied.exception';

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly membershipsService: MembershipService,
    private readonly cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const userId = this.cls.get<string>('userId');

    const organizationId = this.cls.get<string>('organizationId');

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (!organizationId) {
      throw new BadRequestException(ORGANIZATION_ERRORS.CONTEXT_MISSING);
    }

    const userRole = await this.membershipsService.getUserRoleInOrganization(
      userId,
      organizationId,
    );

    if (!userRole) {
      throw new PermissionDeniedException(ORGANIZATION_ERRORS.NOT_A_MEMBER);
    }

    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      throw new PermissionDeniedException(
        ORGANIZATION_ERRORS.PERMISSION_DENIED,
      );
    }

    return true;
  }
}
