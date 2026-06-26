# Runtime

Duneta **chỉ chạy trên Cloudflare Workers**. Không có Bun, Node VPS, hay dev server tách biệt.

## Entry duy nhất

```text
wrangler.jsonc  →  app/worker.ts  →  fetch(request, env)
```

`app/worker.ts` là front controller:

| Path | Handler |
|------|---------|
| `/api/*` | Hono API (`defineServer` + `app/api/router.ts`) |
| static | `env.ASSETS.fetch(request)` |
| `/*` | React Router SSR (dev: virtual build; prod: `app/build/server`) |

API không deploy riêng — bootstrap inline trong `worker.ts`.

## Local vs production

| | Local (`pnpm dev`) | Production (`pnpm deploy`) |
|---|---|---|
| Runtime | Vite + Workers (HMR) | Cloudflare edge |
| URL | http://localhost:8787 | Custom domain / `*.workers.dev` |
| Secrets | `.dev.vars` | `wrangler secret put` |
| Web + API | Cùng origin | Cùng origin |

## SSR

`entry.server.tsx` dùng `renderToReadableStream` (Web Streams) — tương thích Worker, không dùng `node:stream`.

## CLI

| Lệnh | Mục đích |
|------|----------|
| `pnpm dev` | Sync + `react-router dev` (HMR, :8787) |
| `pnpm build` | Sync API + build React Router |
| `pnpm deploy` | Build + `wrangler deploy --config app/build/server/wrangler.json` |

Sync API chạy tự động trong `build` / `deploy` — không cần lệnh riêng.
