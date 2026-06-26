# Kiến trúc

## Monorepo

```text
app/worker.ts  →  /api/* (app/api)  +  /* (SSR + assets)
app/           →  shell ứng dụng (một package)
packages/      →  framework (@duneta/server, @duneta/client)
```

Web **không** import `@duneta/server` — gọi API qua `/api` same-origin.

## Request routing

```text
GET /api/health  →  Hono (basePath /api)
GET /about       →  React Router SSR
GET /assets/*    →  ASSETS binding
```

## Boot API

`defineServer()` bootstrap trong `app/worker.ts` — không có `server.ts` riêng, không deploy API riêng.

| Hook | File |
|------|------|
| `config` | `app/duneta.config.ts` (`export const api`) |
| `createAppRouter` | `app/api/router.ts` |
| `registerServices` | `app/api/services.ts` |
| `resolvePermissions` | `app/api/permissions.ts` |

## Runtime

Chỉ Cloudflare Worker. Config: `wrangler.jsonc` · Entry: `app/worker.ts`.
