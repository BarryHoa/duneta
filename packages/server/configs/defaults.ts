import { DEFAULT_DATABASE_POOL } from './database';
import { DEFAULT_RATE_LIMIT_RULES } from './rate-limit';
import type { TenoraServerConfig } from './types';

export const DEFAULT_CONFIG_APP_PORT = 3001;
export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

const THREE_DAYS = 60 * 60 * 24 * 3;
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Minimal defaults — opt in to features in `tenora.config.ts`. */
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
      basePath: '/auth',
      providers: {
        email: { enabled: true },
        google: { enabled: false, clientId: '', clientSecret: '' },
        github: { enabled: false, clientId: '', clientSecret: '' },
      },
      tokens: {
        strategy: 'cookie',
        bearer: { enabled: false },
        jwt: { enabled: false, expiresIn: 60 * 15 },
      },
      session: {
        expiresIn: THREE_DAYS,
        rememberMeExpiresIn: THIRTY_DAYS,
        cookie: {
          name: 'tenora_session',
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        },
        cookieCache: { enabled: true, maxAge: THREE_DAYS },
      },
    },

    locale: {
      default: 'vi',
      supported: ['vi', 'en'],
      resolve: {
        header: 'Accept-Language',
        cookie: 'tenora_locale',
        query: 'lang',
      },
    },

    timezone: {
      default: DEFAULT_TIMEZONE,
      supported: [DEFAULT_TIMEZONE, 'UTC', 'Asia/Bangkok'],
      resolve: {
        header: 'X-Tenora-Timezone',
        cookie: 'tenora_timezone',
        query: 'tz',
      },
    },

    request: {
      id: { header: 'X-Request-Id' },
    },

    headers: {
      frameOptions: 'DENY',
      contentTypeOptions: true,
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
    },

    cache: {
      enabled: false,
      driver: 'memory',
      stores: { memory: {} },
    },

    security: {
      rateLimit: {
        enabled: false,
        rules: DEFAULT_RATE_LIMIT_RULES,
      },
      csrf: {
        enabled: false,
        secret: '',
        cookie: 'tenora_csrf',
        header: 'X-CSRF-Token',
        tokenLength: 32,
        expirationMs: 24 * 60 * 60 * 1000,
        excludePaths: ['/auth'],
      },
      trustedProxies: ['127.0.0.1', '::1'],
    },

    logging: {
      enabled: false,
      provider: 'file',
      providers: {
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
    },

    debug: { enabled: false, logLevel: 'debug' },
  };
}
