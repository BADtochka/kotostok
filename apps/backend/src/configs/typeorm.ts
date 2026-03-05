import { isDev } from '@/constants/isDev';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
  autoLoadEntities: true,
  logging: isDev,
};
