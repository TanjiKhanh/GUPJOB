import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './src/prisma/prisma.service';
import { AuthController } from './src/controllers/auth.controller';
import { AuthService } from './src/services/auth.service';
import { UsersService } from './src/services/users.service';
import { UsersRepository } from './src/repositories/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret_dev_key',
      signOptions: { expiresIn: 3600 },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, UsersService, UsersRepository],
  exports: [AuthService, UsersService],
})
export class AppModule {}
