# API app (`app/api`)

## Cấu trúc

```text
app/api/
├── router.ts          # createAppRouter
├── services.ts        # registerServices (DI)
├── permissions.ts     # resolvePermissions
├── controllers/       # *-controller.ts (sync)
├── repositories/      # *-repository.ts (sync)
└── routers/           # *.routes.ts (sync)
```

Config API + web: `app/duneta.config.ts` (`export const api` + `export default`).

## Entry

API bootstrap trong `app/worker.ts` — import `router.ts`, `services.ts`, `permissions.ts`, gọi `defineServer` cho `/api/*`.

## Hooks

| Hook | File | Vai trò |
|------|------|---------|
| `registerServices` | `services.ts` | DI controllers + repositories |
| `createAppRouter` | `router.ts` | Route groups |
| `resolvePermissions` | `permissions.ts` | Grants / roles sau login |

Chi tiết: [services](./services.md), [sync](./sync.md), [runtime](./runtime.md).
