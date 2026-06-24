import { z } from 'zod';
import type { Context } from 'hono';
import { BaseController } from '@tenora/server/http';
import type { BackendEnv } from '@tenora/server/middlewares';

const healthResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string(),
  locale: z.string(),
  timezone: z.string(),
});

export class HealthController extends BaseController {
  show = (c: Context<BackendEnv>) =>
    this.json(
      c,
      healthResponseSchema.parse({
        ok: true,
        message: 'Service is healthy',
        locale: this.locale(c),
        timezone: this.timezone(c),
      }),
    );
}
