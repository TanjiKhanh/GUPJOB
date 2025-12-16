import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateRoadmapDTO } from '../dto/roadmap.dto';

@Injectable()
export class RoadmapRepository {
  private readonly logger = new Logger(RoadmapRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  // Renamed from createMasterRoadmap to match Service call
  async createWithNodesAndEdges(dto: CreateRoadmapDTO) {
    return this.prisma.$transaction(async (tx) => {
      // Use slug provided by DTO (Service should handle logic, or default here)
      const slug = dto.slug; 
      
      const roadmap = await tx.roadmap.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          courseId: dto.courseId,
          structure: dto.structure ?? Prisma.DbNull,
        },
      });

      if (dto.nodes && dto.nodes.length > 0) {
        const nodeData = dto.nodes.map((n) => ({
          roadmapId: roadmap.id,
          nodeKey: n.nodeKey,
          title: n.title,
          contentMd: n.contentMd,
          isRequired: n.isRequired ?? true,
          coords: n.coords ? JSON.stringify(n.coords) : Prisma.DbNull, // Ensure JSON compatibility
        }));
        await tx.roadmapNode.createMany({ data: nodeData });
      }

      if (dto.edges && dto.edges.length > 0) {
        const edgeData = dto.edges.map((e) => ({
          roadmapId: roadmap.id,
          sourceKey: e.sourceKey,
          targetKey: e.targetKey,
        }));
        await tx.roadmapEdge.createMany({ data: edgeData });
      }

      return roadmap;
    });
  }

  // Renamed from getBySlug to match Service call
  async getBySlugWithNodesEdges(slug: string) {
    return this.prisma.roadmap.findUnique({
      where: { slug },
      include: {
        nodes: { orderBy: { id: 'asc' } },
        edges: { orderBy: { id: 'asc' } },
        course: { include: { department: true } },
      },
    });
  }
}