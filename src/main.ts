import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
import { SwaggerHelper } from '@common/swagger/swagger.helper';
import { config as dotenvConfig } from 'dotenv';
import fastifyCookie from '@fastify/cookie';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { API_GLOBAL_PREFIX } from '@common/constants/api.constants';

dotenvConfig({ path: '.env' });
async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(fastifyMultipart);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerHelper = new SwaggerHelper();
  swaggerHelper.setup(app);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
