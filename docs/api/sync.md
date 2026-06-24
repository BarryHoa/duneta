# Sync & `.api-runtime`

Cloudflare Worker không có filesystem lúc runtime — Tenora **scan lúc build/dev** (Node) và sinh code tĩnh, giống `tenora-web` → `.router-runtime/`.

## Flow

```text
app/api/controllers/*.ts
app/api/repositories/*.ts
app/api/routers/*.routes.ts
         ↓  tenora-api sync (Node)
app/api/.api-runtime/
  providers.generated.ts
  router.generated.ts
  index.ts
         ↓  wrangler / bun bundle
Worker chạy static imports
```

## Chạy sync

Tự động trước `dev`, `deploy`, `dev:node`, `typecheck`:

```bash
pnpm --filter api dev
pnpm --filter api typecheck
```

Thủ công:

```bash
pnpm --filter api exec tenora-api sync
```

## File generated

### `providers.generated.ts`

- Chỉ đăng ký app `*-repository.ts` + `*-controller.ts`
- Framework (Health, Me, User) wire trong **boot** — không qua file này

### `router.generated.ts`

- Chỉ app `*.routes.ts` (hoặc empty `Hono()`)
- Framework routes (`/health`, `/me`, `/users`) wire trong **boot**

### `index.ts`

Re-export `registerProviders`, `createRouter` cho `server.ts`.

## Convention đặt tên

| File | Class / export |
|------|----------------|
| `post-controller.ts` | `export class PostController` |
| `post-repository.ts` | `export class PostRepository` |
| `posts.routes.ts` | `export const postsRoutes = defineGroup(...)` |

## Override thủ công

Nếu cần logic DI/routing custom hoàn toàn:

```text
app/api/providers/index.ts   → sync re-export thay vì scan
app/api/routers/index.ts     → sync re-export thay vì scan
```

## Thêm feature — checklist

1. `repositories/post-repository.ts`
2. `controllers/post-controller.ts`
3. `routers/posts.routes.ts`
4. `pnpm --filter api dev` (sync tự chạy)

Không sửa `.api-runtime/` — file bị ghi đè mỗi sync.

## Git

`.api-runtime/` trong `.gitignore` — CI chạy `tenora-api sync` trước build/deploy.
