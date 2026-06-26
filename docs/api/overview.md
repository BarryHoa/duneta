# API app (`app/api`)

## Cấu trúc

```text
app/api/
├── server.ts              # Cloud Worker entry
├── server.node.ts         # Bun/Node entry
├── duneta.config.ts       # Config
├── services/index.ts      # registerServices (DI)
├── routers/index.ts       # createAppRouter
├── permissions/index.ts   # resolvePermissions
├── controllers/           # *-controller.ts (sync)
├── repositories/          # *-repository.ts (sync)
└── routers/*.routes.ts    # route groups (sync)
```

## Entry

```ts
import { defineServer } from '@duneta/server/runtime/worker';
import { resolvePermissions } from './permissions';
import config from './duneta.config';
import { createAppRouter } from './routers';
import { registerServices } from './services';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
```

## Hooks

| Hook | File | Vai trò |
|------|------|---------|
| `registerServices` | `services/index.ts` | DI controllers + repositories |
| `createAppRouter` | `routers/index.ts` | Route groups |
| `resolvePermissions` | `permissions/index.ts` | Grants / roles sau login |

Chi tiết: [services](./services.md), [sync](./sync.md), [runtime](./runtime.md).
