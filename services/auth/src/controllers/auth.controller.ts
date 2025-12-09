import { Controller, Post, Body, Req, Res, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt.guard'; // optional: protect logout route

const REFRESH_COOKIE = 'refresh_token';
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const user = await this.authService.register(dto);
    // Optionally auto-login after register — omitted here
    
    return user;
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;
    const result = await this.authService.login(dto, userAgent, ip);

    // set refresh cookie; HttpOnly so JS can't read it
    res.cookie(REFRESH_COOKIE, result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_MAX_AGE,
    });

    // don't return refresh token in body when using cookie; but include access_token and user
    return { access_token: result.access_token, user: result.user };
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE];
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;
    const result = await this.authService.refreshToken(token, userAgent, ip);

    // replace refresh cookie (rotated)
    res.cookie(REFRESH_COOKIE, result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_MAX_AGE,
    });

    return { access_token: result.access_token, user: result.user };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.sub;
    if (userId) {
      await this.authService.logout(userId);
    }
    // clear cookie
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return;
  }
}