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

## Config

Everything is optional — enable only what you need in `tenora.config.ts`:

```ts
database: { enabled: true, connections: { ... } }
auth: { enabled: true, secret: env('AUTH_SECRET') }
cache: { enabled: true, provider: 'redis' }
security: { rateLimit: { enabled: true } }
logging: { enabled: true, provider: 'file' }
```

## API layout (`app/api`)

```text
tenora.config.ts
server.ts              # Node + Worker entry
providers/index.ts     # registerBindings() + TenoraProvider[]
controllers/           # extend BaseController
repositories/          # extend BaseRepository
routers/               # createRouter + defineGroup
```

```ts
// providers/index.ts
export function registerBindings(container, db) { ... }

// routers
bindContainerController('UserController', 'index'); // from @tenora/server/http
```

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
pnpm dev                          # web :3000 + api :3001
pnpm --filter api dev             # API only
pnpm --filter web dev             # web only
pnpm --filter @tenora/server build
pnpm --filter @tenora/client build
```
