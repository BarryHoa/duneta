import { connectionUrl } from '../configs/database.js';
import type { DunetaServerConfig } from '../configs/types.js';
import { isHyperdriveBinding, type PlatformEnv } from '../runtime/shared/platform-env.js';

/** Resolve Postgres URL: Hyperdrive binding → worker env → config. */
export function resolveDatabaseUrl(
  config: DunetaServerConfig,
  platform?: PlatformEnv,
): string | null {
  const hyperdrive = platform?.HYPERDRIVE;
  if (isHyperdriveBinding(hyperdrive)) {
    return hyperdrive.connectionString;
  }

  const bindingUrl = platform?.DATABASE_URL;
  if (typeof bindingUrl === 'string' && bindingUrl.length > 0) {
    return bindingUrl;
  }

  return connectionUrl(config.database) ?? null;
}
