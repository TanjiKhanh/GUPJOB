export class RegisterDto {
  email: string;
  password: string;
  name?: string;
  role?: string; // 'LEARNER' | 'MENTOR' | 'COMPANY' | 'ADMIN' - optional, defaults to LEARNER in service
}