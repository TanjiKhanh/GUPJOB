import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

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

  async create(data: { email: string; password: string; name?: string; role?: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as any,
      },
    });
  }
  
  /**
   * Store a hashed refresh token in the DB.
   * - tokenHash: hashed form of the refresh token (bcrypt or sha256)
   * - expires: Date when the refresh token will expire
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
   * Find recent, non-revoked refresh tokens for a user.
   * Useful when validating an incoming plain refresh token (compare hashes).
   */
  async findValidRefreshTokensForUser() : Promise<Array<{ id: string; tokenHash: string; expiresAt: Date }>> {
    return this.prisma.refreshToken.findMany({
      where: {
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