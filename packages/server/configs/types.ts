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

/** How a request value is resolved: query → cookie → header. */
export type ContextResolveConfig = {
  header: string;
  cookie: string;
  query: string;
};

export type OAuthProviderConfig = {
  enabled?: boolean;
  clientId: string;
  clientSecret: string;
};

export type EmailProviderConfig = {
  enabled?: boolean;
  requireEmailVerification?: boolean;
  minPasswordLength?: number;
  disableSignUp?: boolean;
};

export type AuthProvidersConfig = {
  email: EmailProviderConfig;
  google?: OAuthProviderConfig;
  github?: OAuthProviderConfig;
};

export type AuthTokenStrategy = 'cookie' | 'bearer' | 'both';

export type AuthTokensConfig = {
  strategy: AuthTokenStrategy;
  bearer?: { enabled?: boolean };
  jwt?: {
    enabled?: boolean;
    expiresIn?: number;
  };
};

export type AuthSessionConfig = {
  /** Session lifetime in seconds. */
  expiresIn: number;
  rememberMeExpiresIn: number;
  cookie: {
    name: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
  };
  cookieCache?: {
    enabled?: boolean;
    maxAge?: number;
  };
};

/** Default auth driver: [Better Auth](https://better-auth.com/docs/introduction) */
export type BetterAuthConfig = {
  enabled?: boolean;
  driver: 'better-auth';
  secret: string;
  baseUrl: string;
  /** Path relative to `/api` mount (e.g. `/auth` → `/api/auth`). */
  basePath: string;
  providers: AuthProvidersConfig;
  tokens: AuthTokensConfig;
  session: AuthSessionConfig;
};

export type AuthConfig = BetterAuthConfig;

export type LocaleConfig = {
  default: string;
  supported: string[];
  resolve: ContextResolveConfig;
};

export type TimezoneConfig = {
  default: string;
  supported: string[];
  resolve: ContextResolveConfig;
};

export type CacheProvider = 'redis' | 'memory';

export type RedisCacheProviderConfig = {
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

export type CacheConfig = {
  enabled?: boolean;
  provider: CacheProvider;
  providers: {
    redis: RedisCacheProviderConfig;
  };
};

export type RateLimitConfig = {
  enabled?: boolean;
  api: {
    max: number;
    windowMs: number;
  };
  auth: {
    max: number;
    windowMs: number;
  };
};

export type CsrfConfig = {
  enabled?: boolean;
  secret: string;
  tokenLength: number;
  expirationMs: number;
};

export type SecurityConfig = {
  rateLimit: RateLimitConfig;
  csrf: CsrfConfig;
};

export type LoggingProvider = 'file' | 'webhook';

export type FileLoggingProviderConfig = {
  directory: string;
  maxSizeBytes: number;
  compression: {
    enabled: boolean;
    compressAfterDays: number;
    format: 'gzip' | 'zip';
    deleteOriginal: boolean;
  };
};

export type WebhookLoggingProviderConfig = {
  url: string;
  headers: Record<string, string>;
};

export type LoggingConfig = {
  enabled?: boolean;
  provider: LoggingProvider;
  providers: {
    file: FileLoggingProviderConfig;
    webhook: WebhookLoggingProviderConfig;
  };
};

export type DebugConfig = {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
};

/** Built-in config sections shipped by `@tenora/server`. */
export interface TenoraCoreConfig {
  runtime: RuntimeConfig;
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  locale: LocaleConfig;
  timezone: TimezoneConfig;
  cache: CacheConfig;
  security: SecurityConfig;
  logging: LoggingConfig;
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

/** @deprecated Use `TimezoneConfig` */
export type SystemConfig = TimezoneConfig;

/** @deprecated Use `CacheConfig` */
export type RedisConfig = CacheConfig;

/** @deprecated Use `LoggingConfig` */
export type LogConfig = LoggingConfig;
