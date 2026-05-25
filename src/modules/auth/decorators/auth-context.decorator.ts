import { AuthPayload } from '@auth/interfaces/auth-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthContext = createParamDecorator(
  <K extends keyof AuthPayload>(data: K | null, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ authContext?: AuthPayload }>();
    return data ? request.authContext[data] : request.authContext;
  },
);
