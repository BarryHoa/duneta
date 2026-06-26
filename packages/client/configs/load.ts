import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { DunetaWebConfig } from './types';

/** Like `defineConfig` in Next.js — all sections are optional. */
export function defineDunetaConfig<const T extends Record<string, unknown>>(
  config?: DeepPartial<DunetaWebConfig> & T,
): DeepPartial<DunetaWebConfig> & T {
  return (config ?? {}) as DeepPartial<DunetaWebConfig> & T;
}

async function loadDunetaConfigFile(cwd: string): Promise<DeepPartial<DunetaWebConfig>> {
  try {
    const configModule = await import(
      /* @vite-ignore */ pathToFileURL(join(cwd, 'duneta.config.ts')).href
    );
    return configModule.default ?? {};
  } catch {
    return {};
  }
}

/** Merge `duneta.config.ts` overrides onto defaults and cache the result. */
export async function loadConfig(
  cwd: string,
  overrides?: DeepPartial<DunetaWebConfig>,
): Promise<DunetaWebConfig> {
  const patch = overrides ?? (await loadDunetaConfigFile(cwd));
  return commitConfig(mergeConfig(createDefaultConfig(), patch));
}
