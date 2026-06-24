import type { TenoraServerConfig } from './types';

let cachedConfig: TenoraServerConfig | undefined;

/** Internal — only imported by `load.ts`, not re-exported from the package barrel. */
export function commitConfig<T extends TenoraServerConfig>(config: T): T {
  cachedConfig = config;
  return config;
}

export function getConfig<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- default: no app-specific config extensions
  TExtra extends Record<string, unknown> = {},
  TDatabase extends TenoraServerConfig['database'] = TenoraServerConfig['database'],
>(): TenoraServerConfig<TExtra, TDatabase> {
  if (!cachedConfig) {
    throw new Error(
      'Server config is not loaded. Call loadConfig() on boot or add app/api/tenora.config.ts.',
    );
  }
  return cachedConfig as unknown as TenoraServerConfig<TExtra, TDatabase>;
}

export const config = new Proxy({} as TenoraServerConfig, {
  get(_target, prop) {
    return getConfig()[prop as keyof TenoraServerConfig];
  },
});
