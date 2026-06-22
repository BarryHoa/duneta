import { z } from 'zod';

const envSchema = z.object({ DATABASE_URL: z.string().url().optional() });
const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };

export const env = envSchema.parse({ DATABASE_URL: runtime.process?.env?.DATABASE_URL });
