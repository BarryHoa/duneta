# Runtime: Cloud vs Bun

Tenora hỗ trợ hai runtime API qua import path riêng — **không có** barrel `@tenora/server/runtime`.

## So sánh

| | Cloud (`runtime/cloud`) | Node (`runtime/node`) |
|---|---|---|
| Entry | `server.ts` | `server.node.ts` |
| Chạy local | Wrangler `:8787` | Bun `:3001` |
| Database | Neon serverless / Hyperdrive | `pg` pool |
| Export | `{ fetch }` | `{ port, fetch }` |
| `RUNTIME` env | `worker` | `node` |

## Cloud — Wrangler / Vercel

```ts
// app/api/server.ts
import { defineServer } from '@tenora/server/runtime/cloud';

export default defineServer({ config, createRouter, providers: registerProviders });
// → { fetch(request, env?) }
```

Wrangler đọc `app/api/wrangler.jsonc`:

```jsonc
{
  "main": "server.ts",
  "compatibility_date": "2025-06-17"
}
```

Worker nhận bindings (`env`) mỗi request — Hyperdrive, secrets, KV, etc.

## Bun — local / VPS

```ts
// app/api/server.node.ts
import { defineServer } from '@tenora/server/runtime/node';

export default defineServer({ config, createRouter, providers: registerProviders });
// → { port, fetch } — Bun auto-serve default export
```

`.env` cần:

```env
RUNTIME=node
PORT=3001
DATABASE_URL=postgresql://...
```

### pnpm + Bun

`tenora-api dev:node` symlink deps từ repo root vào `packages/server/node_modules` (pnpm hoisting). Nếu Bun báo missing module, chạy lại `dev:node` hoặc xóa symlink cũ.

## Chọn runtime trong config

`tenora.config.ts` đọc `RUNTIME`:

```ts
const runtime = envFirst(['RUNTIME'], 'worker') === 'node' ? 'node' : 'worker';

export default defineTenoraConfig({
  runtime: { target: runtime },
  app: { port: runtime === 'node' ? 3001 : 8787 },
  database: {
    pool: databasePoolForRuntime(runtime, DEFAULT_DATABASE_POOL),
  },
});
```

## Deploy

| Target | Command |
|--------|---------|
| Cloudflare Worker | `pnpm --filter api deploy` |
| Bun VPS | build + `bun server.node.ts` (process manager tùy bạn) |

## Cùng codebase

`createRouter`, `providers`, `tenora.config.ts` **dùng chung** giữa hai entry — chỉ đổi import runtime và file entry.
