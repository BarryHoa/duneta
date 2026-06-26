# Duneta

Monorepo: `app/api` (backend), `app/web` (frontend), `packages/server`, `packages/client`.

## API entry

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

## Thêm feature API

1. `repositories/post-repository.ts`
2. `controllers/post-controller.ts`
3. `routers/posts.routes.ts` hoặc thêm vào `routers/index.ts`
4. `pnpm --filter api dev`

Chi tiết: [docs/architecture.md](docs/architecture.md)
