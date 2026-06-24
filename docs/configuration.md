# Cấu hình

## 3 lớp (Laravel-style)

```text
1. @tenora/server defaults     → baseline framework (global)
2. app/*/tenora.config.ts      → cấu trúc app (bạn chỉnh)
3. .env / wrangler secrets     → giá trị (URL, secret)
```

`tenora.config.ts` khai báo **cấu trúc** theo TypeScript types. `.env` chỉ cung cấp **giá trị** qua `env()` / `envFirst()`.

## API config

File: `app/api/tenora.config.ts`

```ts
import {
  defineTenoraConfig,
  envFirst,
  defineConnections,
  postgresConnection,
  DEFAULT_DATABASE_POOL,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@tenora/server/configs';

const port = Number(envFirst(['PORT'], '3001'));

export default defineTenoraConfig({
  app: { name: 'tenora-api', env: 'development', port },
  database: {
    enabled: true,
    connections: defineConnections({
      primary: postgresConnection({ url: envFirst(['DATABASE_URL']) }),
    }),
    pool: DEFAULT_DATABASE_POOL,
  },
  security: {
    rateLimit: { enabled: true, rules: RECOMMENDED_RATE_LIMIT_RULES },
  },
});
```

> **Không set `runtime`** trong `tenora.config.ts` — entry file (`server.ts` / `server.node.ts`) quyết định. Pool DB worker được framework tự điều chỉnh.

### Đọc config lúc runtime

```ts
import { config, getConfig } from '@tenora/server/configs';
```

### Biến môi trường API

| Biến | Mô tả |
|------|-------|
| `PORT` | Bun listen port (mặc định `3001`) |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Bật auth khi có (≥ 32 ký tự) |
| `AUTH_BASE_URL` | Base URL Better Auth (worker: `http://localhost:8787`) |
| `CACHE_URL` / `CACHE_TOKEN` | Redis HTTP |

Runtime **không** qua env — chọn `server.ts` (worker) hoặc `server.node.ts` (node).

Xem `app/api/.env.example`.

## Web config

File: `app/web/tenora.config.ts`

```ts
import { defineTenoraConfig, env } from '@tenora/client/configs';

export default defineTenoraConfig({
  app: { name: 'tenora-web', port: Number(env('PORT', '3000')) },
  api: { port: Number(env('API_PORT', '3001')), baseUrl: '/api' },
  theme: { default: 'dark' },
});
```

`api.port` dùng cho Vite proxy tới backend.

## Cache

Bật trong `tenora.config.ts`, không phải `.env` alone:

```ts
import { redisCache, memoryCache } from '@tenora/server/configs';

cache: redisCache({ url: env('CACHE_URL'), token: env('CACHE_TOKEN') }),
// cache: memoryCache(),
```

Dùng global facade:

```ts
import { cached } from '@tenora/server/cached';

await cached.set('key', 'value', 60_000);
await cached.get('key');
```

## Auth

Bật khi có `auth.enabled: true` + `auth.secret` + database:

```ts
auth: {
  enabled: true,
  secret: env('AUTH_SECRET'),
  baseUrl: env('AUTH_BASE_URL', `http://localhost:${port}`),
},
```

Better Auth mount tại `/api/auth/*` (tự wire).

## Rate limit

```ts
import { defineRateLimitRules, rateLimitRule } from '@tenora/server/configs';

security: {
  rateLimit: {
    enabled: true,
    rules: defineRateLimitRules([
      rateLimitRule({ key: 'api', max: 60, windowMs: 60_000 }),
    ]),
  },
},
```

Dùng distributed cache khi `cache.enabled` + Redis HTTP.

## Worker bindings

`app/api/wrangler.jsonc` — Hyperdrive, secrets, compatibility flags. `DATABASE_URL` có thể đến từ binding lúc request trên Worker.
