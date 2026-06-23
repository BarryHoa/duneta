import { defineTenoraConfig } from '@tenora/client/configs';

export default defineTenoraConfig({
  app: { name: 'tenora-web', port: 3000 },
  api: {
    port: Number(process.env.API_PORT ?? 3001),
    proxyTarget: 'http://localhost:3001',
    baseUrl: '/api',
  },
});
