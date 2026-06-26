import type { DunetaServerConfig } from '@duneta/server/configs';
import type { DeepPartial } from './merge';
import type { DunetaWebConfig } from './types';

const WEB_KEYS = ['app', 'api', 'theme', 'router'] as const satisfies readonly (keyof DunetaWebConfig)[];

const SERVER_KEYS = [
  'runtime',
  'app',
  'database',
  'auth',
  'locale',
  'timezone',
  'request',
  'headers',
  'cache',
  'security',
  'logging',
  'debug',
] as const;

/** Unified duneta.config.ts — web + API sections in one object. */
export type DunetaConfig = DeepPartial<DunetaWebConfig> & DeepPartial<DunetaServerConfig>;

export function defineDunetaConfig<const T extends DunetaConfig>(config?: T): T {
  return (config ?? {}) as T;
}

function pickKeys<T extends object, const K extends readonly (keyof T)[]>(
  source: DunetaConfig,
  keys: K,
): DeepPartial<T> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    const value = source[key as keyof DunetaConfig];
    if (value !== undefined) result[key as string] = value;
  }
  return result as DeepPartial<T>;
}

export function toWebConfig(config: DunetaConfig): DeepPartial<DunetaWebConfig> {
  return pickKeys<DunetaWebConfig, typeof WEB_KEYS>(config, WEB_KEYS);
}

export function toServerConfig(config: DunetaConfig): DeepPartial<DunetaServerConfig> {
  return pickKeys<DunetaServerConfig, typeof SERVER_KEYS>(config, SERVER_KEYS);
}
