# Hướng dẫn customize

Tóm tắt **chỗ nào sửa** cho từng nhu cầu — không cần đụng `packages/` trừ khi đóng góp framework.

## Ma trận customize

| Muốn làm                   | File / hook                             | Doc                                  |
| -------------------------- | --------------------------------------- | ------------------------------------ |
| Đổi port, DB, auth, cache  | `app/api/duneta.config.ts` + `.env`     | [Configuration](../configuration.md) |
| Thêm controller/repository | `app/api/controllers/`, `repositories/` | [Sync](./api/sync.md)                |
| Thêm API route             | `app/api/routers/*.routes.ts`           | [Sync](./api/sync.md)                |
| Đổi runtime local          | Dùng `server.node.ts` + `dev:node`      | [Runtime](./api/runtime.md)          |
| Deploy Worker              | `wrangler.jsonc` + `server.ts`          | [Runtime](./api/runtime.md)          |
| Thêm web page              | `app/web/routers/`                      | [Web routes](../web/routes.md)       |
| Đổi theme / port web       | `app/web/duneta.config.ts`              | [Web overview](../web/overview.md)   |

## Workflow: thêm feature API mới

Ví dụ: `GET /api/posts`

### 1. Schema (nếu table mới)

```ts
// app/api/repositories/schemas/post.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const post = pgTable('post', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 2. Repository

```ts
// app/api/repositories/post-repository.ts
import { BaseRepository } from '@duneta/server/http';
import { post } from './schemas/post';

export class PostRepository extends BaseRepository<typeof post> {
  constructor(db: Database) {
    super(db, post);
  }
}
```

### 3. Controller

```ts
// app/api/controllers/post-controller.ts
export class PostController extends BaseController {
  constructor(private readonly posts: PostRepository) {
    super();
  }

  index = async (c: Context<RequestContext>) => {
    return this.json(c, { data: await this.posts.findAll() });
  };
}
```

### 4. Routes

```ts
// app/api/routers/posts.routes.ts
import { defineGroup } from '@duneta/server/routers';
import { resolveController } from '@duneta/server/http';
import { requireSession } from '@duneta/server/middlewares';

export const postsRoutes = defineGroup({
  path: '/posts',
  middleware: [requireSession()],
  endpoints: [
    { method: 'GET', handler: resolveController('PostController', 'index') },
  ],
});
```

`duneta-api sync` tự đăng ký DI + merge routes — hoặc thêm vào `services/index.ts` / `routers/index.ts`.

### 5. Dev

```bash
pnpm --filter api dev   # sync → wrangler
```

### 6. Typecheck

Thêm path vào `app/api/tsconfig.json` nếu tạo thư mục mới:

```json
"include": ["server.ts", "server.node.ts", "duneta.config.ts", "services", "routers", "permissions", "controllers", "repositories"]
```

Override trong `services/index.ts` — đăng ký lại cùng key:

```ts
ctx.controllers.singleton('UserController', () => new MyUserController(...));
```

## Workflow: default routes

Default routes trong `routers/index.ts` (`healthRoutes`, `usersRoutes`, …).

## Workflow: web page gọi API mới

```tsx
// app/web/routers/posts/page.tsx
import { useLoaderData } from 'react-router';
import { apiFetch } from '@duneta/client/hooks/use-api';

export async function loader() {
  return apiFetch({ path: '/posts' });
}

export default function PostsPage() {
  const data = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Đảm bảo API chạy và proxy đúng `api.port` trong `app/web/duneta.config.ts`.

## Nguyên tắc

1. **Config = cấu trúc**, `.env` = giá trị
2. **Entry file** chọn runtime (cloud / node)
3. **Convention + sync** — thêm `*-controller.ts`, `*-repository.ts`, `*.routes.ts`
4. **Repository trước, Controller sau** — sync tự match theo base name
5. **Arrow methods** trên controller cho `resolveController`

## Đọc thêm

- [Kiến trúc](../architecture.md)
- [API overview](./api/overview.md)
- [Controller → Repository](./api/controllers-repositories.md)
