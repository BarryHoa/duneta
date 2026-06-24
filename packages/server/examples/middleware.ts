import { createMiddleware } from 'hono/factory';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from '../middlewares/env.js';
import { createLocaleMiddleware } from '../middlewares/locale.js';
import { createRequestIdMiddleware } from '../middlewares/request-id.js';
import { createSecurityHeadersMiddleware } from '../middlewares/security-headers.js';
import { createTimezoneMiddleware } from '../middlewares/timezone.js';

/** Core middleware applied on every request. */
export function createCoreMiddleware(config: TenoraServerConfig) {
  const requestIdMw = createRequestIdMiddleware(config);
  const securityHeadersMw = createSecurityHeadersMiddleware(config);
  const localeMw = createLocaleMiddleware(config);
  const timezoneMw = createTimezoneMiddleware(config);

  return createMiddleware<BackendEnv>(async (c, next) => {
    await requestIdMw(c, async () => {
      await securityHeadersMw(c, async () => {
        await localeMw(c, async () => {
          await timezoneMw(c, next);
        });
      });
    });
  });
}

/** @deprecated Use `createCoreMiddleware` */
export const createRequestContextMiddleware = createCoreMiddleware;
