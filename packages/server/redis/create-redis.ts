import type { RedisConfig } from '../configs/types.js';

/** Placeholder client — replace with ioredis/node-redis when wired. */
export type RedisClient = {
  enabled: true;
  ping: () => Promise<string>;
};

export function createRedis(config: RedisConfig): RedisClient | null {
  if (config.enabled !== true) return null;

  return {
    enabled: true,
    ping: async () => 'PONG',
  };
}
