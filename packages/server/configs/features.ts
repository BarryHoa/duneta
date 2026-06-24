import { connectionUrl } from './database.js';
import type { TenoraServerConfig } from './types.js';

export function isDatabaseEnabled(config: TenoraServerConfig): boolean {
  if (config.database?.enabled !== true) return false;
  const url = connectionUrl(config.database);
  return Boolean(url);
}

export function isAuthEnabled(config: TenoraServerConfig): boolean {
  if (config.auth?.enabled !== true) return false;
  if (!isDatabaseEnabled(config)) return false;
  return Boolean(config.auth.secret);
}

export function isRedisEnabled(config: TenoraServerConfig): boolean {
  return config.redis?.enabled === true;
}

export function isRateLimitEnabled(config: TenoraServerConfig): boolean {
  return config.rateLimit?.enabled === true;
}

export function isCsrfEnabled(config: TenoraServerConfig): boolean {
  return config.csrf?.enabled === true;
}

export function isLogEnabled(config: TenoraServerConfig): boolean {
  return config.log?.enabled === true;
}
