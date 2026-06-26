import type { DunetaWebConfig } from './types';

export const DEFAULT_WEB_PORT = 3000;
export const DEFAULT_API_PORT = 3001;

export function createDefaultConfig(): DunetaWebConfig {
  const apiPort = DEFAULT_API_PORT;

  return {
    app: {
      name: 'duneta-web',
      port: DEFAULT_WEB_PORT,
      env: 'development',
    },
    api: {
      port: apiPort,
      proxyTarget: `http://localhost:${apiPort}`,
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
