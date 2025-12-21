import { IsEmail, IsString, MinLength, IsOptional, IsIn, IsInt, IsArray } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, {message: 'Invalid email format'})
  email: string;

  @IsString()
  @MinLength(6 , {message: 'Password must be at least 6 characters long'})
  password: string;

  @IsString( {message: 'Name must be a string'})
  name?: string;

  @IsIn(['STUDENT', 'MENTOR', 'COMPANY', 'ADMIN'] , {message: 'Role must be one of STUDENT, MENTOR, COMPANY, ADMIN'})
  role?: string;

  @IsOptional()
  @IsString({message: 'Department Slug must be a string'})
  departmentSlug?: string;

  @IsOptional()
  @IsString({message: 'Job Priority must be a string'})
  jobPriority?: string;

  // --- Profile / Onboarding Fields (Step 3, 4, 5) ---
  // Cần thêm các trường này để Backend không bỏ qua dữ liệu từ Frontend
  @IsOptional()
  @IsString()
  currentSituation?: string;

  @IsOptional()
  @IsArray()
  careerGoals?: string[];

  @IsOptional()
  @IsArray()
  interests?: string[];

  @IsOptional()
  @IsString()
  primaryGoalNextYear?: string;
}