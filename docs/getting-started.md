# Cài đặt

## Deploy

```bash
pnpm install && pnpm deploy
```

`pnpm install` tự build framework packages. `pnpm deploy` sync + build app + `wrangler deploy`.

**Một lần:** Cloudflare auth + secrets (nếu dùng DB/auth):

```bash
wrangler login
wrangler secret put DATABASE_URL
wrangler secret put AUTH_SECRET
wrangler secret put AUTH_BASE_URL   # URL production, ví dụ https://example.com
wrangler secret put CACHE_URL       # optional — Redis HTTP
wrangler secret put CSRF_SECRET     # optional — defaults to AUTH_SECRET
```

Production bindings: copy `wrangler.production.jsonc.example` (Hyperdrive + ASSETS).

## Dev local

```bash
pnpm dev    # http://localhost:8787 — HMR (Vite + Workers runtime)
```

Tự tạo `.dev.vars` từ `.dev.vars.example` nếu chưa có. Bỏ comment các biến cần dùng (DB, auth). Sửa `pages/` hoặc component → trang tự cập nhật, không cần F5 hay `pnpm build`.

## Cấu trúc

| Path | Việc |
|------|------|
| `duneta.config.ts` | Cấu hình (không hardcode secrets) |
| `wrangler.jsonc` | Worker dev |
| `worker.ts` | Entry Worker |
| `app/api/` | Routes, services API |
| `app/pages/` | Pages React Router |
| `app/themes/` | CSS |

Thêm route mới trong `pages/` → restart `pnpm dev` (sync routers). Sửa file trong route đã có → HMR tự reload.
