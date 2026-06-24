import type {
  CacheConfig,
  CacheDriver,
  MemcachedStoreConfig,
  RedisStoreConfig,
} from '../configs/cache.js';
import { activeCacheStore, resolveRedisTransport } from '../configs/cache.js';
import type { CacheStore } from './types.js';
import { MemoryCacheStore } from './stores/memory.js';

async function redisHttpCommand(
  endpoint: string,
  token: string | undefined,
  command: (string | number)[],
): Promise<unknown> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Redis HTTP request failed: ${response.status}`);
  }

  const body = (await response.json()) as { result?: unknown };
  return body.result;
}

function createRedisHttpStore(config: RedisStoreConfig): CacheStore {
  const endpoint = config.url;
  if (!endpoint) {
    throw new Error('Redis HTTP transport requires `stores.redis.url` (https://…).');
  }

  const token = config.token ?? config.password;

  return {
    get: async (key) => {
      const result = await redisHttpCommand(endpoint, token, ['GET', key]);
      return result === null ? null : String(result);
    },
    set: async (key, value, ttlMs) => {
      if (ttlMs) {
        await redisHttpCommand(endpoint, token, ['SET', key, value, 'PX', ttlMs]);
        return;
      }
      await redisHttpCommand(endpoint, token, ['SET', key, value]);
    },
    incr: async (key) => Number(await redisHttpCommand(endpoint, token, ['INCR', key])),
    expire: async (key, ttlMs) => {
      await redisHttpCommand(endpoint, token, ['PEXPIRE', key, ttlMs]);
    },
  };
}

function createRedisTcpStore(_config: RedisStoreConfig): CacheStore {
  throw new Error(
    'Redis TCP is not wired yet. Use an HTTP `url` on Workers, or `driver: "memory"` locally.',
  );
}

function createRedisStore(config: RedisStoreConfig): CacheStore {
  return resolveRedisTransport(config) === 'http'
    ? createRedisHttpStore(config)
    : createRedisTcpStore(config);
}

function createMemcachedStore(_config: MemcachedStoreConfig): CacheStore {
  throw new Error('Memcached is not wired yet. Use `driver: "redis"` or `driver: "memory"`.');
}

const storeFactories: Record<
  CacheDriver,
  (config: CacheConfig) => CacheStore
> = {
  memory: () => new MemoryCacheStore(),
  redis: (config) => createRedisStore(activeCacheStore(config, 'redis') as RedisStoreConfig),
  memcached: (config) =>
    createMemcachedStore(activeCacheStore(config, 'memcached') as MemcachedStoreConfig),
};

export function isDistributedCache(driver: CacheDriver, config: CacheConfig): boolean {
  if (driver === 'memory') return false;
  if (driver === 'redis') {
    return resolveRedisTransport(activeCacheStore(config, 'redis') as RedisStoreConfig) === 'http';
  }
  return true;
}

export function createCacheStore(config: CacheConfig): CacheStore {
  return storeFactories[config.driver](config);
}
