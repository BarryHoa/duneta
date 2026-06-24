# Providers & DI

## Tổng quan

`providers` là hook thứ 3 của `defineServer` — đăng ký **controller** và **repository** vào DI container.

```ts
defineServer({
  config,
  createRouter,
  providers: registerProviders, // app/api/providers/index.ts
});
```

Nếu bỏ `providers`, framework dùng `registerDefaultBindings` (Health, Me, User).

## `BindingContext`

```ts
import type { RegisterBindings } from '@tenora/server/container';

export type BindingContext = {
  controllers: ControllerContainer;
  repositories: RepositoryContainer;
  db: Database | null;
  config: TenoraServerConfig;
};

export type RegisterBindings = (ctx: BindingContext) => void;
```

## File mặc định

```ts
// app/api/providers/index.ts
import type { RegisterBindings } from '@tenora/server/container';
import { registerDefaultBindings } from '@tenora/server/container';

export const registerProviders: RegisterBindings = (ctx) => {
  registerDefaultBindings(ctx);
};
```

## Thứ tự đăng ký (quan trọng)

1. **Repositories** — cần `db`
2. **Controllers** — inject repository từ `repositories.resolve()`

Framework tách sẵn trong `registerDefaultBindings`:

```ts
registerDefaultRepositories(ctx.repositories, ctx.db);
registerDefaultControllers(ctx.controllers, ctx.repositories);
```

## Custom — thêm domain mới

```ts
import type { RegisterBindings } from '@tenora/server/container';
import { registerDefaultBindings } from '@tenora/server/container';
import { PostRepository } from '../repositories/post-repository';
import { PostController } from '../controllers/post-controller';

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

## Lazy singleton

`singleton()` chỉ **đăng ký factory** — instance tạo lần đầu `resolve()` được gọi.

100 controller đăng ký ≠ 100 instance ngay lúc boot.

## Resolve trong handler

| Cần | Cách lấy |
|-----|----------|
| Controller | `bindContainerController('Key', 'method')` |
| Repository trong controller | Inject qua constructor lúc `providers` |
| Repository trong middleware | `c.get('repositories').resolve('UserRepository')` |
| DB | `c.get('db')` |
| Auth session | `BaseController.resolveSession(c)` |

## Hai container tách biệt

```text
ControllerContainer     RepositoryContainer
├── HealthController    ├── UserRepository
├── MeController        └── PostRepository (custom)
└── UserController
```

Infra (`db`, `auth`, `cache`) **không** nằm trong container — inject trực tiếp qua `wireRequestContext`.

## Override controller mặc định

```ts
export const registerProviders: RegisterBindings = (ctx) => {
  registerDefaultRepositories(ctx.repositories, ctx.db);

  // Override UserController
  ctx.controllers.singleton(
    'UserController',
    () => new MyUserController(ctx.repositories.resolve('UserRepository')),
  );

  // Giữ Health + Me từ default
  ctx.controllers.singleton('HealthController', () => new HealthController());
  ctx.controllers.singleton('MeController', () => new MeController());
};
```

Hoặc fork hoàn toàn — không gọi `registerDefaultBindings`.
