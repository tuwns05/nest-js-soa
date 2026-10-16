import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();
    const [scheme, token, extra] =
      request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token || extra !== undefined) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      request.user = await this.jwtService.verifyAsync(token, {
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    return true;
  }
}
