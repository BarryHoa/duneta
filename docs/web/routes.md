# Web — Routes & theme

## Router merge

```text
packages/client/routers/     ← defaults framework
app/web/routers/             ← routes của bạn
         ↓ duneta-web sync
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

File-based routing theo React Router v7 conventions. Sau khi thêm file, `duneta-web dev` tự sync.

## Layout

Framework ship layout trong `packages/client/routers/layout.tsx` — dùng `ThemeProvider` từ `@duneta/client/providers`.

Override bằng `app/web/routers/layout.tsx` nếu cần.

## Theme

```ts
// duneta.config.ts
theme: { default: 'dark' },
```

CSS variables trong `app/web/themes/globals.css` — Tailwind v4 + HeroUI.

## Gọi API từ web

### Vite proxy (dev)

`api.baseUrl: '/api'` + `api.port` → request `/api/users` proxy tới backend.

### `apiFetch`

```tsx
import { apiFetch } from '@duneta/client/hooks/use-api';

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
import { createReactRouterConfig } from '@duneta/client/configs/react-router';
import { loadConfig } from '@duneta/client/configs/load';

const config = await loadConfig(webRoot);
export default createReactRouterConfig(config);
```

## `vite.config.ts`

```ts
import { createDunetaViteConfig } from '@duneta/client/configs/vite';
// merge với config app
```

Xem file thực tế trong `app/web/` để biết options đang dùng.

## Components

UI components ship trong `@duneta/client/components` (Duneta* wrappers quanh HeroUI).

```tsx
import { DunetaButton } from '@duneta/client/components';
```

Không copy component vào app trừ khi cần customize sâu.
