# Hướng dẫn customize

Tóm tắt **chỗ nào sửa** cho từng nhu cầu — không cần đụng `packages/` trừ khi đóng góp framework.

## Ma trận customize

| Muốn làm | File / hook | Doc |
|----------|-------------|-----|
| Đổi port, DB, auth, cache | `app/api/tenora.config.ts` + `.env` | [Configuration](../configuration.md) |
| Thêm/sửa API route | `app/api/routers/` | [Routes](./api/routes.md) |
| Thêm controller/repository | `app/api/providers/` + controllers/repos | [Providers](./api/providers.md) |
| Đổi runtime local | `RUNTIME=node` + `server.node.ts` | [Runtime](./api/runtime.md) |
| Deploy Worker | `wrangler.jsonc` + `server.ts` | [Runtime](./api/runtime.md) |
| Thêm web page | `app/web/routers/` | [Web routes](../web/routes.md) |
| Đổi theme / port web | `app/web/tenora.config.ts` | [Web overview](../web/overview.md) |

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
  constructor(private readonly posts: PostRepository) { super(); }

  index = async (c: Context<BackendEnv>) => {
    return this.json(c, { data: await this.posts.findAll() });
  };
}
```

### 4. Providers

```ts
// app/api/providers/index.ts
export const registerProviders: RegisterBindings = (ctx) => {
  registerDefaultBindings(ctx);
  if (!ctx.db) return;

  ctx.repositories.singleton('PostRepository', () => new PostRepository(ctx.db!));
  ctx.controllers.singleton(
    'PostController',
    () => new PostController(ctx.repositories.resolve('PostRepository')),
  );
};
```

### 5. Routes

```ts
// app/api/routers/posts.routes.ts
import { defineGroup } from '@tenora/server/routers';
import { bindContainerController } from '@tenora/server/http';

export const postsRoutes = defineGroup({
  path: '/posts',
  endpoints: [
    { method: 'GET', handler: bindContainerController('PostController', 'index') },
  ],
});

// app/api/routers/index.ts
import { createRouter, createDefaultRouter } from '@tenora/server/routers';
export function createRouter(config: TenoraServerConfig) {
  const app = createDefaultRouter(config);
  app.route('/', createRouter([postsRoutes]));
  return app;
}
```

### 6. Typecheck

Thêm path vào `app/api/tsconfig.json` nếu tạo thư mục mới:

```json
"include": ["server.ts", "server.node.ts", "tenora.config.ts", "routers", "providers", "controllers", "repositories"]
```

## Workflow: override route mặc định

Giữ `createDefaultRouter` nhưng thay controller:

```ts
// providers — đăng ký MyUserController thay UserController
ctx.controllers.singleton('UserController', () => new MyUserController(...));
```

Route `bindContainerController('UserController', ...)` tự trỏ controller mới.

## Workflow: bỏ route mặc định

Không gọi `createDefaultRouter` — build `createRouter([...])` từ đầu với groups bạn chọn.

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
2. **3 hook server**: `config`, `createRouter`, `providers`
3. **Không sửa `packages/`** cho logic domain — chỉ `app/`
4. **Repository trước, Controller sau** trong `providers`
5. **Arrow methods** trên controller cho `bindContainerController`

## Đọc thêm

- [Kiến trúc](../architecture.md)
- [API overview](./api/overview.md)
- [Controller → Repository](./api/controllers-repositories.md)
