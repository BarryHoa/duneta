# Cài đặt

## Deploy

```bash
pnpm install && pnpm deploy
```

`pnpm install` tự build framework packages. `pnpm deploy` sync + build app + `wrangler deploy`.

**Một lần:** Cloudflare auth + config trong `duneta.config.ts` (DB URL, auth secret, …):

```bash
wrangler login
```

Production bindings: copy `wrangler.production.jsonc.example` (ASSETS).

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
