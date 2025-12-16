import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Log that we reached the guard
    console.log('🛡️ [RoleMiddleware] Checking permissions for:', req.originalUrl);

    // 2. Check if AuthMiddleware did its job
    const user = req.user;
    console.log('👤 [RoleMiddleware] User found in request:', user);

    // 3. Check specific conditions
    if (!user) {
      console.error('❌ [RoleMiddleware] Access Denied: No user attached to request (AuthMiddleware failed?)');
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    if (user.role !== 'ADMIN') {
      console.error(`❌ [RoleMiddleware] Access Denied: Role mismatch. Required: ADMIN, Found: ${user.role}`);
      throw new ForbiddenException('Access denied: Admins only');
    }

    // 4. Success
    console.log('✅ [RoleMiddleware] Access Granted. Proceeding to Proxy.');
    next();
  }
}