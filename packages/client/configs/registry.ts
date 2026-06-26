import type { DunetaWebConfig } from './types';

let cachedConfig: DunetaWebConfig | undefined;

/** Internal — only imported by `load.ts`, not re-exported from the package barrel. */
export function commitConfig<T extends DunetaWebConfig>(config: T): T {
  cachedConfig = config;
  return config;
}

export function getConfig(): DunetaWebConfig {
  if (!cachedConfig) {
    throw new Error(
      'Web config is not loaded. Call loadConfig() on boot or add app/web/duneta.config.ts.',
    );
  }
  return cachedConfig;
}

export const config = new Proxy({} as DunetaWebConfig, {
  get(_target, prop) {
    return getConfig()[prop as keyof DunetaWebConfig];
  },
});
