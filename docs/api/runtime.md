# Runtime: Cloud vs Bun

Hai entry file = hai runtime. Framework tự set `runtime.target` — **không cần** `RUNTIME` trong `.env` hay `tenora.config.ts`.

## Quy tắc đơn giản

| Muốn chạy | Entry file | Command |
|-----------|------------|---------|
| Cloudflare Worker | `server.ts` | `pnpm --filter api dev` |
| Bun local / VPS | `server.node.ts` | `pnpm --filter api dev:node` |

```text
server.ts       →  import runtime/cloud  →  target = worker
server.node.ts  →  import runtime/node   →  target = node
```

## So sánh

| | Cloud (`server.ts`) | Bun (`server.node.ts`) |
|---|---|---|
| CLI | `tenora-api dev` / `deploy` | `tenora-api dev:node` |
| URL local | http://localhost:8787/api | http://localhost:3001/api |
| Export | `{ fetch }` | `{ port, fetch }` |
| DB | Hyperdrive / Neon serverless | `pg` pool |
| Worker bindings | Có (`env` mỗi request) | Không |

## Framework tự xử lý theo target

Khi boot, `bootstrapConfig()` merge:

```ts
runtime: { target: 'worker' | 'node' }  // từ entry, luôn thắng
```

Ảnh hưởng nội bộ:

- **DB pool**: worker cap `max` 1–2; node dùng pool đầy đủ (`databasePoolForRuntime`)
- **DB without URL**: worker cho phép Hyperdrive binding lúc request
- **debug**: node mặc định `app.debug: true` nếu bạn không set

## Cloud — Wrangler

```ts
// app/api/server.ts
import { defineServer } from '@tenora/server/runtime/cloud';
export default defineServer({ config, createRouter, providers: registerProviders });
```

`wrangler.jsonc` — secrets, Hyperdrive. Không cần `vars.RUNTIME`.

## Bun — local / VPS

```ts
// app/api/server.node.ts
import { defineServer } from '@tenora/server/runtime/node';
export default defineServer({ config, createRouter, providers: registerProviders });
```

`.env`:

```env
PORT=3001
DATABASE_URL=postgresql://...
```

## `tenora.config.ts` dùng chung

Một file config cho cả hai entry. Runtime-specific logic do framework lo — bạn chỉ set:

- `PORT` (chủ yếu cho Bun + auth `baseUrl`)
- `DATABASE_URL`, `AUTH_SECRET`, ...

Worker dev port 8787 do Wrangler quản lý, không đọc `app.port`.

## Deploy

| Target | Command |
|--------|---------|
| Cloudflare Worker | `pnpm --filter api deploy` |
| Bun VPS | `bun server.node.ts` (+ process manager) |
