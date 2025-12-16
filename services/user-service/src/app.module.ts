import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoadmapController } from './controllers/roadmap.controller';
import { RoadmapService } from './services/roadmap.service';
import { RoadmapRepository } from './repositories/roadmap.repository';
import { DepartmentRepository } from './repositories/department.repository';
import { CourseRepository } from './repositories/course.repository';

// 👇 FIX 1: Import the Module, not just the service
import { PrismaModule } from '@libs/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 👇 FIX 2: Add PrismaModule here
    PrismaModule, 
  ],
  controllers: [RoadmapController],
  providers: [
    // 👇 FIX 3: REMOVE PrismaService from here. 
    // It is already provided by PrismaModule above.

    // Repositories
    RoadmapRepository,
    DepartmentRepository,
    CourseRepository,

    // Business service
    RoadmapService,
  ],
})
export class AppModule {}