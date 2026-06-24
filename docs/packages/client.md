# `@tenora/client`

Framework React Router web — config, default routes, UI components, `tenora-web` CLI.

## Cấu trúc package

```text
packages/client/
├── configs/           # defineTenoraConfig, env, load
├── config/
│   ├── vite.ts        # createViteConfig
│   └── react-router.ts
├── routers/           # default routes + layout
├── components/        # Ibase* UI wrappers
├── providers/         # ThemeProvider
├── hooks/             # use-api, link helpers
├── themes/            # default CSS tokens
└── scripts/
    ├── tenora-web.mjs
    └── sync-routers.mjs
```

## Public exports (chọn lọc)

| Path | Nội dung |
|------|----------|
| `@tenora/client/configs` | Web config types, `defineTenoraConfig` |
| `@tenora/client/config/vite` | `createViteConfig` |
| `@tenora/client/config/react-router` | `createReactRouterConfig` |
| `@tenora/client/routers` | Default route modules |
| `@tenora/client/providers` | `ThemeProvider` |
| `@tenora/client/hooks/use-api` | `apiFetch` helper |
| `@tenora/client/components/*` | UI components |

## Router sync

`sync-routers.mjs` copy/merge:

1. `packages/client/routers/**`
2. `app/web/routers/**` (override)

→ `app/web/.router-runtime/`

Chạy tự động qua `tenora-web dev|build|typegen`.

## Build

```bash
pnpm --filter @tenora/client build
pnpm --filter @tenora/client typecheck
```

## Phát triển framework

- Thêm default page: `routers/` trong package
- Thêm component: `components/` + export trong `package.json` exports
- Thêm config field: `configs/types.ts` + `defaults.ts`

## Tài liệu app

- [Web overview](../web/overview.md)
- [Web routes](../web/routes.md)
