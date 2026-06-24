import { connectionUrl } from './database.js';
import type { AuthProvidersConfig, TenoraServerConfig } from './types.js';

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

export function isCacheEnabled(config: TenoraServerConfig): boolean {
  return config.cache?.enabled === true;
}

export function isRateLimitEnabled(config: TenoraServerConfig): boolean {
  return config.security?.rateLimit?.enabled === true;
}

export function isCsrfEnabled(config: TenoraServerConfig): boolean {
  return config.security?.csrf?.enabled === true;
}

export function isLoggingEnabled(config: TenoraServerConfig): boolean {
  return config.logging?.enabled === true;
}

export function isBearerTokenEnabled(config: TenoraServerConfig): boolean {
  const { tokens } = config.auth;
  return (
    tokens.strategy === 'bearer' ||
    tokens.strategy === 'both' ||
    tokens.bearer?.enabled === true
  );
}

export function isJwtEnabled(config: TenoraServerConfig): boolean {
  return config.auth.tokens.jwt?.enabled === true;
}

const OAUTH_PROVIDER_KEYS = ['google', 'github'] as const;

export function buildSocialProviders(providers: AuthProvidersConfig) {
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  for (const key of OAUTH_PROVIDER_KEYS) {
    const provider = providers[key];
    if (!provider?.enabled || !provider.clientId || !provider.clientSecret) continue;
    socialProviders[key] = {
      clientId: provider.clientId,
      clientSecret: provider.clientSecret,
    };
  }

  return socialProviders;
}

export function resolveAuthBasePath(basePath: string) {
  if (basePath.startsWith('/api')) return basePath;
  return `/api${basePath.startsWith('/') ? basePath : `/${basePath}`}`;
}

export function resolveAuthMountPath(basePath: string) {
  return basePath.replace(/^\/api/, '') || '/auth';
}

/** @deprecated Use `isCacheEnabled` */
export const isRedisEnabled = isCacheEnabled;

/** @deprecated Use `isLoggingEnabled` */
export const isLogEnabled = isLoggingEnabled;
