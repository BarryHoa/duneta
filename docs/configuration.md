# Cấu hình

## 1 lớp config

```text
duneta.config.ts → DunetaServerConfig (TypeScript types — đọc type là biết phải set gì)
```

Cấu hình sai → runtime lỗi. Framework **không** đọc worker env để merge config.

`duneta.config.ts` — database URL, auth secrets, storage, cache, security, …

Wrangler `env` (bindings như `ASSETS`) — chỉ dùng trong `worker.ts` cho routing/static, framework API không nhận env.

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
    default: 'primary',
    connections: defineConnections({
      primary: { driver: 'postgres', url: 'postgresql://...' },
    }),
    pool: DEFAULT_DATABASE_POOL,
  },
  auth: { enabled: true, baseUrl: 'http://localhost:8787', secret: '...' },
  security: { rateLimit: { enabled: true, rules: RECOMMENDED_RATE_LIMIT_RULES } },
});
```

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
