import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ userId?: string }>();
    return request.userId;
  },
);
