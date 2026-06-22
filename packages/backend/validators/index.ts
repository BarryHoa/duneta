import { z } from 'zod';

export const healthResponseSchema = z.object({ ok: z.literal(true), message: z.string() });
