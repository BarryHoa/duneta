# Web app — Tổng quan

`app/web` là shell React Router mỏng trên `@duneta/client`.

## Cấu trúc

```text
app/web/
├── duneta.config.ts       # port, API proxy, theme
├── react-router.config.ts # load config → createReactRouterConfig
├── vite.config.ts         # Vite + Duneta plugins
├── routers/               # routes của bạn (override/extend)
│   └── about/page.tsx
├── themes/
│   └── globals.css
└── package.json
```

## Không import `@duneta/server`

Gọi API từ web qua proxy `/api` hoặc `apiFetch` từ `@duneta/client/hooks/use-api`.

## Config

```ts
// app/web/duneta.config.ts
import { defineDunetaConfig, env } from '@duneta/client/configs';

export default defineDunetaConfig({
  app: { name: 'duneta-web', port: Number(env('PORT', '3000')) },
  api: { port: Number(env('API_PORT', '3001')), baseUrl: '/api' },
  theme: { default: 'dark' },
});
```

| Field | Mô tả |
|-------|-------|
| `app.port` | Vite dev server |
| `api.port` | Backend port cho proxy |
| `api.baseUrl` | Path proxy (thường `/api`) |
| `theme.default` | `light` / `dark` / `system` |

## CLI `duneta-web`

| Command | Hành vi |
|---------|---------|
| `dev` | Sync routers + `react-router dev` |
| `build` | Sync routers + production build |
| `typegen` | Generate React Router types |

Trước dev/build, `duneta-web` merge routes từ `packages/client/routers/` và `app/web/routers/` vào `.router-runtime/`.

## Dev full stack

```bash
pnpm dev
```

- Web: `:3000`
- API: `:8787` (Wrangler) — proxy `/api` theo config

Chạy API Bun `:3001` khi dev web:

```bash
# terminal 1
pnpm --filter api dev:node

# terminal 2
pnpm --filter web dev
```

Đặt `API_PORT=3001` trong `app/web/.env`.

## Tài liệu liên quan

- [Routes & theme](./routes.md)
- [`@duneta/client`](../packages/client.md)
