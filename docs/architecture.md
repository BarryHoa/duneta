# Kiến trúc

## Ba lớp

| Lớp | Ở đâu | Vai trò |
|-----|-------|---------|
| **Core** | `packages/server`, `packages/client`, `duneta` CLI | Runtime, DI, config, middleware, optional modules (`database`, `auth`, `storage`, …). **Mặc định OFF** — bật trong `duneta.config.ts`. |
| **Build sẵn** | `@duneta/server/routers`, `@duneta/server/http`, `@duneta/server/repositories`, `@duneta/client/routers` | Controller/route/UI reference — import và dùng, hoặc bỏ qua. |
| **User app** | `duneta.config.ts`, `app/api/*`, `app/pages/` | User chọn bật feature nào, mount route nào, register service nào. |

```text
Core (engine)
  └─ optional modules ← duneta.config.ts enabled: true
Build sẵn (reference)
  └─ HealthController, healthRoutes, UserController, … ← import nếu cần
User app
  └─ router.ts mount gì · services.ts register gì · pages/ web
```

App mới (`create-duneta-app`): chỉ `GET /api/health`, không DB/auth. Repo dogfood monorepo bật đủ feature — **một ví dụ**, không phải contract framework.

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
| Database | Postgres — URL trong `duneta.config.ts` |
| Cache | Memory (dev) or Redis HTTP (prod) |
| Sessions | Postgres (Better Auth) |
| Static files | `ASSETS` binding, not disk writes |
