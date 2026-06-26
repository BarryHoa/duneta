# Cấu hình

## 3 lớp (Laravel-style)

```text
1. @duneta/server defaults     → baseline framework (global)
2. app/duneta.config.ts          → cấu trúc app (bạn chỉnh)
3. .dev.vars / wrangler secrets → giá trị (URL, secret)
```

`duneta.config.ts` khai báo **cấu trúc** theo TypeScript types. Secrets (`DATABASE_URL`, `AUTH_SECRET`, …) qua `.dev.vars` / `wrangler secret put` — merge lúc runtime trên Worker.

## API + Web config

File: `app/duneta.config.ts` — `export const api` (Worker) + `export default` (web).

```ts
export const api = defineApi({
  app: { name: 'duneta', env: 'production' },
  database: {
    enabled: true,
    connections: defineConnections({}),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: { enabled: true, baseUrl: 'http://localhost:8787' },
});

export default defineWeb({
  app: { name: 'duneta' },
  api: { baseUrl: '/api' },
  theme: { default: 'light' },
});
```

### Đọc config lúc runtime

```ts
import { config, getConfig } from '@duneta/server/configs';
```

### Secrets (`.dev.vars` / wrangler)

| Biến | Mô tả |
|------|-------|
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | Bật auth khi có (≥ 32 ký tự) |
| `AUTH_BASE_URL` | Base URL Better Auth (`http://localhost:8787` khi dev) |
| `CACHE_URL` / `CACHE_TOKEN` | Redis HTTP |

Xem `.dev.vars.example` ở repo root.

## Web config

File: `app/duneta.config.ts`

```ts
import { defineDunetaConfig } from '@duneta/client/configs';

export default defineDunetaConfig({
  app: { name: 'duneta-web' },
  api: { baseUrl: '/api' },
  theme: { default: 'dark' },
});
```

`api.baseUrl` — path API trên cùng domain Worker (same-origin).

## Cache

Bật trong `duneta.config.ts`, không phải `.env` alone:

```ts
import { redisCache, memoryCache } from '@duneta/server/configs';

cache: redisCache({ url: process.env.CACHE_URL!, token: process.env.CACHE_TOKEN }),
// cache: memoryCache(),
```

Dùng global facade:

```ts
import { cached } from '@duneta/server/cached';

await cached.set('key', 'value', 60_000);
await cached.get('key');
```

## Auth

Bật khi có `auth.enabled: true` + `auth.secret` + database:

```ts
auth: {
  enabled: true,
  secret: process.env.AUTH_SECRET!,
  baseUrl: process.env.AUTH_BASE_URL || 'http://localhost:8787',
},
```

Better Auth mount tại `/api/auth/*` (tự wire).

## Rate limit

```ts
import { defineRateLimitRules, rateLimitRule } from '@duneta/server/configs';

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

`wrangler.jsonc` (repo root) — Hyperdrive, `ASSETS`, secrets, compatibility flags. `DATABASE_URL` có thể đến từ Hyperdrive binding lúc request.
