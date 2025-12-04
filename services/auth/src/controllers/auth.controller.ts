import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

/**
 * AuthController
 * - POST /auth/register  -> register a new user
 * - POST /auth/login     -> login, returns { access_token }
 *
 * This controller delegates to AuthService which handles hashing, user creation (via UsersService)
 * and JWT issuance. It intentionally keeps responses minimal (do not return password hashes).
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // AuthService.register should:
    // - validate uniqueness
    // - hash password
    // - create user via UsersService / UsersRepository (Prisma)
    // - return created user (without password)
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // AuthService.login should:
    // - validate credentials
    // - return { access_token }
    return this.authService.login(dto);
  }
}