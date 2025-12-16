import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDTO } from '../dto/roadmap.dto';

@Injectable()
export class DepartmentRepository {
  private readonly logger = new Logger(DepartmentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartmentDTO & { slug: string }) {
    try {
      return await this.prisma.department.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create department: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.department.findUnique({
      where: { slug },
    });
  }

  async findById(id: number) {
    return this.prisma.department.findUnique({
      where: { id },
    });
  }
}