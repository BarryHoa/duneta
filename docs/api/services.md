# Services (DI)

Đăng ký **controller** và **repository** qua `registerServices`.

```ts
import { createAppRouter, registerServices } from './.api-runtime';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
```

## `ServiceRegistryContext`

```ts
import type { RegisterServices } from '@tenora/server/container';

export const registerServices: RegisterServices = (ctx) => {
  ctx.repositories.singleton('PostRepository', () => new PostRepository(ctx.db!));
  ctx.controllers.singleton(
    'PostController',
    () => new PostController(ctx.repositories.resolve('PostRepository')),
  );
};
```

## Convention + sync

Thêm `*-controller.ts`, `*-repository.ts` → `tenora-api sync` tự wire.

Override thủ công: `services/index.ts` — sync re-export từ đó.

## Resolve trong handler

| Cần | Cách |
|-----|------|
| Controller | `resolveController('PostController', 'index')` |
| Repository | Inject constructor trong `registerServices` |
| DB | `c.get('db')` |

Infra (`db`, `auth`, `cache`) không nằm container — inject qua `attachRequestServices`.
