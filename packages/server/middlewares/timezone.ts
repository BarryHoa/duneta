import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import type { TenoraServerConfig } from '../configs/types.js';
import type { BackendEnv } from './env.js';

function isValidTimezone(value: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function resolveTimezone(
  value: string | undefined,
  fallback: string,
  supported: string[],
) {
  if (!value) return fallback;
  if (!isValidTimezone(value)) return fallback;
  if (supported.length === 0 || supported.includes(value)) return value;
  return fallback;
}

export function createTimezoneMiddleware(config: TenoraServerConfig) {
  const { timezone } = config;
  const { resolve } = timezone;

  return createMiddleware<BackendEnv>(async (c, next) => {
    const fromQuery = resolve.query ? c.req.query(resolve.query) : undefined;
    const fromHeader = c.req.header(resolve.header);
    const fromCookie = resolve.cookie ? getCookie(c, resolve.cookie) : undefined;

    const resolved = resolveTimezone(
      fromQuery ?? fromHeader ?? fromCookie,
      timezone.default,
      timezone.supported,
    );

    c.set('timezone', resolved);
    c.header(resolve.header, resolved);
    await next();
  });
}
