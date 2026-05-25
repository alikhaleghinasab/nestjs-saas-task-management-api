import { IS_PUBLIC_KEY } from '@auth/decorators/public.decorator';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ORGANIZATION_ERRORS } from '@organizations/constants/errors.constant';
import { resolveOrganizationId } from '@organizations/utils/organization-id.resolver';
import { isUUID } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class OrganizationContextGuard implements CanActivate {
  constructor(
    private readonly cls: ClsService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<FastifyRequest & { organizationId?: string }>();

    const organizationId = resolveOrganizationId(req);

    if (organizationId) {
      if (!isUUID(organizationId, 7)) {
        throw new BadRequestException(ORGANIZATION_ERRORS.CONTEXT_MISSING);
      }
      this.cls.set('organizationId', organizationId);
      req.organizationId = organizationId;
    }

    return true;
  }
}
