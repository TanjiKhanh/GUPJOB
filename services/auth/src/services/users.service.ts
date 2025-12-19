import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user.repository';
import { Prisma, User } from '@prisma/client';

/**
 * UsersService is a thin layer calling UsersRepository (Prisma).
 * Implementations may already exist in your project - keep as-is if so.
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findByEmail(email);
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepo.findById(id);
  }

  createUser(payload: Prisma.UserCreateInput): Promise<User> {
    return this.usersRepo.create(payload);
  }

  async createRefreshToken(
    userId: number,
    tokenHash: string,
    expires: Date,
    userAgent?: string,
    ip?: string,
  ): Promise<void> {
    return this.usersRepo.storeRefreshToken(userId, tokenHash, expires, userAgent, ip);
  }

  async findValidRefreshTokensForUser(): Promise<Array<{ id: string; tokenHash: string; expiresAt: Date }>> {
    return this.usersRepo.findValidRefreshTokensForUser();
  }

  // Revoke a single refresh token by id
  async revokeRefreshToken(tokenId: string) {
    return this.usersRepo.revokeRefreshToken(tokenId);
  }

  // Revoke all refresh tokens for a user (logout all devices)
  async revokeAllForUser(userId: number) {
    return this.usersRepo.revokeAllForUser(userId);
  }
  

}