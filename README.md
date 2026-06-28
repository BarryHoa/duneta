# Duneta

Một Cloudflare Worker: web + `/api` cùng domain.

```bash
# App mới (sau khi publish npm)
npx create-duneta-app my-app

# Monorepo / dogfood
pnpm install && pnpm dev
```

```bash
pnpm deploy
```

Lần đầu: đăng nhập Cloudflare (`wrangler login` hoặc `CLOUDFLARE_API_TOKEN`).  
App mới chỉ health check — DB/auth opt-in trong `duneta.server.config.ts` khi cần.

Production bindings: xem `wrangler.production.jsonc.example` (Hyperdrive + ASSETS).

## Dev local

```bash
pnpm dev    # HMR → http://localhost:8787 — secrets trong `.env`, map trong `duneta.server.config.ts`
```

## Cấu trúc

```text
duneta.client.config.ts       # web (theme, api)
duneta.server.config.ts       # API (database, auth, …)
vite.config.mts        # Vite + Cloudflare plugin
react-router.config.mts
wrangler.jsonc         # Worker dev (deploy → app/build/server/wrangler.json)

worker.ts              # entry
app/                   # source only
├── api/               # backend
├── pages/             # web pages
├── themes/            # CSS
└── build/             # generated
```
