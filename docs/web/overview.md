# Web — Tổng quan

Web shell trong `app/` — routes, theme, build output cho Worker.

## Thêm page

```tsx
// app/pages/blog/page.tsx
export default function BlogPage() {
  return <h1>Blog</h1>;
}
```

Sau đó `pnpm build`.

## Config

`duneta.client.config.ts` — `api.baseUrl`, `theme.default`.

## Gọi API

Same-origin `/api` — `apiFetch` từ `@duneta/client/runtime`.

```bash
pnpm dev   # web + API cùng :8787
```
