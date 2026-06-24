# Hướng dẫn customize

Tóm tắt **chỗ nào sửa** cho từng nhu cầu — không cần đụng `packages/` trừ khi đóng góp framework.

## Ma trận customize

| Muốn làm                   | File / hook                             | Doc                                  |
| -------------------------- | --------------------------------------- | ------------------------------------ |
| Đổi port, DB, auth, cache  | `app/api/tenora.config.ts` + `.env`     | [Configuration](../configuration.md) |
| Thêm controller/repository | `app/api/controllers/`, `repositories/` | [Sync](./api/sync.md)                |
| Thêm API route             | `app/api/routers/*.routes.ts`           | [Sync](./api/sync.md)                |
| Đổi runtime local          | Dùng `server.node.ts` + `dev:node`      | [Runtime](./api/runtime.md)          |
| Deploy Worker              | `wrangler.jsonc` + `server.ts`          | [Runtime](./api/runtime.md)          |
| Thêm web page              | `app/web/routers/`                      | [Web routes](../web/routes.md)       |
| Đổi theme / port web       | `app/web/tenora.config.ts`              | [Web overview](../web/overview.md)   |

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
import { BaseRepository } from '@tenora/server/http';
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

  index = async (c: Context<BackendEnv>) => {
    return this.json(c, { data: await this.posts.findAll() });
  };
}
```

### 4. Routes

```ts
// app/api/routers/posts.routes.ts
import { defineGroup } from '@tenora/server/routers';
import { bindContainerController } from '@tenora/server/http';

export const postsRoutes = defineGroup({
  path: '/posts',
  endpoints: [
    {
      method: 'GET',
      handler: bindContainerController('PostController', 'index'),
    },
  ],
});
```

`tenora-api sync` tự đăng ký DI + merge routes — **không cần** `providers/index.ts`.

### 5. Dev

```bash
pnpm --filter api dev   # sync → wrangler
```

### 6. Typecheck

Thêm path vào `app/api/tsconfig.json` nếu tạo thư mục mới:

```json
"include": ["server.ts", "server.node.ts", "tenora.config.ts", "routers", "providers", "controllers", "repositories"]
```

## Workflow: override framework controller

Framework đăng ký `UserController` trong boot. Override bằng cách đăng ký lại cùng key **sau** trong `registerProviders` (app providers chạy sau `registerFrameworkBindings`):

```ts
ctx.controllers.singleton('UserController', () => new MyUserController(...));
```

## Workflow: chỉ dùng app routes

Không cần làm gì — sync sinh empty router, boot vẫn merge framework routes (`/health`, …).

## Workflow: web page gọi API mới

```tsx
// app/web/routers/posts/page.tsx
import { useLoaderData } from 'react-router';
import { apiFetch } from '@tenora/client/hooks/use-api';

export async function loader() {
  return apiFetch({ path: '/posts' });
}

export default function PostsPage() {
  const data = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Đảm bảo API chạy và proxy đúng `api.port` trong `app/web/tenora.config.ts`.

## Nguyên tắc

1. **Config = cấu trúc**, `.env` = giá trị
2. **Entry file** chọn runtime (cloud / node)
3. **Convention + sync** — thêm `*-controller.ts`, `*-repository.ts`, `*.routes.ts`
4. **Repository trước, Controller sau** — sync tự match theo base name
5. **Arrow methods** trên controller cho `bindContainerController`

## Đọc thêm

- [Kiến trúc](../architecture.md)
- [API overview](./api/overview.md)
- [Controller → Repository](./api/controllers-repositories.md)
