import type { Config } from '@react-router/dev/config';

export function defineTenoraConfig(overrides: Partial<Config> = {}): Config {
  return {
    appDirectory: '.router-runtime',
    ...overrides,
  };
}
