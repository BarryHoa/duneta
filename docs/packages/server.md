# `@duneta/server`

## Cấu trúc

```text
packages/server/
├── assembly/          # createHttpApp, attachRequestServices
├── runtime/           # defineServer, boot, PlatformEnv
├── container/         # RegisterServices, DI containers
├── routers/           # composeRouter, defineGroup, RouteGroup
├── http/              # BaseController, resolveController
├── permissions/       # grants, policies, PermissionCheck
├── middlewares/       # requireSession, CSRF, rate-limit
├── auth/              # Better Auth (login — không phải DI)
├── configs/           # DunetaServerConfig
└── scripts/           # sync-api.mjs (gọi từ scripts/duneta.mjs)
```

## Exports chính

| Path | Symbols |
|------|---------|
| `@duneta/server/runtime/worker` | `defineServer`, `ServerOptions` |
| `@duneta/server/container` | `RegisterServices`, `ServiceRegistryContext` |
| `@duneta/server/routers` | `composeRouter`, `defineGroup`, `RouteGroup` |
| `@duneta/server/http` | `resolveController`, `BaseController` |
| `@duneta/server/middlewares` | `requireSession`, `RequestContext` |
| `@duneta/server/permissions` | `UserPolicy`, `PermissionResolver` |
| `@duneta/server/assembly` | `createHttpApp` |
