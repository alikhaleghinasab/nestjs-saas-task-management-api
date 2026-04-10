import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(fastifyMultipart);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.APP_PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
