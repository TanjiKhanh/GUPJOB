import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthClientService {
  // Matches docker-compose service name
  private readonly baseUrl = process.env.AUTH_SERVICE_URL || 'http://auth:3000';

  async getUserProfile(userId: number) {
    try {
      // 📞 CALL AUTH: GET /users/{id}
      const { data } = await axios.get(`${this.baseUrl}/users/${userId}`);
      return data; // Returns { id, jobPriority, departmentId, ... }
    } catch (error) {
      throw new HttpException('Failed to reach Auth Service', 503);
    }
  }
}