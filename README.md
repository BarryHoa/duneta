# Tenora

Portable TypeScript toolkit: React Router web shell, Hono API, and two publishable packages.

```bash
pnpm install
pnpm dev
```

```text
app/api   → @tenora/server
app/web   → @tenora/client
```

## Config (3 layers — Laravel-style)

```text
1. @tenora/server defaults     → framework baseline (global)
2. app/api/tenora.config.ts    → app-global structure (you edit this)
3. .env / wrangler secrets     → values only (URLs, secrets)
```

`tenora.config.ts` declares structure per TypeScript types; `.env` only supplies values via `env()`:

```ts
import { defineTenoraConfig, env, redisCache, postgresConnection } from '@tenora/server/configs';

export default defineTenoraConfig({
  runtime: { target: 'worker' },
  database: {
    enabled: true,
    default: 'primary',
    connections: { primary: postgresConnection({ url: env('DATABASE_URL') }) },
    pool: { max: 10, idleTimeout: 20, connectTimeout: 10 },
  },
  cache: redisCache({ url: env('CACHE_URL'), token: env('CACHE_TOKEN') }),
  security: { rateLimit: { enabled: true, rules: [...] } },
});
```

Runtime access: `import { config, getConfig } from '@tenora/server/configs'`.

Minimal `.env`:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
CACHE_URL=https://...      # any HTTP Redis provider
CACHE_TOKEN=...
```

Cache flow: configure in `tenora.config.ts` → use `cached` anywhere.

```ts
import { cached } from '@tenora/server/cached';

await cached.set('key', 'value', 60_000);
await cached.get('key');
await cached.has('key');
```

```ts
// tenora.config.ts — typed per driver, default enabled: false
cache: redisCache({ url: env('CACHE_URL'), token: env('CACHE_TOKEN') }),
// cache: memoryCache(),
// cache: redisCache({ url, token }),
```

## API layout (`app/api`) — dual runtime

```text
server.ts              # cloud — Wrangler / Vercel (`runtime/cloud`)
server.node.ts         # Bun VPS/local (`runtime/node`)
tenora.config.ts       # RUNTIME=worker|node switches pool/port
routers/index.ts
wrangler.jsonc
```

**Cloud** (`server.ts`):

```ts
import { defineServer } from '@tenora/server/runtime/cloud';
export default defineServer({ config, createRouter });
```

**Bun / VPS** (`server.node.ts`):

```ts
import { defineServer } from '@tenora/server/runtime/node';
export default defineServer({ config, createRouter });
```

`.env` for local Bun: `RUNTIME=node` + `PORT=3001`.

Default controllers & routes ship in `@tenora/server`:

| Controller | Route | Requires |
|---|---|---|
| `HealthController` | `GET /api/health` | — |
| `MeController` | `GET /api/me` | auth |
| `UserController` | `GET /api/users` | auth + database |

Override by registering your own bindings or adding route groups in `routers/index.ts`.

Layer: **Controller → Repository**. Better Auth mounts when `auth.enabled: true`.

## Web layout (`app/web`)

```text
tenora.config.ts
routers/               # overrides package default routes
themes/globals.css
```

Default routes live in `packages/client/routers/` and merge into `.router-runtime/` at dev/build.

## Commands

```bash
pnpm dev                          # web :3000 + api wrangler :8787
pnpm --filter api dev:node        # Bun local :3001 (RUNTIME=node)
pnpm --filter api dev             # API wrangler only
pnpm --filter api deploy          # wrangler deploy
pnpm --filter web dev             # web only
pnpm --filter @tenora/server build
pnpm --filter @tenora/client build
```
