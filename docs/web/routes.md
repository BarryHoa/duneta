# Web — Routes & theme

## Router merge

```text
packages/client/routers/   ← defaults
app/pages/               ← pages của bạn
         ↓ build sync
app/.router-runtime/       ← generated
```

## Theme

`app/duneta.config.ts` → `theme.default`

CSS: `app/themes/globals.css`

## Gọi API

Same-origin `/api` — xem [overview](./overview.md).
