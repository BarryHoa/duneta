# API app — Tổng quan

`app/api` là shell backend mỏng. Framework boot middleware, auth, database — bạn thêm domain code, `tenora-api sync` wire tự động.

## Cấu trúc thư mục

```text
app/api/
├── server.ts              # Cloud entry (Wrangler)
├── server.node.ts           # Bun entry
├── tenora.config.ts         # cấu hình app
├── controllers/             # *-controller.ts (optional)
├── repositories/            # *-repository.ts (optional)
├── routers/                 # *.routes.ts (optional)
├── .api-runtime/            # generated — không sửa (gitignore)
├── wrangler.jsonc
├── .env
└── package.json
```

## Entry points

```ts
import { defineServer } from '@tenora/server/runtime/cloud';
import config from './tenora.config';
import { createRouter, registerProviders } from './.api-runtime';

export default defineServer({ config, createRouter, providers: registerProviders });
```

| File | Runtime | CLI |
|------|---------|-----|
| `server.ts` | Cloudflare Worker | `pnpm --filter api dev` |
| `server.node.ts` | Bun | `pnpm --filter api dev:node` |

Hooks import từ `.api-runtime/` — file do `tenora-api sync` sinh ra trước mỗi `dev` / `deploy` / `typecheck`.

## Convention scan

| Thư mục | Pattern | Ví dụ |
|---------|---------|-------|
| `controllers/` | `*-controller.ts` | `post-controller.ts` → `PostController` |
| `repositories/` | `*-repository.ts` | `post-repository.ts` → `PostRepository` |
| `routers/` | `*.routes.ts` | `posts.routes.ts` → `postsRoutes` |

Cùng base name → controller inject repository (`post` + `post`).

Override thủ công (optional): giữ `providers/index.ts` hoặc `routers/index.ts` — sync re-export từ đó.

## Routes mặc định

Framework ship trong `@tenora/server/routers`:

| Route | Controller | Điều kiện |
|-------|------------|-----------|
| `GET /api/health` | `HealthController` | luôn |
| `GET /api/me` | `MeController` | auth |
| `GET /api/users` | `UserController` | auth + database |

App routes merge thêm qua `.api-runtime/router.generated.ts`.

## CLI `tenora-api`

| Command | Hành vi |
|---------|---------|
| `sync` | Scan → generate `.api-runtime/` |
| `dev` | sync + wrangler dev |
| `deploy` | sync + wrangler deploy |
| `dev:node` | sync + bun --watch |
| `start:node` | sync + bun |

## Tài liệu liên quan

- [Sync & `.api-runtime`](./sync.md)
- [Runtime](./runtime.md)
- [Routes](./routes.md)
- [Providers & DI](./providers.md)
