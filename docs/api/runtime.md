# Runtime

Duneta **chỉ chạy trên Cloudflare Workers**. Không có Bun, Node VPS, hay dev server tách biệt.

## Entry duy nhất

```text
wrangler.jsonc  →  worker.ts  →  fetch(request, env)
```

`worker.ts` là front controller:

| Path | Handler |
|------|---------|
| `/api/*` | Hono API (`defineServer` + `app/api/router.ts`) |
| static | `env.ASSETS.fetch(request)` |
| `/*` | React Router SSR |

## Config load

```ts
const api = defineServer({
  loadConfig: () => loadWorkerServerConfig(() => import('./duneta.server.config')),
  ...
});

return api.fetch(request, env);
```

- Web: `duneta.client.config.ts` (Vite only)
- API: `duneta.server.config.ts` (lazy, runtime `process.env` từ Wrangler secrets)

## Local vs production

| | Local (`pnpm dev`) | Production (`pnpm deploy`) |
|---|---|---|
| Runtime | Vite + Workers (HMR) | Cloudflare edge |
| Secrets | `.env` → Wrangler dev | `wrangler secret put` |
| Web config | `duneta.client.config.ts` | same |
| API config | `duneta.server.config.ts` | same (runtime env) |

## CLI

| Lệnh | Mục đích |
|------|----------|
| `pnpm dev` | Sync + `react-router dev` (HMR, :8787) |
| `pnpm build` | Sync API + build React Router |
| `pnpm deploy` | Build + `wrangler deploy` |
