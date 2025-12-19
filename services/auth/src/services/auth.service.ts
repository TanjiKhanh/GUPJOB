import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

// 👇 IMPORT YOUR DTOS
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import {DepartmentService} from '../../../admin-service/src/modules/department/department.service';
@Injectable()
export class AuthService {
 
  private readonly REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
    private readonly departmentService: DepartmentService, 
  ) {}

  // ... (createAccessToken and createAndStoreRefreshToken methods remain the same) ...
  private createAccessToken(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      deptId: user.departmentSlug,
      job: user.jobPriority      
    };
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  private async createAndStoreRefreshToken(userId: number, userAgent?: string, ip?: string) {
    const plain = randomBytes(64).toString('hex');
    const hash = await bcrypt.hash(plain, 10);
    const expires = new Date(Date.now() + this.REFRESH_TTL_MS);
    await this.usersService.createRefreshToken(userId, hash, expires, userAgent, ip);
    return { refreshToken: plain, expiresAt: expires };
  }

  // =========================================
  // 2. REGISTER (Updated to use RegisterDto)
  // =========================================
  async register(dto: RegisterDto) { // 👈 Usage here
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const department = await this.departmentService.findOne(dto.departmentSlug); // Ensure department exists

    if (!department) {
      throw new Error('Department not found');
    }
    


    const created = await this.usersService.createUser({
      email: dto.email,
      password: hashed,
      name: dto.name,
      role: dto.role,
      // DTO ensures these fields exist now:
      departmentId: department.id, 
      jobPriority: dto.jobPriority    
    } as any);

    const { password, ...safe } = (created as any);
    return safe;
  }

  // =========================================
  // 3. LOGIN (Updated to use LoginDto)
  // =========================================
  async login(dto: LoginDto, userAgent?: string, ip?: string) { // 👈 Usage here
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const matched = await bcrypt.compare(dto.password, user.password);
    if (!matched) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.createAccessToken(user);
    const { refreshToken, expiresAt } = await this.createAndStoreRefreshToken(user.id, userAgent, ip);

    const safe = { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      deptId: user.departmentId,
      job: user.jobPriority 
    };

    return { 
      access_token: accessToken, 
      refresh_token: refreshToken, 
      refresh_expires_at: expiresAt, 
      user: safe 
    };
  }

  // ... (refreshToken and logout methods remain the same) ...
  async refreshToken(plainToken: string, userAgent?: string, ip?: string) {
    if (!plainToken) throw new UnauthorizedException('Missing refresh token');
    const tokens = await this.usersService.findValidRefreshTokensForUser();
    let found = null;
    for (const t of tokens) {
      const ok = await bcrypt.compare(plainToken, t.tokenHash);
      if (ok) { found = t; break; }
    }
    if (!found) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findById((found as any).userId);
    if (!user) throw new UnauthorizedException('Invalid token user');

    await this.usersService.revokeRefreshToken(found.id);

    const { refreshToken: newPlain, expiresAt } = await this.createAndStoreRefreshToken(user.id, userAgent, ip);
    const accessToken = this.createAccessToken(user);

    const safe = { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      deptId: user.departmentId,
      job: user.jobPriority 
    };

    return { access_token: accessToken, refresh_token: newPlain, refresh_expires_at: expiresAt, user: safe };
  }

  async logout(userId: number) {
    await this.usersService.revokeAllForUser(userId);
    return { ok: true };
  }


  async findUserById(id: number) {
    return this.usersService.findById(id);
  }
}