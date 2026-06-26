import type { DunetaWebConfig } from './types';

export function createDefaultConfig(): DunetaWebConfig {
  return {
    app: {
      name: 'duneta-web',
      env: 'development',
    },
    api: {
      baseUrl: '/api',
    },
    router: {
      appDirectory: '.router-runtime',
      ssr: {
        streamTimeout: 5_000,
      },
    },
    theme: {
      default: 'light',
    },
  };
}
