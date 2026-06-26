# Sync convention

Codegen tự chạy trong `pnpm build` / `pnpm deploy` khi chưa có `api/services.ts` hoặc `api/router.ts`.

## Manual (khuyến nghị)

```text
app/api/
  services.ts      → registerServices
  router.ts        → createAppRouter
  permissions.ts   → resolvePermissions
```

`app/worker.ts` import trực tiếp các file trên.

## Convention-only (sync tự sinh)

Thêm file theo pattern — sync ghi `services.ts` / `router.ts` nếu chưa có:

| File | Export |
|------|--------|
| `post-controller.ts` | `PostController` |
| `post-repository.ts` | `PostRepository` |
| `routers/posts.routes.ts` | `postsRoutes` |

Override thủ công: giữ `services.ts` / `router.ts` — sync bỏ qua.
