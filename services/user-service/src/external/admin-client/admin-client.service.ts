import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AdminClientService {
  // Matches docker-compose service name
  private readonly baseUrl = process.env.ADMIN_SERVICE_URL || 'http://admin-service:4100';

  async getRoadmapSummary(slug: string) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/admin/roadmaps/${slug}/summary`);
      return data;
    } catch (error) {
      throw new HttpException('Failed to reach Admin Service', 503);
    }
  }

  async getRoadmapDetails(slug: string) {
    try {
      // We call the public endpoint we made earlier
      // minimal=false (default) means "Give me the nodes!"
      const { data } = await axios.get(`${this.baseUrl}/admin/roadmaps/${slug}`);
      return data;
    } catch (error) {
      console.error(`Error fetching roadmap details for ${slug}:`, error.message);
      throw new HttpException('Failed to reach Admin Service', 503);
    }
  }
}