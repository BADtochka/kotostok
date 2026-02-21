import { AppConfigSchema } from '@/constants/AppConfigSchema';
import z from 'zod';

export const APP_CONFIG: z.infer<typeof AppConfigSchema> = {
  POSTGRES_DB: 'postgres',
  POSTGRES_USER: 'dev',
  POSTGRES_PASSWORD: 'dev',
  FRONTEND_URL: 'http://localhost:5173',
};
