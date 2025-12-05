import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: {
        email: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<any>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
