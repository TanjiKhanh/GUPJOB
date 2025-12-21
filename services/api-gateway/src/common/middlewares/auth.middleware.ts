import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// 1. Extend the Express Request type so TypeScript doesn't complain about 'req.user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 2. Skip Auth for public routes (Login/Register)
    const publicRoutes = ['/auth/login', '/auth/register' ,'/auth/refresh-token', '/auth/reset-password', '/auth/forgot-password'];
    if (publicRoutes.some(route => req.originalUrl.startsWith(route))) {
      return next();
    }

    // 3. Check for the Authorization header
    const rawHeader = req.headers['authorization'];
    if (!rawHeader) {
      console.log('⛔ No Authorization header found');
      throw new UnauthorizedException('No token provided');
    }

    // 4. Normalize header (handle arrays) and extract the token
    const authHeader = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    const parts = authHeader.split(' ');
    if (parts.length < 2) {
      console.log('⛔ Malformed Authorization header');
      throw new UnauthorizedException('Malformed authorization header');
    }

    const token = parts[1];

    try {
      // 5. DECODE THE PAYLOAD (This is the step you asked about!)
      // We verify the signature using the shared Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 6. ATTACH TO REQUEST
      // jwt.verify can return string or object; ensure we set an object
      const payload = typeof decoded === 'string' ? { sub: decoded } : decoded;
      req.user = payload as any;

      console.log('✅ Gateway Auth Success. User:', (req.user as any).email || (req.user as any).sub, '| Role:', (req.user as any).role);

      next();
    } catch (err) {
      console.log('❌ Gateway Token Verification Failed:', err.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}