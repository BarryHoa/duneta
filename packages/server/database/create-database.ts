import { databasePoolForRuntime } from '../configs/database.js';
import { isDatabaseEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { RuntimeBindings } from '../runtime/shared/bindings.js';
import { createPgDatabase } from './create-pg-database.js';
import { resolveDatabaseUrl } from './resolve-url.js';
import type { Database } from './types.js';

export function createDatabase(
  config: TenoraServerConfig,
  bindings?: RuntimeBindings,
): Database | null {
  if (!isDatabaseEnabled(config)) return null;

  const url = resolveDatabaseUrl(config, bindings);
  if (!url) return null;

  const connection = config.database.connections[config.database.default];
  if (connection && connection.driver !== 'postgres') return null;

  const pool = databasePoolForRuntime(config.runtime.target, config.database.pool);
  return createPgDatabase(url, pool);
}
