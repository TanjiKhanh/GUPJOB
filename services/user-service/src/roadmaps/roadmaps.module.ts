import { Module } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';
import { PrismaModule } from '../prisma/prisma.module';
// Import the services we just created
import { AdminClientService } from '../external/admin-client/admin-client.service';
import { AuthClientService } from '../external/auth-client/auth-client.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoadmapsController],
  providers: [
    RoadmapsService, 
    AdminClientService, 
    AuthClientService
  ], 
})
export class RoadmapsModule {}