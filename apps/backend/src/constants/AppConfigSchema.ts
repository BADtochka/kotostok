import z from 'zod';

export const AppConfigSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string().default('localhost').optional(),
  POSTGRES_PORT: z.string().default('5432').optional(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  FRONTEND_URL: z.url(),
});
