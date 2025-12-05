import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Auth service running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
