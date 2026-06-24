import { DEFAULT_DATABASE_POOL } from './database';
import type { TenoraServerConfig } from './types';

export const DEFAULT_CONFIG_APP_PORT = 3001;
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

/** Minimal defaults — opt in to database, auth, redis, and other features in `tenora.config.ts`. */
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
    database: {
      enabled: false,
      default: 'primary',
      connections: {},
      pool: { ...DEFAULT_DATABASE_POOL },
    },
    auth: {
      enabled: false,
      driver: 'better-auth',
      secret: '',
      baseUrl: `http://localhost:${port}`,
      basePath: '/api/auth',
      sessionCookieName: 'session_token',
      emailAndPassword: { enabled: true },
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
        maxAge: { default: 3 * 24 * 60 * 60, rememberMe: 30 * 24 * 60 * 60 },
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
      retry: { maxAttempts: 3, delayMs: 1000, backoffMultiplier: 2 },
      connectionTimeout: 5000,
      commandTimeout: 3000,
    },
    rateLimit: {
      enabled: false,
      auth: { max: 5, windowMs: 15 * 60 * 1000 },
      api: { max: 100, windowMs: 60 * 1000 },
    },
    log: {
      enabled: false,
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
      webhook: { url: '', headers: { 'Content-Type': 'application/json' } },
    },
    csrf: {
      enabled: false,
      secret: '',
      tokenLength: 32,
      expirationMs: 24 * 60 * 60 * 1000,
    },
    debug: { enabled: false, logLevel: 'debug' },
  };
}
