import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  defineTenoraConfig,
  envFirst,
  postgresConnection,
  RECOMMENDED_RATE_LIMIT_RULES,
  type NodeEnv,
} from '@tenora/server/configs';

const port = Number(envFirst(['PORT'], '3001'));
const databaseUrl = envFirst(['DATABASE_URL']);
const authSecret = envFirst(['AUTH_SECRET']);

export default defineTenoraConfig({
  app: {
    name: 'tenora-api',
    env: envFirst(['NODE_ENV'], 'development') as NodeEnv,
    port,
  },

  database: {
    enabled: true,
    default: 'primary',
    connections: defineConnections({
      primary: databaseUrl
        ? postgresConnection({ url: databaseUrl })
        : undefined,
    }),
    pool: DEFAULT_DATABASE_POOL,
  },

  ...(authSecret
    ? {
        auth: {
          enabled: true,
          secret: authSecret,
          baseUrl:
            envFirst(['AUTH_BASE_URL'], `http://localhost:${port}`) ??
            `http://localhost:${port}`,
        },
      }
    : {}),

  security: {
    rateLimit: {
      enabled: true,
      rules: RECOMMENDED_RATE_LIMIT_RULES,
    },
  },
});
