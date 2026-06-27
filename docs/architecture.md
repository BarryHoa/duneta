# Kiến trúc

## Monorepo

```text
worker.ts          →  /api/* (app/api)  +  /* (SSR + assets)
duneta.config.ts   →  unified web + API config
app/               →  source only (pages, api, themes)
packages/          →  framework (@duneta/server, @duneta/client)
```

Web **không** import `@duneta/server` — gọi API qua `/api` same-origin.

## Request routing

```text
GET /api/health  →  Hono (basePath /api)
GET /about       →  React Router SSR
GET /assets/*    →  ASSETS binding
```

## Boot API

`defineServer()` bootstrap trong `worker.ts` — không có `server.ts` riêng, không deploy API riêng.

| Hook | File |
|------|------|
| `config` | `duneta.config.ts` (`export default`) |
| `createAppRouter` | `app/api/router.ts` |
| `registerServices` | `app/api/services.ts` |
| `resolvePermissions` | `app/api/permissions.ts` |

## Runtime

Chỉ Cloudflare Worker. Config: `wrangler.jsonc` · Entry: `worker.ts`.

## Cloudflare constraints

| Concern | Duneta approach |
|---------|-----------------|
| Logging | JSON stdout — no log files |
| Database | Postgres via Hyperdrive / `DATABASE_URL` |
| Cache | Memory (dev) or Redis HTTP (prod) |
| Sessions | Postgres (Better Auth) |
| Static files | `ASSETS` binding, not disk writes |
