export type CacheDriver = 'memory' | 'redis' | 'memcached';

/** @deprecated Use `CacheDriver` */
export type CacheProvider = CacheDriver;

export type CacheTransport = 'tcp' | 'http';

export type CacheRetryConfig = {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
};

export type CacheTimeoutConfig = {
  connectionTimeout: number;
  commandTimeout: number;
};

export const DEFAULT_CACHE_RETRY: CacheRetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export const DEFAULT_CACHE_TIMEOUT: CacheTimeoutConfig = {
  connectionTimeout: 5000,
  commandTimeout: 3000,
};

export type MemoryStoreConfig = Record<string, never>;

export type RedisStoreConfig = CacheTimeoutConfig & {
  driver: 'redis';
  /** `redis://` / `rediss://` (TCP) or `https://` (HTTP command API). */
  url?: string;
  transport?: CacheTransport;
  host?: string;
  port?: number;
  password?: string;
  /** Bearer token for HTTP transport (falls back to `password`). */
  token?: string;
  db?: number;
  retry?: Partial<CacheRetryConfig>;
};

export type MemcachedStoreConfig = CacheTimeoutConfig & {
  driver: 'memcached';
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  retry?: Partial<CacheRetryConfig>;
};

export type CacheStoreConfig = MemoryStoreConfig | RedisStoreConfig | MemcachedStoreConfig;

export type CacheConfig<
  TStores extends Partial<Record<CacheDriver, CacheStoreConfig>> = Partial<
    Record<CacheDriver, CacheStoreConfig>
  >,
> = {
  enabled?: boolean;
  driver: CacheDriver;
  stores: TStores;
};

export function memoryStore(): MemoryStoreConfig {
  return {};
}

export function redisStore(
  options: Partial<Omit<RedisStoreConfig, 'driver' | 'retry'>> & {
    retry?: Partial<CacheRetryConfig>;
  } = {},
): RedisStoreConfig {
  return {
    driver: 'redis',
    host: 'localhost',
    port: 6379,
    db: 0,
    retry: { ...DEFAULT_CACHE_RETRY, ...options.retry },
    ...DEFAULT_CACHE_TIMEOUT,
    ...options,
  };
}

export function memcachedStore(
  options: Partial<Omit<MemcachedStoreConfig, 'driver' | 'retry'>> & {
    retry?: Partial<CacheRetryConfig>;
  } = {},
): MemcachedStoreConfig {
  return {
    driver: 'memcached',
    host: 'localhost',
    port: 11211,
    retry: { ...DEFAULT_CACHE_RETRY, ...options.retry },
    ...DEFAULT_CACHE_TIMEOUT,
    ...options,
  };
}

export function defineCacheStores<
  const T extends Partial<Record<CacheDriver, CacheStoreConfig | undefined>>,
>(stores: T) {
  const resolved = {} as {
    [K in keyof T as T[K] extends CacheStoreConfig ? K : never]: NonNullable<T[K]>;
  };

  for (const [name, store] of Object.entries(stores)) {
    if (store) Object.assign(resolved, { [name]: store });
  }

  return resolved;
}

export function activeCacheStore<T extends CacheDriver>(
  config: CacheConfig,
  driver: T = config.driver as T,
): Extract<CacheStoreConfig, { driver: T }> | MemoryStoreConfig {
  const store = config.stores[driver];
  if (!store) {
    throw new Error(`Cache driver "${driver}" is not configured in cache.stores.`);
  }
  return store as Extract<CacheStoreConfig, { driver: T }>;
}

export function resolveRedisTransport(config: RedisStoreConfig): CacheTransport {
  if (config.transport) return config.transport;

  const url = config.url?.trim();
  if (url?.startsWith('http://') || url?.startsWith('https://')) return 'http';
  if (url?.startsWith('redis://') || url?.startsWith('rediss://')) return 'tcp';

  return 'tcp';
}
