import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  CLIENT_CONFIG_FILENAME,
  toWebConfig,
  type DunetaClientConfig,
} from './duneta';
import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { DunetaWebConfig } from './types';

export {
  CLIENT_CONFIG_FILENAME,
  SERVER_CONFIG_FILENAME,
  defineClientConfig,
  defineDunetaConfig,
  defineServerConfig,
  loadWorkerServerConfig,
  toServerConfig,
  toWebConfig,
} from './duneta';
export type {
  DunetaClientConfig,
  DunetaConfig,
  DunetaServerConfigFile,
} from './duneta';

async function loadClientConfigFile(cwd: string): Promise<DunetaClientConfig> {
  try {
    const configModule = await import(
      /* @vite-ignore */ pathToFileURL(join(cwd, CLIENT_CONFIG_FILENAME)).href
    );
    return configModule.default ?? {};
  } catch {
    return {};
  }
}

/** Merge `duneta.client.config.ts` onto web defaults (Vite / sync only — no server secrets). */
export async function loadConfig(
  cwd: string,
  overrides?: DeepPartial<DunetaWebConfig>,
): Promise<DunetaWebConfig> {
  const file = await loadClientConfigFile(cwd);
  const patch = overrides ?? toWebConfig(file);
  return commitConfig(mergeConfig(createDefaultConfig(), patch));
}
