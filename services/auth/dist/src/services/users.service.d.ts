import { UsersRepository } from '../repositories/user.repository';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: UsersRepository);
    findByEmail(email: string): Promise<{
        name: string | null;
        id: number;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: number): Promise<{
        name: string | null;
        id: number;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createUser(payload: {
        email: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<{
        name: string | null;
        id: number;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
