import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Global Shared Modules
import { PrismaModule } from './prisma/prisma.module'; // Or from your libs path if using aliases

// Feature Modules
import { DepartmentModule } from './modules/department/department.module';
import { CourseModule } from './modules/course/course.module';
import {RoadmapModule} from './modules/roadmap/roadmap.module'
import {PublicModule} from './modules/public/public.module'


@Module({
  imports: [
    // 1. Global Config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Database Connection
    PrismaModule, 

    // 3. Feature Modules (These contain their own Controllers/Providers)
    DepartmentModule,
    CourseModule,
    RoadmapModule,
    PublicModule,

    // 4. Strategy
  ],
  controllers: [], // 👈 Keep empty! Controllers belong in their modules.
})
export class AppModule {}