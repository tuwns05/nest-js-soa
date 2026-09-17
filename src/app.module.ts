import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createRequire } from 'node:module';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserService } from './user/user.service.js';
import { UserController } from './user/user.controller.js';
import { UserModule } from './user/user.module.js';
const require = createRequire(import.meta.url);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      database: 'SOA_DATN',
      driver: require('mssql/msnodesqlv8'),
      extra: {
        driver: 'ODBC Driver 17 for SQL Server',
        options: {
          instanceName: 'VIETTUAN',
          trustedConnection: true, // Use the current Windows account.
          encrypt: false, // Local development only.
        },
      },
      autoLoadEntities: true,
      synchronize: false,
      connectionTimeout: 10000,
      retryAttempts: 2,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
