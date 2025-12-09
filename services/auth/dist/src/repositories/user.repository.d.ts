import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
export declare class UsersRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<User>;
}
