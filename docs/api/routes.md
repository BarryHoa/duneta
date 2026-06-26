# Routes & `createAppRouter`

## App hook

`routers/index.ts` export `createAppRouter(config)` — ghép framework + app routes.

```ts
import { composeRouter, defineGroup, resolveController } from '@duneta/server/routers';
import { requireSession } from '@duneta/server/middlewares';
```

## `defineGroup`

```ts
export const postsRoutes = defineGroup({
  path: '/posts',
  middleware: [requireSession()],
  endpoints: [
    { method: 'GET', handler: resolveController('PostController', 'index') },
  ],
});
```

## `resolveController`

```ts
resolveController('UserController', 'index')
// → controllers.resolve('UserController').index(c)
```

Controller method phải là **arrow property** (`index = async (c) =>`).

## Framework vs app

| API | Layer | Input |
|-----|-------|-------|
| `composeRouter(groups)` | Framework | `RouteGroup[]` |
| `createAppRouter(config)` | App | `DunetaServerConfig` |

Mọi route mount dưới `/api` (`createHttpApp`).
