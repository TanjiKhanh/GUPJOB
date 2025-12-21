import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';

// Controllers & Services
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from './repositories/user.repository'; 

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Register PassportModule with default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT Async (save to read .env)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'supersecret_dev_key',
        signOptions: { expiresIn: '15m' }, // Access token 
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'), // smtp.gmail.com
          port: configService.get<number>('MAIL_PORT'), // 587
          secure: false, // TLS
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
          tls: {
            // Tránh lỗi từ chối kết nối trên môi trường local
            rejectUnauthorized: false, 
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    UsersService, 
    UsersRepository,
    PrismaService,
    JwtStrategy, 
  ],
})
export class AppModule {}