# Sync convention

Codegen trước `dev` / `deploy` / `typecheck` khi chưa có `services/index.ts` hoặc `routers/index.ts`.

## Manual (khuyến nghị)

```text
app/api/
  services/index.ts   → registerServices
  routers/index.ts    → createAppRouter
```

`server.ts` import trực tiếp:

```ts
import { createAppRouter } from './routers';
import { registerServices } from './services';
```

## Convention-only (sync tự sinh)

Thêm file theo pattern — sync ghi `services/index.ts` / `routers/index.ts` nếu chưa có:

| File | Export |
|------|--------|
| `post-controller.ts` | `PostController` |
| `post-repository.ts` | `PostRepository` |
| `posts.routes.ts` | `postsRoutes` |

## `defineServer`

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
