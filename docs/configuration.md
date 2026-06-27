# Cấu hình

## Ba lớp (xem [Kiến trúc](./architecture.md))

- **Core defaults** — `createDefaultConfig()`: `database.enabled: false`, `auth.enabled: false`, …
- **Build sẵn** — không cần config riêng; dùng khi user mount route + register controller tương ứng
- **User** — `duneta.config.ts` bật feature; `app/api/*` wire route/DI

## 1 file config

```text
duneta.config.ts → merge lên core defaults
```

Cấu hình sai (bật DB nhưng thiếu URL, mount route auth nhưng `auth.enabled: false`, …) → runtime lỗi. Framework không tự skip.

Trước khi đọc `duneta.config.ts`, Duneta load `.env` vào `process.env` (shell env ưu tiên). Khi bật DB/auth: map `process.env.DATABASE_URL`, `process.env.AUTH_SECRET`, … trong config.

Wrangler bindings (`ASSETS`, …) — chỉ trong `worker.ts`, không qua framework config.

## App mới (minimal)

`create-duneta-app` scaffold:

```ts
import { defineDunetaConfig } from '@duneta/client/configs';

export default defineDunetaConfig({
  app: { name: 'my-app', env: 'development' },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
});
```

Không cần `.env` cho app chỉ health check. Core defaults giữ mọi optional module OFF.

## Opt in: database + auth

Khi cần — bật trong config, set env, register controller/route build sẵn (hoặc custom):

```ts
import { defineDunetaConfig } from '@duneta/client/configs';
import {
  DEFAULT_DATABASE_POOL,
  defineConnections,
  RECOMMENDED_RATE_LIMIT_RULES,
} from '@duneta/server/configs';

export default defineDunetaConfig({
  app: { name: 'my-app', env: 'production' },
  theme: { default: 'light' },
  api: { baseUrl: '/api' },
  database: {
    enabled: true,
    default: 'primary',
    connections: defineConnections({
      primary: { driver: 'postgres', url: process.env.DATABASE_URL ?? '' },
    }),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: {
    enabled: true,
    baseUrl: process.env.AUTH_BASE_URL ?? 'http://localhost:8787',
    secret: process.env.AUTH_SECRET ?? '',
  },
  security: {
    rateLimit: { enabled: true, rules: RECOMMENDED_RATE_LIMIT_RULES },
    csrf: { enabled: true, secret: process.env.CSRF_SECRET ?? '' },
  },
});
```

Kèm `app/api/services.ts` + `router.ts` mount `MeController`, `UserController`, `meRoutes`, `createUsersRoutes()` — xem repo dogfood monorepo.

`app` dùng chung. Web đọc `theme`, `api.baseUrl`; Worker đọc `database`, `auth`, `security`, …

### Đọc config lúc runtime

```ts
import { config, getConfig } from '@duneta/server/configs';
```

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

Override: set `logging.enabled` trong `duneta.config.ts`.

Retention: Cloudflare Dashboard, `wrangler tail`, hoặc **Logpush** — không dùng pino/winston file transport.

## Cache

Bật trong `duneta.config.ts`. Redis URL/token set trong config:

```ts
import { redisCache, memoryCache } from '@duneta/server/configs';

// Prod: set url + token trong config
cache: redisCache({ url: '...', token: '...' }),
// cache: memoryCache(),  // dev only — per-isolate, not shared across edge
```

Dùng global facade:

```ts
import { cached } from '@duneta/server/cached';

await cached.set('key', 'value', 60_000);
await cached.get('key');
```

## Storage

Upload file/image lên S3-compatible storage (R2, AWS S3, MinIO). Chi tiết: [storage](./api/storage.md).

```ts
import { storage } from '@duneta/server/configs';

storage({
  driver: 's3',
  config: {
    bucket: 'duneta',
    endpoint: 'https://<account>.r2.cloudflarestorage.com',
    accessKeyId: '...',
    secretAccessKey: '...',
    publicUrl: 'https://cdn.example.com',
  },
}),
```

Custom store (app) — extend `BaseStorageController`:

```ts
import { BaseStorageController } from '@duneta/server/http';

export class AppStorageController extends BaseStorageController {
  uploadAvatar(file: Blob) {
    return this.upload(file, { folder: 'avatars' });
  }
}
```

Register: `new AppStorageController(config.storage)`.

## Auth

Bật khi có `auth.enabled: true` + `auth.secret` + database:

```ts
auth: {
  enabled: true,
  baseUrl: 'http://localhost:8787',
  secret: '...',
},
security: {
  csrf: { enabled: true, secret: '...' },
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

Postgres URL trong `database.connections.*.url`. Hyperdrive: dùng connection string Hyperdrive cung cấp làm `url`.
