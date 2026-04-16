import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  <K extends keyof User>(data: K | null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: User }>();
    return data ? request.user[data] : request.user;
  },
);
