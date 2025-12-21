import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, RefreshToken } from '@prisma/client';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Directly transmit 'data' so Prisma can automatically map the fields (including profile, role, etc.).
    // No need to destructure manually here.
    return this.prisma.user.create({
      data: data
    })
  }

  /**
   * Store a hashed refresh token in the DB.
   */
  async storeRefreshToken(
    userId: number,
    tokenHash: string,
    expires: Date,
    userAgent?: string,
    ip?: string,
  ): Promise<void> {
    try {
      await this.prisma.refreshToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt: expires,
          userAgent,
          ip,
        },
      });
    } catch (err) {
      this.logger.error('Failed to store refresh token', err as any);
      throw err;
    }
  }

  /**
   * Find recent, non-revoked refresh tokens.
   * Supports filtering by userId to optimize performance.
   */
  async findValidRefreshTokensForUser(userId?: number): Promise<Array<RefreshToken>> {
    return this.prisma.refreshToken.findMany({
      where: {
        userId, // Lọc theo userId nếu có
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Revoke a refresh token by id (mark revoked = true)
   */
  async revokeRefreshToken(tokenId: string) {
    return this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { revoked: true },
    });
  }

  /**
   * Revoke all refresh tokens for a user (logout all devices)
   */
  async revokeAllForUser(userId: number) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}