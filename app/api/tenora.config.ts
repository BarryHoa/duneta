import {
  databasePoolForRuntime,
  DEFAULT_DATABASE_POOL,
  defineConnections,
  defineTenoraConfig,
  envFirst,
  postgresConnection,
  RECOMMENDED_RATE_LIMIT_RULES,
  type NodeEnv,
  type Runtime,
} from '@tenora/server/configs';

const runtime = (envFirst(['RUNTIME'], 'worker') === 'node' ? 'node' : 'worker') as Runtime;
const defaultPort = runtime === 'node' ? '3001' : '8787';
const port = Number(envFirst(['PORT'], defaultPort));
const databaseUrl = envFirst(['DATABASE_URL']);
const authSecret = envFirst(['AUTH_SECRET']);

export default defineTenoraConfig({
  runtime: { target: runtime },

  app: {
    name: 'tenora-api',
    env: envFirst(['NODE_ENV'], 'development') as NodeEnv,
    port,
    debug: runtime === 'node',
  },

  database: {
    enabled: true,
    default: 'primary',
    connections: defineConnections({
      primary: databaseUrl
        ? postgresConnection({ url: databaseUrl })
        : undefined,
    }),
    pool: databasePoolForRuntime(runtime, DEFAULT_DATABASE_POOL),
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
