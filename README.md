# Duneta

Một Cloudflare Worker: web + `/api` cùng domain.

```bash
pnpm install && pnpm deploy
```

Lần đầu: đăng nhập Cloudflare (`wrangler login` hoặc `CLOUDFLARE_API_TOKEN`).  
Có DB/auth: set `database.connections`, `auth.secret`, `auth.baseUrl` trong `duneta.config.ts`.

Production bindings: xem `wrangler.production.jsonc.example` (Hyperdrive + ASSETS).

## Dev local

```bash
pnpm dev    # HMR — tự tạo .dev.vars nếu chưa có → http://localhost:8787
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
