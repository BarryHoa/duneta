import { defineDunetaConfig } from '@duneta/client/configs';
import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@duneta/server/configs';

/** Structure only — secrets via wrangler `.dev.vars` / `wrangler secret put`. */
export default defineDunetaConfig({
  app: {
    name: 'duneta',
    env: 'production',
  },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
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
