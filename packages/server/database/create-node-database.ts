import { databasePoolForRuntime, type DatabasePoolConfig } from '../configs/database.js';
import { isDatabaseEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { RuntimeBindings } from '../runtime/bindings.js';
import { createPgDatabase } from './create-pg-database.js';
import { resolveDatabaseUrl } from './resolve-url.js';
import type { Database } from './types.js';

export function createNodeDatabase(
  config: TenoraServerConfig,
  bindings?: RuntimeBindings,
): Database | null {
  if (!isDatabaseEnabled(config)) return null;

  const url = resolveDatabaseUrl(config, bindings);
  if (!url) return null;

  const connection = config.database.connections[config.database.default];
  if (connection && connection.driver !== 'postgres') return null;

  const pool: DatabasePoolConfig = databasePoolForRuntime('node', config.database.pool);
  return createPgDatabase(url, pool);
}
