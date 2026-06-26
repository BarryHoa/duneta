import { defineDunetaConfig, env } from '@duneta/client/configs';

const apiPort = Number(env('API_PORT', '3001'));

export default defineDunetaConfig({
  app: {
    name: 'duneta-web',
    port: Number(env('PORT', '3000')),
    env: env('NODE_ENV', 'development') as
      | 'development'
      | 'production'
      | 'test',
  },
  api: {
    port: apiPort,
    baseUrl: '/api',
  },
  theme: {
    default: 'light',
  },
});
