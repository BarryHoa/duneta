import {
  defineConnections,
  defineTenoraConfig,
  env,
  postgresConnection,
} from '@tenora/server/configs';

const port = Number(env('PORT', '3001'));
const databaseUrl = process.env.DATABASE_URL;
const authSecret = process.env.AUTH_SECRET;

export default defineTenoraConfig({
  runtime: { target: 'node' },
  app: {
    name: 'tenora-api',
    env: env('NODE_ENV', 'development') as 'development' | 'production' | 'test',
    port,
    debug: true,
  },
  // Opt in — omit or set enabled: false to run without a database.
  ...(databaseUrl
    ? {
        database: {
          enabled: true,
          default: 'primary',
          connections: defineConnections({
            primary: postgresConnection({ url: databaseUrl }),
          }),
        },
      }
    : {}),
  // Auth requires database.enabled: true and AUTH_SECRET.
  ...(databaseUrl && authSecret
    ? {
        auth: {
          enabled: true,
          secret: authSecret,
          baseUrl: env('AUTH_BASE_URL', `http://localhost:${port}`),
        },
      }
    : {}),
  // cache: { enabled: true, provider: 'redis', providers: { redis: { url: env('REDIS_URL') } } },
  // security: { rateLimit: { enabled: true } },
});
