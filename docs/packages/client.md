# `@duneta/client`

Framework React Router web — layered frontend lib.

## Layers

```text
@duneta/client/ui        → Duneta* components (design system)
@duneta/client/runtime   → Image, Script, apiFetch, ThemeProvider
@duneta/client/router    → Link hooks, meta, dynamic import
@duneta/client/core      → cn, validators, constants
@duneta/client/configs   → duneta.client.config.ts (Vite / sync)
starter/                 → default routers + layouts (sync only, not imported)
```

## UI (`@duneta/client/ui`)

HeroUI v3 wrappers as `Duneta*`:

```tsx
import { DunetaButton, DunetaCard } from '@duneta/client/ui';
import { DunetaTabs } from '@duneta/client/ui/DunetaTabs';
```

Source lives in `packages/client/components/` (compiled to `dist/components/`).

## Runtime (`@duneta/client/runtime`)

```tsx
import { DunetaImage, DunetaScript, apiFetch, ThemeProvider } from '@duneta/client/runtime';
```

| Export | Mô tả |
|--------|------|
| `DunetaImage` | Responsive image + optimization loader (`/duneta/image`) |
| `DunetaScript` | Third-party scripts (`afterInteractive` / `lazyOnload`) |
| `apiFetch` | Same-origin `/api` fetch |
| `ThemeProvider` | Dark/light theme |

## Router (`@duneta/client/router`)

```tsx
import { DunetaLink } from '@duneta/client/ui';
import { defineMeta, createDynamicComponent, useRouter } from '@duneta/client/router';
```

| Export | Mô tả |
|--------|------|
| `defineMeta` / `createPageMeta` | React Router meta |
| `createDynamicComponent` | Lazy import + fallback |
| `useRouter`, `usePathname`, … | Navigation hooks |

## Core (`@duneta/client/core`)

```ts
import { cn, emailSchema, IMAGE_OPTIMIZATION_PATH } from '@duneta/client/core';
```

## Config

| Path | Nội dung |
|------|----------|
| `@duneta/client/configs` | Web config |
| `@duneta/client/configs/vite` | `createDunetaViteConfig` |
| `@duneta/client/themes/globals.css` | Tailwind + HeroUI entry |

## Starter (not a public import)

`starter/routers` + `starter/layouts` — merged into `app/.router-runtime/` by `duneta sync`.
