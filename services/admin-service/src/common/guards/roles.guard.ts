import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // 👈 Same import as above

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 🔓 CHECK FOR PUBLIC FIRST
    // We MUST do this here too. If we don't, the code below will try to read
    // 'req.user.role', which will crash if the user is a Guest (no token).
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('🔓 Public route accessed, skipping role check');
      return true; // ✅ Bypass role check for public routes
    }

    // 2. Get required roles
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    // If no specific roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; 
    }

    // 3. Get User (Attached by AuthGuard)
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Safety check: If we are here, we expect a user.
    if (!user || !user.role) {
      console.error('❌ Access Denied: User missing or has no role');
      return false;
    }

    // 4. Verify Role
    if (Array.isArray(user.role)) {
      return user.role.some((r) => requiredRoles.includes(r));
    }
    
    return requiredRoles.includes(user.role);
  }
}