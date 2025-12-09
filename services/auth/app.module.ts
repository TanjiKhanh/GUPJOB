import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <--- 1. Import this

import { PrismaService } from './src/prisma/prisma.service';
import { AuthController } from './src/controllers/auth.controller';
import { AuthService } from './src/services/auth.service';
import { UsersService } from './src/services/users.service';
import { UsersRepository } from './src/repositories/user.repository';
import { JwtStrategy } from './src/strategies/jwt.strategy'; // <--- 2. Import your Strategy

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule, // <--- 3. Add PassportModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret_dev_key',
      signOptions: { expiresIn: '1h' }, // '3600' might be interpreted as ms in some versions, '1h' is safer
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService, 
    AuthService, 
    UsersService, 
    UsersRepository,
    JwtStrategy, // <--- 4. CRITICAL: Add Strategy to Providers
  ],
  exports: [AuthService, UsersService],
})
export class AppModule {}