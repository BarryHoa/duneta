import { defineDunetaConfig as defineWeb } from '@duneta/client/configs';
import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  defineDunetaConfig as defineApi,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@duneta/server/configs';

/** API — structure only; secrets via wrangler `.dev.vars` / `wrangler secret put`. */
export const api = defineApi({
  app: {
    name: 'duneta',
    env: 'production',
  },
  database: {
    enabled: true,
    default: 'primary',
    connections: defineConnections({}),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: {
    enabled: true,
    baseUrl: 'http://localhost:8787',
  },
  security: {
    rateLimit: {
      enabled: true,
      rules: RECOMMENDED_RATE_LIMIT_RULES,
    },
  },
});

/** Web — default export for vite / react-router */
export default defineWeb({
  app: {
    name: 'duneta',
    env: 'production',
  },
  api: { baseUrl: '/api' },
  theme: { default: 'light' },
});
