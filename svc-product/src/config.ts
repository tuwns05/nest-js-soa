import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

// Each service runs in its own process and opens its own database pool.
process.env.DB_NAME ??= 'SOA_Product';

export const jwtSecret =
  process.env.JWT_SECRET ??
  '1b06cf8b17730a7a8c4e279c3eea613557e3cb5adecda9ee6e96107902dc6000';
