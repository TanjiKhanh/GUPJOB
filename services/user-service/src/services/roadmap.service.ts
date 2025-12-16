import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoadmapRepository } from '../repositories/roadmap.repository';
import { DepartmentRepository } from '../repositories/department.repository';
import { CourseRepository } from '../repositories/course.repository';
import { CreateDepartmentDTO, CreateCourseDTO, CreateRoadmapDTO } from '../dto/roadmap.dto';

@Injectable()
export class RoadmapService {
  constructor(
    private readonly roadmapRepo: RoadmapRepository,
    private readonly departmentRepo: DepartmentRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  // --- Departments ---
  async createDepartment(dto: CreateDepartmentDTO) {
    // basic duplicate check by slug or name (repository may enforce unique constraint)
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.departmentRepo.findBySlug(slug);
    if (existing) {
      throw new BadRequestException(`Department with slug '${slug}' already exists`);
    }
    return this.departmentRepo.create({ ...dto, slug });
  }

  async listDepartments() {
    return this.departmentRepo.findAll();
  }

  // --- Courses ---
  async createCourse(dto: CreateCourseDTO) {
    // If departmentId provided ensure it exists
    if (dto.departmentId) {
      const dep = await this.departmentRepo.findById(dto.departmentId);
      if (!dep) {
        throw new BadRequestException(`Department with id ${dto.departmentId} not found`);
      }
    }

    // ensure slug uniqueness (repo may also handle)
    const slug = dto.slug ?? dto.title.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.courseRepo.findBySlug(slug);
    if (existing) {
      throw new BadRequestException(`Course with slug '${slug}' already exists`);
    }

    return this.courseRepo.create({ ...dto, slug });
  }

  async listCourses(departmentSlug?: string) {
    return this.courseRepo.findAll(departmentSlug);
  }

  // --- Roadmaps ---
  async createRoadmap(dto: CreateRoadmapDTO) {
    // optional: verify course exists if courseId provided
    if (dto.courseId) {
      const course = await this.courseRepo.findById(dto.courseId);
      if (!course) {
        throw new BadRequestException(`Course with id ${dto.courseId} not found`);
      }
    }

    // delegate transaction to repository which creates roadmap, nodes, edges
    return this.roadmapRepo.createWithNodesAndEdges(dto);
  }

  async getRoadmapBySlug(slug: string) {
    const roadmap = await this.roadmapRepo.getBySlugWithNodesEdges(slug);
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with slug '${slug}' not found`);
    }
    return roadmap;
  }
}