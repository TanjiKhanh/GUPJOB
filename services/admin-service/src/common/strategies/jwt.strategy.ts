import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Lightweight wrapper to use Passport JWT strategy as a Nest guard.
 * Use this as a global APP_GUARD (before RolesGuard) or per-controller.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}