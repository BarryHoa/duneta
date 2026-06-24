# Routes & `createRouter`

## Hook `createRouter`

File generated: `.api-runtime/router.generated.ts` — re-export từ `routers/index.ts`.

Default routes (`/health`, `/me`, `/users`) khai báo trong **`routers/index.ts`** — bật `/me`, `/users` theo feature flags auth/database.

```ts
import { createRouter, defineGroup } from '@tenora/server/routers';
import { bindContainerController } from '@tenora/server/http';
```

Route groups theo feature flags: `isAuthEnabled` / `isDatabaseEnabled` trong `routers/index.ts`.

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

## Custom router — thêm app routes

```ts
import { createRouter, defineGroup } from '@tenora/server/routers';
import { postsRoutes } from './posts.routes';

export function createRouter(_config: TenoraServerConfig) {
  return createRouter([postsRoutes]);
}
```

Hoặc dùng `routers/posts.routes.ts` + sync — boot vẫn merge framework routes.

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
