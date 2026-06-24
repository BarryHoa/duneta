import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { BackendEnv } from '../middlewares/index.js';

export abstract class BaseController {
  protected json<T>(c: Context<BackendEnv>, data: T, status: ContentfulStatusCode = 200) {
    return c.json(data, status);
  }

  protected notFound(c: Context<BackendEnv>, message = 'Not Found') {
    return c.json({ error: message }, 404);
  }
}
