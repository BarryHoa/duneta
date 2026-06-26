# Services (DI)

Đăng ký **controller** và **repository** qua `registerServices` trong `services/index.ts`.

```ts
import { createAppRouter } from './routers';
import { registerServices } from './services';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
```

## `ServiceRegistryContext`

```ts
import type { RegisterServices } from '@duneta/server/container';

export const registerServices: RegisterServices = (ctx) => {
  ctx.repositories.singleton('PostRepository', () => new PostRepository(ctx.db!));
  ctx.controllers.singleton(
    'PostController',
    () => new PostController(ctx.repositories.resolve('PostRepository')),
  );
};
```

## Convention + sync

Thêm `*-controller.ts`, `*-repository.ts` → `duneta-api sync` tự sinh `services/index.ts` nếu chưa có.

Override thủ công: giữ `services/index.ts` — sync bỏ qua.

## Resolve trong handler

| Cần | Cách |
|-----|------|
| Controller | `resolveController('PostController', 'index')` |
| Repository | Inject constructor trong `registerServices` |
| DB | `c.get('db')` |

Infra (`db`, `auth`, `cache`) không nằm container — inject qua `attachRequestServices`.
