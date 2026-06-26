# Duneta

Một Cloudflare Worker: web + `/api` cùng domain.

```bash
pnpm install && pnpm deploy
```

Lần đầu: đăng nhập Cloudflare (`wrangler login` hoặc `CLOUDFLARE_API_TOKEN`).  
Có DB/auth: `wrangler secret put DATABASE_URL` · `wrangler secret put AUTH_SECRET`.

## Dev local

```bash
pnpm dev    # HMR — tự tạo .dev.vars nếu chưa có → http://localhost:8787
```

## Cấu trúc `app/`

```text
app/
├── worker.ts          # entry
├── duneta.config.ts   # cấu hình (secrets qua wrangler)
├── api/               # backend
├── pages/             # web pages
└── build/             # generated
```
