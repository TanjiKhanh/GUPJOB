import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 👈 Import ConfigService
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { JwtModule } from '@nestjs/jwt'; // 👈 Import JwtModule

import { PrismaModule } from './prisma/prisma.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { AdminClientModule } from './external/admin-client/admin-client.module';

@Module({
  imports: [
    // 1. Config
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Database
    PrismaModule,

    // 3. Cache
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
          },
          ttl: 3600 * 1000,
        }),
      }),
    }),

    // 4. ⚡ JWT AUTH (THE FIX)
    JwtModule.registerAsync({
      global: true, // 👈 THIS LINE IS CRITICAL. It makes JwtService visible to RoadmapsModule.
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),

    // 5. External & Features
    AdminClientModule,
    RoadmapsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}