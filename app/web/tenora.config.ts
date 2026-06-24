import { defineTenoraConfig, env } from '@tenora/client/configs';

const apiPort = Number(env('API_PORT', '3001'));

export default defineTenoraConfig({
  app: {
    name: 'tenora-web',
    port: Number(env('PORT', '3000')),
    env: env('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  },
  api: {
    port: apiPort,
    baseUrl: '/api',
  },
  theme: {
    default: 'dark',
  },
});
