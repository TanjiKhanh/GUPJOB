import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() makes this module available everywhere without importing it in every single sub-module of your service
@Global() 
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export so other services can inject PrismaService
})
export class PrismaModule {}