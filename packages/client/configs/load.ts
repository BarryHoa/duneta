import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { TenoraWebConfig } from './types';

/** Like `defineConfig` in Next.js — all sections are optional. */
export function defineTenoraConfig<const T extends Record<string, unknown>>(
  config?: DeepPartial<TenoraWebConfig> & T,
): DeepPartial<TenoraWebConfig> & T {
  return (config ?? {}) as DeepPartial<TenoraWebConfig> & T;
}

async function loadTenoraConfigFile(cwd: string): Promise<DeepPartial<TenoraWebConfig>> {
  try {
    const configModule = await import(
      pathToFileURL(join(cwd, 'tenora.config.ts')).href
    );
    return configModule.default ?? {};
  } catch {
    return {};
  }
}

/** Merge `tenora.config.ts` overrides onto defaults and cache the result. */
export async function loadConfig(
  cwd: string,
  overrides?: DeepPartial<TenoraWebConfig>,
): Promise<TenoraWebConfig> {
  const patch = overrides ?? (await loadTenoraConfigFile(cwd));
  return commitConfig(mergeConfig(createDefaultConfig(), patch));
}
