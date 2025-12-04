import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';

/**
 * UsersService is a thin layer calling UsersRepository (Prisma).
 * Implementations may already exist in your project - keep as-is if so.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  findById(id: number) {
    return this.usersRepo.findById(id);
  }

  createUser(payload: { email: string; password: string; name?: string; role?: string }) {
    return this.usersRepo.create(payload);
  }
}