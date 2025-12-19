import { SetMetadata } from '@nestjs/common';

/**
 * Usage:
 *  @Roles('ADMIN')
 *  @Roles('MENTOR', 'ADMIN')
 */

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);