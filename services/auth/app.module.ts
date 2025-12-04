import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './src/prisma/prisma.service';
import { HealthController } from './src/controllers/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [HealthController],
  providers: [PrismaService]
})
export class AppModule {}