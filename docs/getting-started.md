# Cài đặt

## Deploy

```bash
pnpm install && pnpm deploy
```

`pnpm install` tự build framework packages. `pnpm deploy` sync + build app + `wrangler deploy`.

**Một lần:** Cloudflare auth:

```bash
wrangler login
```

App mới chỉ có `GET /api/health` — bật thêm trong `duneta.server.config.ts` khi cần.

Production bindings: copy `wrangler.production.jsonc.example` (ASSETS).

## Dev local

```bash
pnpm dev    # http://localhost:8787 — HMR (Vite + Workers runtime)
```

Tạo `.env` khi config dùng `process.env.*` (DB, auth, …). App minimal không bắt buộc file này. Sửa `pages/` hoặc component → trang tự cập nhật, không cần F5 hay `pnpm build`.

## Cấu trúc

| Path | Việc |
|------|------|
| `duneta.client.config.ts` | Web (theme, api) |
| `duneta.server.config.ts` | API (database, auth, …) |
| `wrangler.jsonc` | Worker dev |
| `worker.ts` | Entry Worker |
| `app/api/` | Routes, services API |
| `app/pages/` | Pages React Router |
| `app/themes/` | CSS |

Thêm route mới trong `pages/` → restart `pnpm dev` (sync routers). Sửa file trong route đã có → HMR tự reload.

## CLI DX

```bash
pnpm duneta routes
pnpm duneta make:page dashboard
pnpm duneta make:controller post
pnpm duneta make:repository post
pnpm duneta make:route posts
pnpm duneta make:policy post
pnpm duneta make:middleware audit
pnpm duneta make:cron delete-user-session
```

`make:*` tạo file theo convention trong `app/`. Nếu app đang dùng `api/services.ts` hoặc `api/router.ts` thủ công, import/mount file mới ở đó. Nếu bỏ qua file thủ công, `duneta sync` trong dev/build sẽ tự sinh từ `controllers/`, `repositories/`, `routers/`.
