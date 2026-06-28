import {
  createDefaultConfig,
  mergeConfig,
  type DeepPartial,
  type DunetaServerConfig,
} from '../../configs/index.js';
import { commitConfig } from '../../configs/registry.js';
import type { ServerConfigImport } from '../shared/types.js';

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
] as const satisfies readonly (keyof DunetaServerConfig)[];

function pickServerPatch(source: Record<string, unknown>): DeepPartial<DunetaServerConfig> {
  const patch: Record<string, unknown> = {};
  for (const key of SERVER_KEYS) {
    const value = source[key];
    if (value !== undefined) patch[key] = value;
  }
  return patch as DeepPartial<DunetaServerConfig>;
}

function runtimeAppEnv(): 'development' | 'production' {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

function applyRuntimeAppDefaults(
  patch: DeepPartial<DunetaServerConfig>,
): DeepPartial<DunetaServerConfig> {
  if (patch.app?.env !== undefined) return patch;
  return { ...patch, app: { ...patch.app, env: runtimeAppEnv() } };
}

export type ServerConfigModule = { default?: DeepPartial<DunetaServerConfig> };

/** Import `duneta.server.config.ts`, merge defaults, commit — secrets from `process.env`. */
export async function loadServerConfig(importConfig: ServerConfigImport): Promise<DunetaServerConfig> {
  const mod = await importConfig();
  const patch = applyRuntimeAppDefaults(pickServerPatch(mod.default ?? {}));
  return commitConfig(
    mergeConfig(createDefaultConfig(), { ...patch, runtime: { target: 'worker' } }),
  );
}
