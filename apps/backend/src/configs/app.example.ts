import { AppConfigSchema } from '@/constants/AppConfigSchema';
import z from 'zod';

export const APP_CONFIG: z.infer<typeof AppConfigSchema> = {
  POSTGRES_DB: '...',
  POSTGRES_USER: '...',
  POSTGRES_PASSWORD: '...',
  FRONTEND_URL: 'http://localhost:5173',
};
