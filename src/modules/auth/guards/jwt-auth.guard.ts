import { TokenFactory } from '@auth/services/token.factory';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@users/services/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenFactory: TokenFactory,
    private readonly usersService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublic(ctx);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();

    const token = this.getToken(req);
    const payload = this.tokenFactory.verifyAccessToken(token);

    const user = await this.usersService.findUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    return true;
  }

  private getToken(req): string {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    return auth.slice(7);
  }

  private isPublic(ctx: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>('isPublic', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
  }
}
