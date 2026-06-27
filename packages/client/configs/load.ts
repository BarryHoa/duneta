import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { toWebConfig, type DunetaConfig } from './duneta';
import { createDefaultConfig } from './defaults';
import { mergeConfig, type DeepPartial } from './merge';
import { commitConfig } from './registry';
import type { DunetaWebConfig } from './types';

export { defineDunetaConfig, toServerConfig, toWebConfig } from './duneta';
export type { DunetaConfig } from './duneta';

/** `.env` → `process.env` (shell env ưu tiên, không ghi đè). */
export function loadDotEnv(cwd: string): void {
  const file = join(cwd, '.env');
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function loadDunetaConfigFile(cwd: string): Promise<DunetaConfig> {
  loadDotEnv(cwd);
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
