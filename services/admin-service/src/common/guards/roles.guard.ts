import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RolesGuard reads the metadata added by @Roles(...) and checks req.user.role.
 * It expects AuthGuard to run earlier and attach req.user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the @Roles decorator
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('🔒 Required Roles:', requiredRoles);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No restriction
    }

    // 2. Get the user from the request (attached by JwtStrategy)
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    console.log('👤 User from Request:', user);

    if (!user || !user.role) {
      console.error('❌ User is missing or has no role property!');
      return false;
    }

    // 3. Check logic
    // Handle if user.role is an Array or String
    let hasRole = false;
    if (Array.isArray(user.role)) {
      hasRole = user.role.some((r) => requiredRoles.includes(r));
    } else {
      hasRole = requiredRoles.includes(user.role);
    }

    console.log(`Checking if '${user.role}' is inside [${requiredRoles}] -> Result: ${hasRole}`);
    return hasRole;
  }
}