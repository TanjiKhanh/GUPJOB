import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <--- 1. Import this

import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy'; // <--- 2. Import your Strategy
import { DepartmentModule } from '../../admin-service/src/modules/department/department.module';
import {PrismaModule} from '../../admin-service/src/prisma/prisma.module'; 
import { UsersController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule, // <--- 3. Add PassportModule
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret_dev_key',
      signOptions: { expiresIn: '1h' }, // '3600' might be interpreted as ms in some versions, '1h' is safer
    }),
    DepartmentModule,
    PrismaModule,
  ],
  controllers: [AuthController, UsersController],
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