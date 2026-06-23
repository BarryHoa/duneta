import { DEFAULT_DATABASE_POOL } from './database';
import type { TenoraServerConfig } from './types';

export const DEFAULT_CONFIG_APP_PORT = 3001;
export const DEFAULT_CONFIG_WEB_PORT = 3000;
export const DEFAULT_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/tenora';
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

/** Full default `TenoraServerConfig` — merged with `tenora.config.ts` at boot. */
export function createDefaultConfig(): TenoraServerConfig {
  const port = DEFAULT_CONFIG_APP_PORT;

  return {
    runtime: { target: 'node' },
    app: {
      name: 'tenora-api',
      env: 'development',
      port,
      debug: true,
    },
    auth: {
      driver: 'better-auth',
      secret: 'dev-only-change-me',
      baseUrl: `http://localhost:${port}`,
      basePath: '/api/auth',
      sessionCookieName: 'session_token',
      emailAndPassword: { enabled: true },
    },
    database: {
      default: 'primary',
      connections: {
        primary: {
          driver: 'postgres',
          url: DEFAULT_DATABASE_URL,
        },
      },
      pool: { ...DEFAULT_DATABASE_POOL },
    },
    session: {
      expiration: {
        default: 3 * 24 * 60 * 60 * 1000,
        rememberMe: 30 * 24 * 60 * 60 * 1000,
      },
      cookie: {
        name: 'session_token',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: {
          default: 3 * 24 * 60 * 60,
          rememberMe: 30 * 24 * 60 * 60,
        },
      },
    },
    system: {
      defaultTimezone: DEFAULT_TIMEZONE,
      timezone: DEFAULT_TIMEZONE,
    },
    redis: {
      enabled: false,
      host: 'localhost',
      port: 6379,
      db: 0,
      retry: {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
      },
      connectionTimeout: 5000,
      commandTimeout: 3000,
    },
    rateLimit: {
      auth: { max: 5, windowMs: 15 * 60 * 1000 },
      api: { max: 100, windowMs: 60 * 1000 },
    },
    log: {
      enabled: true,
      destination: 'file',
      file: {
        directory: 'log',
        maxSizeBytes: 5 * 1024 * 1024,
        compression: {
          enabled: true,
          compressAfterDays: 30,
          format: 'gzip',
          deleteOriginal: true,
        },
      },
      webhook: {
        url: '',
        headers: { 'Content-Type': 'application/json' },
      },
    },
    csrf: {
      secret: 'csrf-secret-key-change-in-production',
      tokenLength: 32,
      expirationMs: 24 * 60 * 60 * 1000,
    },
    debug: {
      enabled: false,
      logLevel: 'debug',
    },
  };
}
