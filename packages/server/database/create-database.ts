import { isWorkerRuntime } from '../configs/features.js';
import type { TenoraServerConfig } from '../configs/types.js';
import type { RuntimeBindings } from '../runtime/bindings.js';
import { createNodeDatabase } from './create-node-database.js';
import { createWorkerDatabase } from './create-worker-database.js';
import type { Database } from './types.js';

export function createDatabase(
  config: TenoraServerConfig,
  bindings?: RuntimeBindings,
): Database | null {
  if (isWorkerRuntime(config)) {
    return createWorkerDatabase(config, bindings);
  }
  return createNodeDatabase(config, bindings);
}
