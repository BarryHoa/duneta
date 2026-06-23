import type { DatabaseConfig } from './database';

export type Runtime = 'node' | 'worker';
export type NodeEnv = 'development' | 'production' | 'test';

export type RuntimeConfig = {
  target: Runtime;
};

export type AppConfig = {
  name: string;
  env: NodeEnv;
  port: number;
  debug: boolean;
};

/** Default auth driver: [Better Auth](https://better-auth.com/docs/introduction) */
export type BetterAuthConfig = {
  driver: 'better-auth';
  secret: string;
  baseUrl: string;
  basePath: string;
  sessionCookieName: string;
  emailAndPassword: {
    enabled: boolean;
  };
};

export type AuthConfig = BetterAuthConfig;

export type SessionConfig = {
  expiration: {
    default: number;
    rememberMe: number;
  };
  cookie: {
    name: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: {
      default: number;
      rememberMe: number;
    };
  };
};

export type SystemConfig = {
  defaultTimezone: string;
  timezone: string;
};

export type RedisConfig = {
  enabled: boolean;
  url?: string;
  host: string;
  port: number;
  password?: string;
  db: number;
  retry: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier: number;
  };
  connectionTimeout: number;
  commandTimeout: number;
};

export type RateLimitConfig = {
  auth: {
    max: number;
    windowMs: number;
  };
  api: {
    max: number;
    windowMs: number;
  };
};

export type LogConfig = {
  enabled: boolean;
  destination: 'file' | 'webhook';
  file: {
    directory: string;
    maxSizeBytes: number;
    compression: {
      enabled: boolean;
      compressAfterDays: number;
      format: 'gzip' | 'zip';
      deleteOriginal: boolean;
    };
  };
  webhook: {
    url: string;
    headers: Record<string, string>;
  };
};

export type CsrfConfig = {
  secret: string;
  tokenLength: number;
  expirationMs: number;
};

export type DebugConfig = {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
};

/** Built-in config sections shipped by `@tenora/server`. */
export interface TenoraCoreConfig {
  runtime: RuntimeConfig;
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  session: SessionConfig;
  system: SystemConfig;
  redis: RedisConfig;
  rateLimit: RateLimitConfig;
  log: LogConfig;
  csrf: CsrfConfig;
  debug: DebugConfig;
}

export type TenoraCoreConfigKey = keyof TenoraCoreConfig;

/**
 * Full server config = core sections + optional app-specific extensions.
 *
 * @example
 * type HrmConfig = TenoraServerConfig<{ hrm: HrmModuleConfig }>;
 */
export type TenoraServerConfig<
  TExtra extends Record<string, unknown> = {},
  TDatabase extends DatabaseConfig = DatabaseConfig,
> = Omit<TenoraCoreConfig, 'database'> & {
  database: TDatabase;
} & TExtra;
