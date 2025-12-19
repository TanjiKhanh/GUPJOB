export * from './prisma.module';
export * from './prisma.service';
// You can also export types if needed, though usually @prisma/client is global

// 👇 CRITICAL: Re-export Prisma types so services can use 'User', 'Role', etc.
export * from '@prisma/client';