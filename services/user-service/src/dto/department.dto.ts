import { z } from "zod";


/**
 * Department DTOs
 */
export const CreateDepartmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional()
});

export type CreateDepartmentDTO = z.infer<typeof CreateDepartmentSchema>;

/**
 * Course DTOs
 */
export const CreateCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["BASIC", "JOB"]).optional().default("JOB"),
  departmentId: z.number().int().positive().optional(),
  structure: z.any().optional()
});

export type CreateCourseDTO = z.infer<typeof CreateCourseSchema>;

/**
 * Query schema for GET /api/courses?department=it
 */
export const GetCoursesQuerySchema = z.object({
  department: z.string().optional()
});

export type GetCoursesQueryDTO = z.infer<typeof GetCoursesQuerySchema>;