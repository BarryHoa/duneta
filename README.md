# Tenora

Portable TypeScript monorepo: **Hono API** + **React Router web**.

```bash
pnpm install
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8787/api |

## Cấu trúc

```text
app/api   →  @tenora/server   (backend shell)
app/web   →  @tenora/client   (frontend shell)
packages/ →  framework code
```

## Tài liệu

**[docs/README.md](./docs/README.md)** — mục lục đầy đủ.

| | |
|---|---|
| [Bắt đầu](./docs/getting-started.md) | Cài đặt, commands |
| [Kiến trúc](./docs/architecture.md) | Boot flow, DI, layers |
| [Cấu hình](./docs/configuration.md) | `tenora.config.ts`, `.env` |
| [Customize](./docs/customization.md) | Thêm route, controller, page |
| [API](./docs/api/overview.md) | `defineServer`, runtime, providers |
| [Web](./docs/web/overview.md) | Routes, theme, proxy |

## Quick start API

```ts
// app/api/server.ts
import { defineServer } from '@tenora/server/runtime/cloud';
import config from './tenora.config';
import { registerProviders } from './providers';
import { createRouter } from './routers';

export default defineServer({ config, createRouter, providers: registerProviders });
```

## Commands

```bash
pnpm dev                          # web + api (wrangler)
pnpm --filter api dev:node        # Bun API :3001
pnpm --filter api deploy          # wrangler deploy
pnpm typecheck
```
