import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { toWebConfig, type DunetaConfig } from './duneta';
import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { DunetaWebConfig } from './types';

export { defineDunetaConfig, toServerConfig, toWebConfig } from './duneta';
export type { DunetaConfig } from './duneta';

async function loadDunetaConfigFile(cwd: string): Promise<DunetaConfig> {
  try {
    const configModule = await import(
      /* @vite-ignore */ pathToFileURL(join(cwd, 'duneta.config.ts')).href
    );
    return configModule.default ?? {};
  } catch {
    return {};
  }
}

/** Merge `duneta.config.ts` overrides onto web defaults and cache the result. */
export async function loadConfig(
  cwd: string,
  overrides?: DeepPartial<DunetaWebConfig>,
): Promise<DunetaWebConfig> {
  const file = await loadDunetaConfigFile(cwd);
  const patch = overrides ?? toWebConfig(file);
  return commitConfig(mergeConfig(createDefaultConfig(), patch));
}
