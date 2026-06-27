import { defineClientConfig } from '@duneta/client/configs';

export default defineClientConfig({
  app: {
    name: 'duneta',
    env: 'production',
  },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
});
