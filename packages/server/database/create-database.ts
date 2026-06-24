import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { connectionUrl } from '../configs/database.js';
import { isDatabaseEnabled } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import * as schema from '../repositories/schemas/index.js';
import type { Database } from './types.js';

export function createDatabase(config: TenoraServerConfig): Database | null {
  if (!isDatabaseEnabled(config)) return null;

  const url = connectionUrl(config.database);
  const connection = config.database.connections[config.database.default];
  if (!url || !connection || connection.driver !== 'postgres') return null;

  const pool = new pg.Pool({
    connectionString: url,
    max: config.database.pool.max,
    idleTimeoutMillis: config.database.pool.idleTimeout * 1000,
    connectionTimeoutMillis: config.database.pool.connectTimeout * 1000,
  });

  return drizzle(pool, { schema });
}
