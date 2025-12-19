import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from '../services/users.service'; // Direct access to UsersService

@Controller('users') // 👈 This matches the URL /users/:id
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(Number(id));
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 🛡️ Security: Remove password, departmentId, etc. if needed
    const { password, ...result } = user;
    return result;
  }
}