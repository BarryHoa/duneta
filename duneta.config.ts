import { defineDunetaConfig } from '@duneta/client/configs';
import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@duneta/server/configs';

/** Secrets và connection URLs — set trực tiếp trong config. */
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
    connections: defineConnections({
      primary: { driver: 'postgres', url: '' },
    }),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: {
    enabled: true,
    baseUrl: 'http://localhost:8787',
    secret: '',
  },
  security: {
    rateLimit: {
      enabled: true,
      rules: RECOMMENDED_RATE_LIMIT_RULES,
    },
    csrf: {
      enabled: true,
      secret: '',
    },
  },
  logging: {
    enabled: true,
    format: 'json',
  },
  storage: { enabled: false },
});
