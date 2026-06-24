# `@tenora/server`

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
├── configs/           # TenoraServerConfig
└── scripts/           # tenora-api sync
```

## Exports chính

| Path | Symbols |
|------|---------|
| `@tenora/server/runtime/cloud` | `defineServer`, `ServerOptions` |
| `@tenora/server/container` | `RegisterServices`, `ServiceRegistryContext` |
| `@tenora/server/routers` | `composeRouter`, `defineGroup`, `RouteGroup` |
| `@tenora/server/http` | `resolveController`, `BaseController` |
| `@tenora/server/middlewares` | `requireSession`, `BackendEnv` |
| `@tenora/server/permissions` | `UserPolicy`, `PermissionResolver` |
| `@tenora/server/assembly` | `createHttpApp` |
