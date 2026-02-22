import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { APP_CONFIG } from './configs/app';
import { isDev } from './constants/isDev';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: isDev ? '*' : APP_CONFIG.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  logger.log(`App running on ${APP_CONFIG.HTTP_PORT}`);
  await app.listen(APP_CONFIG.HTTP_PORT!);
}
bootstrap();
