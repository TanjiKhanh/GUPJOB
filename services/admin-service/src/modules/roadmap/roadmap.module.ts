import { Module } from '@nestjs/common';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';
import { RoadmapRepository } from './roadmap.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [],
  controllers: [RoadmapController],
  providers: [
    PrismaService,
    RoadmapRepository,
    RoadmapService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [RoadmapService],
})
export class RoadmapModule {}