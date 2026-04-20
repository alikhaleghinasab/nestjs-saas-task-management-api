import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OrganizationId = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    const orgId = req['organizationId'];
    return orgId;
  },
);
