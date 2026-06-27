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
Có DB/auth: set `database.connections`, `auth.secret`, `auth.baseUrl` trong `duneta.config.ts`.

Production bindings: xem `wrangler.production.jsonc.example` (Hyperdrive + ASSETS).

## Dev local

```bash
pnpm dev    # HMR → http://localhost:8787 — secrets trong `.env`, map trong `duneta.config.ts`
```

## Cấu trúc

```text
duneta.config.ts       # cấu hình app (DB, auth, storage, …)
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
