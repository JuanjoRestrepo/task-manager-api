import { z } from 'zod';

// 🔐 Esquema de variables de entorno
const envSchema = z.object({
  NODE_ENV: z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    const normalized = val.trim().toLowerCase();
    if (normalized === 'prod') return 'production';
    if (normalized === 'dev') return 'development';
    if (normalized === 'testing') return 'test';
    return normalized;
  }, z.enum(['development', 'test', 'production']).default('development')),

  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10)),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(10),

  BASE_URL: z.string().url().optional(),
});

// 🔍 Validación
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1); // 🔥 falla la app si hay error
}

export const env = parsed.data;
