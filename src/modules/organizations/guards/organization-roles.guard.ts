import { RolesEnum } from '@memberships/enums/roles.enum';
import { MembershipService } from '@memberships/services/membership.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { TENANT_HEADER_NAME } from '@organizations/constants/tenant.constant';
import { ROLES_KEY } from '@users/decorators/organization-roles.decorator';
import { User } from '@users/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private membershipsService: MembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const organizationId: string = request.headers[TENANT_HEADER_NAME];

    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    if (!organizationId || !isUUID(organizationId, 7)) {
      throw new BadRequestException(
        ORGANIZATION_ERRORS.CONTEXT_MISSING,
      );
    }

    const userRole = await this.membershipsService.getUserRoleInOrganization(
      user.id,
      organizationId,
    );

    if (!userRole) {
      throw new ForbiddenException(
        ORGANIZATION_ERRORS.NOT_A_MEMBER,
      );
    }

    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      throw new ForbiddenException(
        ORGANIZATION_ERRORS.PERMISSION_DENIED,
      );
    }

    return true;
  }
}
