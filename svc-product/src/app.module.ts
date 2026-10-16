import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from '@soa/database';
import { AuthModule } from './auth/auth.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, ProductsModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
