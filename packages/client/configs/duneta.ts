import type { DunetaServerConfig } from '@duneta/server/configs';
import type { DeepPartial } from './merge';
import type { DunetaWebConfig } from './types';

export const CLIENT_CONFIG_FILENAME = 'duneta.client.config.ts';
export const SERVER_CONFIG_FILENAME = 'duneta.server.config.ts';

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
  'storage',
  'security',
  'logging',
  'debug',
] as const;

/** Web sections — `duneta.client.config.ts` (Vite / React Router only). */
export type DunetaClientConfig = DeepPartial<DunetaWebConfig>;

/** API sections — `duneta.server.config.ts` (Worker only). */
export type DunetaServerConfigFile = DeepPartial<DunetaServerConfig>;

/** @deprecated Use `defineClientConfig` + `defineServerConfig`. */
export type DunetaConfig = DunetaClientConfig & DunetaServerConfigFile;

export function defineClientConfig<const T extends DunetaClientConfig>(config?: T): T {
  return (config ?? {}) as T;
}

export function defineServerConfig<const T extends DunetaServerConfigFile>(config?: T): T {
  return (config ?? {}) as T;
}

/** @deprecated Use `defineClientConfig` or `defineServerConfig`. */
export function defineDunetaConfig<const T extends DunetaConfig>(config?: T): T {
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

export function toServerConfig(config: DunetaServerConfigFile): DeepPartial<DunetaServerConfig> {
  return pickKeys<DunetaServerConfig, typeof SERVER_KEYS>(config, SERVER_KEYS);
}

type ServerConfigModule = { default?: DunetaServerConfigFile };

function runtimeAppEnv(): 'development' | 'production' {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/** Fill `app.env` from `process.env.NODE_ENV` when omitted in `duneta.server.config.ts`. */
function applyRuntimeAppDefaults(
  patch: DeepPartial<DunetaServerConfig>,
): DeepPartial<DunetaServerConfig> {
  if (patch.app?.env !== undefined) return patch;
  return {
    ...patch,
    app: { ...patch.app, env: runtimeAppEnv() },
  };
}

/** Dynamic import `duneta.server.config.ts` in Worker — use with `defineServer({ loadConfig })`. */
export async function loadWorkerServerConfig(
  importConfig: () => Promise<ServerConfigModule>,
): Promise<DeepPartial<DunetaServerConfig>> {
  const mod = await importConfig();
  return applyRuntimeAppDefaults(toServerConfig(mod.default ?? {}));
}
