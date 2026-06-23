import type { TenoraWebConfig } from './types';

let cachedConfig: TenoraWebConfig | undefined;

/** Internal — only imported by `load.ts`, not re-exported from the package barrel. */
export function commitConfig<T extends TenoraWebConfig>(config: T): T {
  cachedConfig = config;
  return config;
}

export function getConfig(): TenoraWebConfig {
  if (!cachedConfig) {
    throw new Error(
      'Web config is not loaded. Call loadConfig() on boot or add app/web/tenora.config.ts.',
    );
  }
  return cachedConfig;
}

export const config = new Proxy({} as TenoraWebConfig, {
  get(_target, prop) {
    return getConfig()[prop as keyof TenoraWebConfig];
  },
});
