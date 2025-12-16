import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe (applies DTO validation rules)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      transform: true, // transform payloads to DTO classes / types
      forbidNonWhitelisted: false,
    }),
  );

  // Enable CORS for local dev; tighten for production
  app.enableCors();

  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
  console.log(`User (roadmap) service listening on port ${port}`);
}

bootstrap();