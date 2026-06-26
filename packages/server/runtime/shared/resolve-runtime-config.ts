import { mergeConfig, type DeepPartial } from '../../configs/merge.js';
import type { DunetaServerConfig, NodeEnv } from '../../configs/types.js';
import type { PlatformEnv } from './platform-env.js';

function bindingString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Merge wrangler secrets/vars into static `duneta.config` at request time. */
export function resolveRuntimeConfig(
  config: DunetaServerConfig,
  platform?: PlatformEnv,
): DunetaServerConfig {
  if (!platform) return config;

  const patch: DeepPartial<DunetaServerConfig> = {};
  const nodeEnv = bindingString(platform.NODE_ENV);
  if (nodeEnv) {
    patch.app = { env: nodeEnv as NodeEnv };
  }

  const authSecret = bindingString(platform.AUTH_SECRET);
  const authBaseUrl = bindingString(platform.AUTH_BASE_URL);
  if (authSecret || authBaseUrl) {
    patch.auth = {
      ...(authSecret ? { secret: authSecret } : {}),
      ...(authBaseUrl ? { baseUrl: authBaseUrl } : {}),
    };
  }

  return mergeConfig(config, patch);
}
