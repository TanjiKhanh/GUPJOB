import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. Read token from the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Use the same secret used to sign the token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'supersecret_dev_key',
    });
  }

  async validate(payload: any) {
    // 3. Return the user object (attached to req.user)
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}