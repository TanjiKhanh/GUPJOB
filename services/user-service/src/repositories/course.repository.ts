import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseType } from '@prisma/client';
import { CreateCourseDTO } from '../dto/roadmap.dto';

@Injectable()
export class CourseRepository {
  private readonly logger = new Logger(CourseRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDTO & { slug: string }) {
    try {
      // Slug generation logic removed here because the Service handles it
      return await this.prisma.course.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          type: (data.type as CourseType) || 'JOB',
          departmentId: data.departmentId,
          structure: data.structure ?? null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create course: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Updated to handle string slug from service, or internal ID
  async findAll(departmentSlug?: string) {
    const where: any = {};
    
    if (departmentSlug) {
      where.department = {
        slug: departmentSlug
      };
    }

    return this.prisma.course.findMany({
      where,
      include: { department: true },
      orderBy: { title: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: { department: true },
    });
  }

  async findById(id: number) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { department: true },
    });
  }
}