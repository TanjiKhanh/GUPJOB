import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * Minimal AuthService implementation (depends on UsersService).
 * You may already have an AuthService; adjust accordingly.
 */
@Injectable()
export class AuthService {
  // Dependency injection of AuthService
  private readonly REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
  private readonly logger = new Logger(AuthService.name);
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  private async createAndStoreRefreshToken(
    userId: number,
    userAgent?: string,
    ip?: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    // generate secure random token (hex)
    const plain = randomBytes(64).toString('hex');

    // hash before storing
    const hash = await bcrypt.hash(plain, 10);

    const expires = new Date(Date.now() + this.REFRESH_TTL_MS);

    // store hashed token via UsersService => repository
    await this.usersService.createRefreshToken(userId, hash, expires, userAgent, ip);

    // return the plain token (this is what you'll send to the client as a cookie)
    return { refreshToken: plain, expiresAt: expires };
  }


  private createAccessToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    // short lived
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }



  async register(dto: { email: string; password: string; name?: string; role?: string }) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new Error('User already exists');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      name: dto.name,
      role: dto.role,
    });
    // remove password before returning (Prisma returns password field)
    const { password, ...safe } = (created as any);
    return safe;
  }

  async login(dto: { email: string; password: string }, userAgent?: string, ip?: string) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Invalid credentials');

    // create access tokens
    const accessToken = this.createAccessToken(user);
    // create and store refresh token store in cookie or client storage
    const { refreshToken, expiresAt } = await this.createAndStoreRefreshToken(user.id, userAgent, ip);
    // return tokens
    const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { access_token: accessToken, refresh_token: refreshToken, refresh_expires_at: expiresAt, user: safe };
  }

  
  // validate and rotate refresh token - returns new access token and optionally new refresh token
  async refreshToken(plainToken: string, userAgent?: string, ip?: string) {
    if (!plainToken) throw new UnauthorizedException('Missing refresh token');

    // fetch candidate tokens (not revoked and not expired)
    const tokens = await this.usersService.findValidRefreshTokensForUser();

    // find matching token by comparing hash (bcrypt)
    let found = null;
    for (const t of tokens) {
      const ok = await bcrypt.compare(plainToken, t.tokenHash);
      if (ok) {
        found = t;
        break;
      }
    }

    if (!found) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // get user
    const user = await this.usersService.findById((found as any).userId);
    if (!user) throw new UnauthorizedException('Invalid token user');

    // rotate: mark old revoked and create a new refresh token
    await this.usersService.revokeRefreshToken(found.id);

    const { refreshToken: newPlain, expiresAt } = await this.createAndStoreRefreshToken(user.id, userAgent, ip);
    const accessToken = this.createAccessToken(user);

    const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { access_token: accessToken, refresh_token: newPlain, refresh_expires_at: expiresAt, user: safe };
  }

  async logout(userId: number) {
    // invalidate all refresh tokens for this user (or limit to device)
    await this.usersService.revokeAllForUser(userId);
    return { ok: true };
  }

  

  
}
