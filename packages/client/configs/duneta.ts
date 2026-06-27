import type { DunetaServerConfig } from '@duneta/server/configs';
import type { DeepPartial } from './merge';
import type { DunetaWebConfig } from './types';

export const CLIENT_CONFIG_FILENAME = 'duneta.client.config.ts';
export const SERVER_CONFIG_FILENAME = 'duneta.server.config.ts';

const WEB_KEYS = ['app', 'api', 'theme', 'router'] as const satisfies readonly (keyof DunetaWebConfig)[];

/** Web sections — `duneta.client.config.ts` (Vite / React Router only). */
export type DunetaClientConfig = DeepPartial<DunetaWebConfig>;

/** API sections — `duneta.server.config.ts` (Worker only). */
export type DunetaServerConfigFile = DeepPartial<DunetaServerConfig>;

export function defineClientConfig<const T extends DunetaClientConfig>(config?: T): T {
  return (config ?? {}) as T;
}

export function defineServerConfig<const T extends DunetaServerConfigFile>(config?: T): T {
  return (config ?? {}) as T;
}

function pickKeys<T extends object, const K extends readonly (keyof T)[]>(
  source: Record<string, unknown>,
  keys: K,
): DeepPartial<T> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    const value = source[key as string];
    if (value !== undefined) result[key as string] = value;
  }
  return result as DeepPartial<T>;
}

export function toWebConfig(config: DunetaClientConfig): DeepPartial<DunetaWebConfig> {
  return pickKeys<DunetaWebConfig, typeof WEB_KEYS>(config, WEB_KEYS);
}
