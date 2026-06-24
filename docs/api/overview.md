# API app (`app/api`)

## Cấu trúc

```text
app/api/
├── server.ts              # Cloud Worker entry
├── server.node.ts         # Bun/Node entry
├── tenora.config.ts       # Config
├── services/index.ts      # registerServices (DI)
├── routers/index.ts       # createAppRouter
├── permissions/index.ts   # resolvePermissions
├── controllers/           # *-controller.ts (sync)
├── repositories/          # *-repository.ts (sync)
├── routers/*.routes.ts    # route groups (sync)
└── .api-runtime/          # generated bridge
```

## Entry

```ts
import { defineServer } from '@tenora/server/runtime/cloud';
import { resolvePermissions } from './permissions';
import config from './tenora.config';
import { createAppRouter, registerServices } from './.api-runtime';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
```

## Hooks

| Hook | Việc |
|------|------|
| `createAppRouter` | Ghép routes theo config |
| `registerServices` | DI controllers/repositories |
| `resolvePermissions` | Role → grants (optional) |

Xem [Sync](./sync.md), [Services](./services.md), [Routes](./routes.md).
