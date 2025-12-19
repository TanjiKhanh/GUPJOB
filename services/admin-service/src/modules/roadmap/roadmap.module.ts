import { Module } from '@nestjs/common';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';
import { RoadmapRepository } from './roadmap.repository';
import { PrismaService } from '../../prisma/prisma.service';


@Module({
  imports: [],
  controllers: [RoadmapController],
  providers: [
    PrismaService,
    RoadmapRepository,
    RoadmapService,
  ],
  exports: [RoadmapService],
})
export class RoadmapModule {}