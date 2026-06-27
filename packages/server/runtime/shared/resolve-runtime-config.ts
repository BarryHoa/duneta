import { mergeConfig, type DeepPartial } from '../../configs/merge.js';
import type { DunetaServerConfig, NodeEnv } from '../../configs/types.js';
import type { PlatformEnv } from './platform-env.js';

function bindingString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isProductionEnv(config: DunetaServerConfig, nodeEnv?: string): boolean {
  return nodeEnv === 'production' || config.app.env === 'production';
}

function resolveCsrfSecret(platform: PlatformEnv, authSecret?: string): string | undefined {
  return bindingString(platform.CSRF_SECRET) ?? authSecret;
}

function resolveLoggingPatch(
  config: DunetaServerConfig,
  platform: PlatformEnv,
  isProduction: boolean,
): DeepPartial<DunetaServerConfig> | undefined {
  const flag = bindingString(platform.LOGGING_ENABLED);
  if (flag === 'true') return { logging: { enabled: true, format: 'json' } };
  if (flag === 'false') return { logging: { enabled: false } };

  if (isProduction && config.logging?.enabled !== false) {
    return {
      logging: {
        enabled: config.logging?.enabled ?? true,
        format: config.logging?.format ?? 'json',
      },
    };
  }

  return undefined;
}

function resolveCachePatch(
  config: DunetaServerConfig,
  platform: PlatformEnv,
): DeepPartial<DunetaServerConfig> | undefined {
  const cacheUrl = bindingString(platform.CACHE_URL);
  const cacheToken = bindingString(platform.CACHE_TOKEN);
  if (!cacheUrl && !cacheToken) return undefined;

  const existing = config.cache;
  if (existing?.enabled === true && existing.driver === 'redis') {
    return {
      cache: {
        enabled: true,
        driver: 'redis',
        store: {
          ...existing.store,
          ...(cacheUrl ? { url: cacheUrl } : {}),
          ...(cacheToken ? { token: cacheToken } : {}),
        },
      },
    };
  }

  if (cacheUrl) {
    return {
      cache: {
        enabled: true,
        driver: 'redis',
        store: {
          url: cacheUrl,
          ...(cacheToken ? { token: cacheToken } : {}),
        },
      },
    };
  }

  return undefined;
}

/** Merge wrangler secrets/vars into static `duneta.config` at request time. */
export function resolveRuntimeConfig(
  config: DunetaServerConfig,
  platform?: PlatformEnv,
): DunetaServerConfig {
  if (!platform) return config;

  const patch: DeepPartial<DunetaServerConfig> = {};
  const nodeEnv = bindingString(platform.NODE_ENV);
  const isProduction = isProductionEnv(config, nodeEnv);

  if (nodeEnv) {
    patch.app = { env: nodeEnv as NodeEnv };
  }

  const authSecret = bindingString(platform.AUTH_SECRET);
  const authBaseUrl = bindingString(platform.AUTH_BASE_URL);

  if (authSecret || authBaseUrl || isProduction) {
    patch.auth = {
      ...(authSecret ? { secret: authSecret } : {}),
      ...(authBaseUrl ? { baseUrl: authBaseUrl } : {}),
      ...(isProduction
        ? {
            session: {
              cookie: { secure: true },
            },
          }
        : {}),
    };
  }

  const csrfSecret = resolveCsrfSecret(platform, authSecret);
  if (config.security?.csrf?.enabled === true && csrfSecret) {
    patch.security = {
      ...patch.security,
      csrf: { secret: csrfSecret },
    };
  }

  const loggingPatch = resolveLoggingPatch(config, platform, isProduction);
  if (loggingPatch) Object.assign(patch, loggingPatch);

  const cachePatch = resolveCachePatch(config, platform);
  if (cachePatch) Object.assign(patch, cachePatch);

  return mergeConfig(config, patch);
}
