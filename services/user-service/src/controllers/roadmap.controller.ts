import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { RoadmapService } from '../services/roadmap.service';
import { 
  CreateDepartmentSchema, 
  CreateCourseSchema, 
  CreateRoadmapSchema,
  CreateDepartmentDTO, 
  CreateCourseDTO, 
  CreateRoadmapDTO 
} from '../dto/department.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  // --- Departments ---
  @Post('departments')
  @UsePipes(new ZodValidationPipe(CreateDepartmentSchema))
  async createDepartment(@Body() body: CreateDepartmentDTO) {
    return this.roadmapService.createDepartment(body);
  }

  @Get('departments')
  async getDepartments() {
    return this.roadmapService.listDepartments();
  }

  // --- Courses ---
  @Post('courses')
  @UsePipes(new ZodValidationPipe(CreateCourseSchema))
  async createCourse(@Body() body: CreateCourseDTO) {
    return this.roadmapService.createCourse(body);
  }

  @Get('courses')
  async getCourses(@Query('department') deptSlug?: string) {
    return this.roadmapService.listCourses(deptSlug);
  }

  // --- Roadmaps ---
  @Post('master')
  @UsePipes(new ZodValidationPipe(CreateRoadmapSchema))
  async createMasterRoadmap(@Body() body: CreateRoadmapDTO) {
    return this.roadmapService.createRoadmap(body);
  }

  @Get(':slug')
  async getRoadmap(@Param('slug') slug: string) {
    return this.roadmapService.getRoadmapBySlug(slug);
  }
}