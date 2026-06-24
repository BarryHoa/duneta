import { connectionUrl } from '../configs/database.js';
import type { TenoraServerConfig } from '../configs/types.js';
import { isHyperdriveBinding, type RuntimeBindings } from '../runtime/shared/bindings.js';

/** Resolve Postgres URL: Hyperdrive binding → worker env → config. */
export function resolveDatabaseUrl(
  config: TenoraServerConfig,
  bindings?: RuntimeBindings,
): string | null {
  const hyperdrive = bindings?.HYPERDRIVE;
  if (isHyperdriveBinding(hyperdrive)) {
    return hyperdrive.connectionString;
  }

  const bindingUrl = bindings?.DATABASE_URL;
  if (typeof bindingUrl === 'string' && bindingUrl.length > 0) {
    return bindingUrl;
  }

  return connectionUrl(config.database) ?? null;
}
