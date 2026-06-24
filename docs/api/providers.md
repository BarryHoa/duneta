# Providers & DI

## Tổng quan

`providers` đăng ký **controller** và **repository** — thường import từ `.api-runtime/` (do `tenora-api sync` sinh ra).

```ts
import { createRouter, registerProviders } from './.api-runtime';
export default defineServer({
  config,
  createRouter,
  providers: registerProviders,
});
```

Bỏ `providers` → noop (framework bindings vẫn wire trong boot).

Xem [Sync & `.api-runtime`](./sync.md).

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

## Generated (mặc định)

`tenora-api sync` sinh `providers.generated.ts` — **chỉ app code**.

Framework controllers (Health, Me, User) đăng ký trong `boot` qua `registerFrameworkBindings`.

Override thủ công: tạo `providers/index.ts` — sync re-export từ đó.

## Custom thủ công (advanced)

```ts
import type { RegisterBindings } from '@tenora/server/container';
import { PostRepository } from '../repositories/post-repository';
import { PostController } from '../controllers/post-controller';

export const registerProviders: RegisterBindings = (ctx) => {
  if (!ctx.db) return;

  ctx.repositories.singleton(
    'PostRepository',
    () => new PostRepository(ctx.db!),
  );
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

| Cần                         | Cách lấy                                          |
| --------------------------- | ------------------------------------------------- |
| Controller                  | `bindContainerController('Key', 'method')`        |
| Repository trong controller | Inject qua constructor lúc `providers`            |
| Repository trong middleware | `c.get('repositories').resolve('UserRepository')` |
| DB                          | `c.get('db')`                                     |
| Auth session                | `BaseController.resolveSession(c)`                |

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

Framework bindings không override được qua `providers` — chỉ thêm app controllers/repos.
