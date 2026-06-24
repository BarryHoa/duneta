# API app — Tổng quan

`app/api` là shell backend mỏng. Framework (`@tenora/server`) xử lý boot, middleware, auth, database — bạn chỉ cung cấp 3 hook.

## Cấu trúc thư mục

```text
app/api/
├── server.ts           # Cloud entry (Wrangler / Vercel)
├── server.node.ts      # Bun entry (local / VPS)
├── tenora.config.ts    # cấu hình app
├── providers/
│   └── index.ts        # DI: controller + repository
├── routers/
│   └── index.ts        # createRouter hook
├── wrangler.jsonc      # Cloudflare Worker config
├── .env                # giá trị env (không commit)
└── package.json
```

## Entry points (bắt buộc)

Cả hai file đều gọi `defineServer` với cùng hooks:

```ts
import { defineServer } from '@tenora/server/runtime/cloud'; // hoặc /node
import config from './tenora.config';
import { registerProviders } from './providers';
import { createRouter } from './routers';

export default defineServer({ config, createRouter, providers: registerProviders });
```

| File | Runtime | CLI |
|------|---------|-----|
| `server.ts` | Cloudflare Worker | `pnpm --filter api dev` |
| `server.node.ts` | Bun | `pnpm --filter api dev:node` |

## Routes mặc định

Framework ship sẵn trong `@tenora/server/routers`:

| Route | Controller | Điều kiện |
|-------|------------|-----------|
| `GET /api/health` | `HealthController` | luôn |
| `GET /api/me` | `MeController` | auth enabled |
| `GET /api/users` | `UserController` | auth + database |
| `GET /api/users/:id` | `UserController` | auth + database |

`createRouter` mặc định gọi `createDefaultRouter(config)` — tự bật route theo config.

## CLI `tenora-api`

Định nghĩa trong `@tenora/server` bin:

| Command | Hành vi |
|---------|---------|
| `dev` | `wrangler dev server.ts` → :8787 |
| `deploy` | `wrangler deploy server.ts` |
| `dev:node` | `bun --watch server.node.ts` → :3001 |
| `start:node` | `bun server.node.ts` |

`.env` được load **trước** khi spawn child process (quan trọng cho `tenora.config.ts` đọc env lúc import).

## Tài liệu liên quan

- [Runtime](./runtime.md)
- [Routes](./routes.md)
- [Providers & DI](./providers.md)
- [Controller → Repository](./controllers-repositories.md)
