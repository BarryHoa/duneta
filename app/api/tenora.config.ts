import {
  defineCacheStores,
  defineConnections,
  defineRateLimitRules,
  defineTenoraConfig,
  env,
  memcachedStore,
  memoryStore,
  postgresConnection,
  rateLimitRule,
  redisStore,
  type CacheDriver,
  type Runtime,
} from '@tenora/server/configs';

const runtime = (env('RUNTIME', 'node') === 'worker' ? 'worker' : 'node') as Runtime;
const port = Number(env('PORT', '3001'));
const databaseUrl = process.env.DATABASE_URL;
const authSecret = process.env.AUTH_SECRET;

const cacheDriver = (process.env.CACHE_DRIVER ??
  process.env.CACHE_PROVIDER ??
  'redis') as CacheDriver;
const cacheUrl = process.env.CACHE_URL ?? process.env.REDIS_URL;
const cacheToken = process.env.CACHE_TOKEN ?? process.env.REDIS_PASSWORD ?? process.env.REDIS_TOKEN;

const workerPool = { max: 1, idleTimeout: 5, connectTimeout: 10 };
const nodePool = { max: 10, idleTimeout: 20, connectTimeout: 10 };

function cacheStores() {
  return defineCacheStores({
    memory: cacheDriver === 'memory' ? memoryStore() : undefined,
    redis:
      cacheDriver === 'redis' && cacheUrl
        ? redisStore({ url: cacheUrl, token: cacheToken, password: cacheToken })
        : undefined,
    memcached:
      cacheDriver === 'memcached' && cacheUrl
        ? memcachedStore({ url: cacheUrl, password: cacheToken })
        : undefined,
  });
}

const cacheEnabled = cacheDriver === 'memory' || Boolean(cacheUrl);
const rateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== 'false';

const rateLimitRules = defineRateLimitRules(
  rateLimitRule({
    name: 'global-ip',
    max: 300,
    windowMs: 60_000,
    key: 'ip',
    excludePaths: ['/health'],
  }),
  rateLimitRule({
    name: 'public-read',
    max: 120,
    windowMs: 60_000,
    key: 'ip',
    path: '/users',
    methods: ['GET'],
  }),
  rateLimitRule({
    name: 'authenticated',
    max: 100,
    windowMs: 60_000,
    key: 'user',
    path: '/users',
  }),
  rateLimitRule({
    name: 'auth-brute-force',
    max: 5,
    windowMs: 15 * 60_000,
    key: 'ip+identifier',
    path: '/auth',
    methods: ['POST'],
    identifierQuery: 'email',
  }),
);

export default defineTenoraConfig({
  runtime: { target: runtime },

  app: {
    name: 'tenora-api',
    env: env('NODE_ENV', 'development') as 'development' | 'production' | 'test',
    port,
    debug: runtime === 'node',
  },

  ...(databaseUrl || runtime === 'worker'
    ? {
        database: {
          enabled: true,
          default: 'primary',
          connections: defineConnections({
            primary: databaseUrl ? postgresConnection({ url: databaseUrl }) : undefined,
          }),
          pool: runtime === 'worker' ? workerPool : nodePool,
        },
      }
    : {}),

  ...(databaseUrl && authSecret
    ? {
        auth: {
          enabled: true,
          secret: authSecret,
          baseUrl: env('AUTH_BASE_URL', `http://localhost:${port}`),
        },
      }
    : {}),

  ...(cacheEnabled
    ? {
        cache: {
          enabled: true,
          driver: cacheDriver,
          stores: cacheStores(),
        },
      }
    : {}),

  ...(rateLimitEnabled
    ? {
        security: {
          rateLimit: { enabled: true, rules: rateLimitRules },
        },
      }
    : {}),
});
