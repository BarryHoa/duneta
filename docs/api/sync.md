# Sync & `.api-runtime`

Codegen trước `dev` / `deploy` / `typecheck`.

## Output

```text
app/api/.api-runtime/
  services.generated.ts   → registerServices
  router.generated.ts       → createAppRouter
  index.ts
```

Manual override: `services/index.ts`, `routers/index.ts` → sync chỉ re-export.

## Convention

| File | Export |
|------|--------|
| `post-controller.ts` | `PostController` |
| `post-repository.ts` | `PostRepository` |
| `posts.routes.ts` | `postsRoutes` |

## `server.ts`

```ts
import { createAppRouter, registerServices } from './.api-runtime';

export default defineServer({
  config,
  createAppRouter,
  registerServices,
  resolvePermissions,
});
```
