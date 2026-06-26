# Cài đặt & chạy dev

## Yêu cầu

- Node.js 20+
- pnpm 10 (`corepack enable`)
- Bun (chỉ khi chạy API local với `dev:node`)

## Cài đặt

```bash
pnpm install
```

## Chạy full stack

```bash
pnpm dev
```

Chạy song song:

| Service | URL | Runtime |
|---------|-----|---------|
| Web | http://localhost:3000 | React Router (Vite) |
| API | http://localhost:8787/api | Wrangler (Cloudflare Worker) |

## Chạy riêng từng phần

```bash
pnpm --filter web dev          # web only
pnpm --filter api dev          # API Wrangler only
pnpm --filter api dev:node     # API Bun — http://localhost:3001/api
pnpm --filter api start:node   # Bun production mode
pnpm --filter api deploy       # wrangler deploy
```

## Build & kiểm tra

```bash
pnpm build
pnpm typecheck
pnpm lint
```

## Cấu trúc repo

```text
Duneta/
├── app/
│   ├── api/          # shell backend — bạn sở hữu config, routes, providers
│   └── web/          # shell frontend — bạn sở hữu config, routes, theme
├── packages/
│   ├── server/       # @duneta/server — framework API
│   └── client/       # @duneta/client — framework web
└── docs/             # tài liệu này
```

## Bước tiếp theo

1. Copy `app/api/.env.example` → `app/api/.env`
2. Chỉnh `app/api/duneta.config.ts` và `app/web/duneta.config.ts`
3. Đọc [Kiến trúc](./architecture.md) và [Cấu hình](./configuration.md)
