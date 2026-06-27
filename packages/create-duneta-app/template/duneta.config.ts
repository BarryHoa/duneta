import { defineDunetaConfig } from '@duneta/client/configs';

/** Minimal app — database, auth, storage OFF by default. Opt in when needed. */
export default defineDunetaConfig({
  app: {
    name: '{{name}}',
    env: 'development',
  },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
});
