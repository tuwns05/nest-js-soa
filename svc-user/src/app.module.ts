import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createRequire } from 'node:module';
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
          trustedConnection: true,
          encrypt: false,
        },
      },
      autoLoadEntities: true,
      synchronize: false,
      connectionTimeout: 10000,
      retryAttempts: 2,
    }),
    UserModule,
  ],
})
export class AppModule {}
