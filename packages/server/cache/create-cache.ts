import type { CacheDriver, CacheConfig } from '../configs/cache.js';
import { createCacheStore, isDistributedCache } from './registry.js';
import type { CacheStore } from './types.js';

export type CacheClient = CacheStore & {
  enabled: true;
  driver: CacheDriver;
  distributed: boolean;
};

function toCacheClient(driver: CacheDriver, store: CacheStore, distributed: boolean): CacheClient {
  return {
    ...store,
    enabled: true,
    driver,
    distributed,
  };
}

export function createCache(config: CacheConfig): CacheClient | null {
  if (config.enabled !== true) return null;

  const store = createCacheStore(config);
  return toCacheClient(config.driver, store, isDistributedCache(config.driver, config));
}
