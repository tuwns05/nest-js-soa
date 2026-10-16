import './config.js';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { setupSwagger } from './swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3005);
  Logger.log(
    `Product API: http://localhost:${process.env.PORT ?? 3005}/api`,
    'Bootstrap',
  );
}
await bootstrap();
