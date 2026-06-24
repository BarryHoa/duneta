# Routes & `createRouter`

## Hook `createRouter`

File: `app/api/routers/index.ts`

```ts
import type { TenoraServerConfig } from '@tenora/server/configs';
import { createDefaultRouter } from '@tenora/server/routers';

export function createRouter(config: TenoraServerConfig) {
  return createDefaultRouter(config);
}
```

`createDefaultRouter` tự thêm route theo feature flags (`isAuthEnabled`, `isDatabaseEnabled`).

## `defineGroup` — khai báo route

```ts
import { defineGroup, createRouter } from '@tenora/server/routers';
import { bindContainerController } from '@tenora/server/http';
import { requireAuth } from '@tenora/server/middlewares';

export const postsRoutes = defineGroup({
  path: '/posts',
  middleware: [requireAuth()],
  endpoints: [
    { method: 'GET', handler: bindContainerController('PostController', 'index') },
    { method: 'GET', path: '/:id', handler: bindContainerController('PostController', 'show') },
    { method: 'POST', handler: bindContainerController('PostController', 'create') },
  ],
});
```

### Cấu trúc `RouterGroup`

| Field | Mô tả |
|-------|-------|
| `path` | Mount path (tương đối parent) |
| `middleware` | Middleware cho group |
| `endpoints` | `{ method, path?, handler }` |
| `children` | Nested groups |

## Custom router — thay default

```ts
import { createRouter, defineGroup } from '@tenora/server/routers';
import { createDefaultRouter } from '@tenora/server/routers';
import { postsRoutes } from './posts.routes';

export function createRouter(config: TenoraServerConfig) {
  const base = createDefaultRouter(config);

  const extra = createRouter([postsRoutes]);
  base.route('/', extra);

  return base;
}
```

Hoặc build từ đầu:

```ts
export function createRouter(config: TenoraServerConfig) {
  const groups = [healthRoutes, postsRoutes];
  if (isAuthEnabled(config)) groups.push(meRoutes);
  return createRouter(groups);
}
```

## `bindContainerController`

Resolve controller lazy từ `ControllerContainer`:

```ts
bindContainerController('UserController', 'index')
// → c.get('controllers').resolve('UserController').index(c)
```

Controller phải được đăng ký trong `providers/index.ts`.

## Middleware trên route

```ts
import { requireAuth } from '@tenora/server/middlewares';

defineGroup({
  path: '/admin',
  middleware: [requireAuth()],
  endpoints: [...],
});
```

## Base path

Tất cả route app mount dưới `/api` (set trong `createTenoraApp`). Group path `/health` → `GET /api/health`.
