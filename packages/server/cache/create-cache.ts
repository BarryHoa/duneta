import type { CacheConfig, CacheProvider } from '../configs/types.js';

/** Placeholder client — replace with ioredis/node-redis when wired. */
export type CacheClient = {
  enabled: true;
  provider: CacheProvider;
  ping: () => Promise<string>;
};

export function createCache(config: CacheConfig): CacheClient | null {
  if (config.enabled !== true) return null;

  return {
    enabled: true,
    provider: config.provider,
    ping: async () => 'PONG',
  };
}
