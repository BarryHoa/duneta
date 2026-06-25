# Web — Routes & theme

## Router merge

```text
packages/client/routers/     ← defaults framework
app/web/routers/             ← routes của bạn
         ↓ tenora-web sync
app/web/.router-runtime/     ← merged (generated, không edit)
```

App routes **ghi đè** package routes khi trùng path.

## Thêm page mới

```tsx
// app/web/routers/blog/page.tsx
export default function BlogPage() {
  return <h1>Blog</h1>;
}
```

File-based routing theo React Router v7 conventions. Sau khi thêm file, `tenora-web dev` tự sync.

## Layout

Framework ship layout trong `packages/client/routers/layout.tsx` — dùng `ThemeProvider` từ `@tenora/client/providers`.

Override bằng `app/web/routers/layout.tsx` nếu cần.

## Theme

```ts
// tenora.config.ts
theme: { default: 'dark' },
```

CSS variables trong `app/web/themes/globals.css` — Tailwind v4 + HeroUI.

## Gọi API từ web

### Vite proxy (dev)

`api.baseUrl: '/api'` + `api.port` → request `/api/users` proxy tới backend.

### `apiFetch`

```tsx
import { apiFetch } from '@tenora/client/hooks/use-api';

const data = await apiFetch({ path: '/users' });
```

Hoặc dùng trong React Router `loader`:

```tsx
export async function loader() {
  return apiFetch({ path: '/users' });
}
```

## `react-router.config.ts`

```ts
import { createReactRouterConfig } from '@tenora/client/configs/react-router';
import { loadConfig } from '@tenora/client/configs/load';

const config = await loadConfig(webRoot);
export default createReactRouterConfig(config);
```

## `vite.config.ts`

```ts
import { createTenoraViteConfig } from '@tenora/client/configs/vite';
// merge với config app
```

Xem file thực tế trong `app/web/` để biết options đang dùng.

## Components

UI components ship trong `@tenora/client/components` (Tenora* wrappers quanh HeroUI).

```tsx
import { TenoraButton } from '@tenora/client/components';
```

Không copy component vào app trừ khi cần customize sâu.
