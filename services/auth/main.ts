import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './src/filter/prisma-exception.filter';
import { AllExceptionsFilter } from './src/filter/all-exceptions.filter';
import { ResponseInterceptor } from './src/filter/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new PrismaClientExceptionFilter(), new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Auth service listening on ${port}`);
}
bootstrap();