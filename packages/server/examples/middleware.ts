import { createMiddleware } from 'hono/factory';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from '../middlewares/env.js';
import { createLocaleMiddleware } from '../middlewares/locale.js';
import { createTimezoneMiddleware } from '../middlewares/timezone.js';

/** Locale + timezone — applied on every request. */
export function createRequestContextMiddleware(config: TenoraServerConfig) {
  const localeMw = createLocaleMiddleware(config);
  const timezoneMw = createTimezoneMiddleware(config);

  return createMiddleware<BackendEnv>(async (c, next) => {
    await localeMw(c, async () => {
      await timezoneMw(c, next);
    });
  });
}
