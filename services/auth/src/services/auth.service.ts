import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * Minimal AuthService implementation (depends on UsersService).
 * You may already have an AuthService; adjust accordingly.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

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

  async login(dto: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}