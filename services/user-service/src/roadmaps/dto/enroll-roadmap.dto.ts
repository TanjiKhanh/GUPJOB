import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollRoadmapDto {
  @IsString()
  @IsNotEmpty()
  slug: string; // The specific roadmap (e.g., "frontend-developer")
}