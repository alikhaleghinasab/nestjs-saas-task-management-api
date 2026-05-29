import { JwtTokenService } from '@auth/services/jwt-token.service';
import { AppClsStore } from '@core/interfaces/cls-store.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublic(ctx);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest();

    const token = this.getToken(req);
    const payload = this.jwtTokenService.verifyAccessToken(token);

    const userId = payload.sub;
    this.cls.set('userId', userId);
    req.userId = userId;
    req.authContext = payload;
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
