# Cấu hình

## 3 lớp (Laravel-style)

```text
1. @duneta/server defaults     → baseline framework (global)
2. duneta.config.ts              → cấu trúc app (bạn chỉnh)
3. .dev.vars / wrangler secrets → giá trị (URL, secret)
```

`duneta.config.ts` khai báo **cấu trúc** theo TypeScript types. Secrets (`DATABASE_URL`, `AUTH_SECRET`, …) qua `.dev.vars` / `wrangler secret put` — merge lúc runtime trên Worker.

## API + Web config

File: `duneta.config.ts` — một `export default` cho web và API.

```ts
import { defineDunetaConfig } from '@duneta/client/configs';
import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@duneta/server/configs';

export default defineDunetaConfig({
  app: { name: 'duneta', env: 'production' },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
  database: {
    enabled: true,
    connections: defineConnections({}),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: { enabled: true, baseUrl: 'http://localhost:8787' },
  security: { rateLimit: { enabled: true, rules: RECOMMENDED_RATE_LIMIT_RULES } },
});
```

`app` dùng chung. Web đọc `theme`, `api.baseUrl`; Worker đọc `database`, `auth`, `security`, …

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
| `CACHE_URL` / `CACHE_TOKEN` | Redis HTTP (auto-enables cache when URL set) |
| `CSRF_SECRET` | CSRF signing (defaults to `AUTH_SECRET`) |
| `LOGGING_ENABLED` | Override request logging |

Xem `.dev.vars.example` ở repo root.

## Web config

File: `duneta.config.ts`

```ts
import { defineDunetaConfig } from '@duneta/client/configs';

export default defineDunetaConfig({
  app: { name: 'duneta-web' },
  api: { baseUrl: '/api' },
  theme: { default: 'dark' },
});
```

`api.baseUrl` — path API trên cùng domain Worker (same-origin).

## Logging

Workers **không có filesystem** — không ghi log ra file. Duneta dùng stdout (JSON trên production).

```ts
logging: {
  enabled: true,
  format: 'json', // 'text' cho dev local
},
```

Request log mẫu:

```json
{"level":"info","msg":"request","requestId":"...","method":"GET","path":"/api/health","status":200,"durationMs":12}
```

Override: `LOGGING_ENABLED=true|false` trong `.dev.vars` / wrangler secrets.

Retention: Cloudflare Dashboard, `wrangler tail`, hoặc **Logpush** — không dùng pino/winston file transport.

## Cache

Bật trong `duneta.config.ts`. URL/token qua wrangler secrets (không hardcode):

```ts
import { redisCache, memoryCache } from '@duneta/server/configs';

// Prod: set CACHE_URL + CACHE_TOKEN secrets — auto-merge at runtime
cache: redisCache({ url: '', token: '' }),
// cache: memoryCache(),  // dev only — per-isolate, not shared across edge
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
  baseUrl: 'http://localhost:8787', // override: AUTH_BASE_URL secret
},
security: {
  csrf: { enabled: true, secret: '' }, // CSRF_SECRET or AUTH_SECRET at runtime
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

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Dev + Vite build |
| `wrangler.production.jsonc.example` | Hyperdrive + ASSETS reference |
| `app/build/server/wrangler.json` | Generated deploy config |

`DATABASE_URL` từ secret hoặc Hyperdrive binding (`HYPERDRIVE.connectionString`).
