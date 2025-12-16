import { SetMetadata } from '@nestjs/common';

/**
 * Usage:
 *  @Roles('ADMIN')
 *  @Roles('MENTOR', 'ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);