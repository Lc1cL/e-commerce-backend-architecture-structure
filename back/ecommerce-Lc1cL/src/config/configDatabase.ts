import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: '.development.env' });

const DB_URL = process.env.DB_URL;
const configDatabase = DB_URL
  ? {
      type: 'postgres',
      url: DB_URL,
      synchronize: true,
      logging: false,
      dropSchema: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.js,.ts}'],
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        poolSize: 50,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
      retryAttempts: 3,
      retryDelay: 3000,
    }
  : {
      type: 'postgres',
      database: process.env.DB_NAME,
      // host: process.env.DB_HOST,
      host: 'postgresdb',
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      logging: false,
      dropSchema: false,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.js,.ts}'],
    };

export default registerAs('typeorm', () => configDatabase);
export const connectionSource = new DataSource(
  configDatabase as DataSourceOptions,
);
