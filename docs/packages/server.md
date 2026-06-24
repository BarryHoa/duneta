# `@tenora/server`

Framework Hono API — config, middleware, auth, database, DI, runtime.

## Cấu trúc package

```text
packages/server/
├── configs/           # defineTenoraConfig, env, cache, rate-limit
├── runtime/
│   ├── cloud/         # defineServer → { fetch }
│   ├── node/          # defineServer → { port, fetch }
│   └── shared/        # boot, types, bindings
├── container/         # ControllerContainer, RepositoryContainer
├── app/               # createTenoraApp, wire-context
├── middlewares/       # CORS, CSRF, rate-limit, auth, locale
├── routers/           # defineGroup, createRouter, defaults
├── http/              # BaseController, bindContainerController
├── repositories/      # UserRepository, auth schemas
├── auth/              # Better Auth factory
├── database/          # Drizzle pg / worker
├── cache/             # memory, redis HTTP
├── cached/            # global cache facade
└── scripts/
    └── tenora-api.mjs # CLI bin
```

## Public exports

| Path | Nội dung |
|------|----------|
| `@tenora/server/configs` | Config types, `defineTenoraConfig`, `env`, helpers |
| `@tenora/server/container` | DI containers, `registerDefaultBindings` |
| `@tenora/server/routers` | `defineGroup`, `createRouter`, `createDefaultRouter` |
| `@tenora/server/http` | `BaseController`, `BaseRepository`, `bindContainerController` |
| `@tenora/server/middlewares` | `requireAuth`, CSRF, rate-limit factories |
| `@tenora/server/repositories` | Built-in repositories |
| `@tenora/server/auth` | Auth types, session resolve |
| `@tenora/server/database` | DB factory |
| `@tenora/server/cache` | Cache factory |
| `@tenora/server/cached` | Global `cached` facade |
| `@tenora/server/runtime/cloud` | `defineServer` for Worker |
| `@tenora/server/runtime/node` | `defineServer` for Bun |

## Build

```bash
pnpm --filter @tenora/server build   # tsc → dist/
pnpm --filter @tenora/server typecheck
```

Runtime entries (`runtime/cloud`, `runtime/node`) ship source `.ts` — Wrangler/Bun bundle trực tiếp.

Configs cũng export source `.ts` cho `tenora.config.ts` typecheck.

## Phát triển framework

- Thêm default controller: `http/controllers/` + `container/bindings.ts` + `routers/defaults.ts`
- Thêm middleware: `middlewares/` + wire trong `create-app.ts` hoặc `middlewares/core.ts`
- Thêm config section: `configs/types.ts` + `defaults.ts` + `merge.ts`

## Tài liệu app

- [API overview](../api/overview.md)
- [Architecture](../architecture.md)
