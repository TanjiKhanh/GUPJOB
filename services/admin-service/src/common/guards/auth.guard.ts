import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

/**
 * Simple JWT guard that:
 * - reads Authorization: Bearer <token>
 * - verifies with process.env.JWT_SECRET
 * - attaches decoded payload to request.user
 *
 * Note: In production you should use Passport strategies (e.g., @nestjs/passport + passport-jwt)
 * or your existing auth middleware. This guard is intentionally small and framework-agnostic for the
 * example project.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Missing Authorization header');

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const payload = jwt.verify(token, secret) as any;
      // attach user payload to request
      (req as any).user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}