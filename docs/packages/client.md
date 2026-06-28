# `@duneta/client`

Framework React Router web — config, default routes, UI components. Build qua `pnpm build` ở repo root.

## UI components (HeroUI v3)

Toàn bộ [HeroUI v3 components](https://heroui.com/en/docs/react/components) được wrap thành `Duneta*`:

```text
packages/client/components/
  DunetaButton/
    types.ts              # DunetaButtonProps
    DunetaButton.tsx      # wrap HeroUI Button
    index.ts
  DunetaCard/
  DunetaModal/
  ... (70 components)
  index.ts                # export * all
```

Regenerate sau khi upgrade `@heroui/react` không còn cần — wrappers là source thủ công trong repo.

## Usage

```tsx
import { DunetaButton, DunetaCard, DunetaModal } from '@duneta/client/components';
import { DunetaTabs } from '@duneta/client/components/DunetaTabs';
```

## Kit

`@duneta/client/kit` là public client toolkit của Duneta. Nó export lại component set hiện có và thêm một số app-building primitives để user không nhầm với API của React hoặc Next.js:

```tsx
import {
  DunetaButton,
  DunetaImage,
  DunetaScript,
  createDynamicComponent,
  createPageMeta,
} from '@duneta/client/kit';
```

| Export | Mô tả |
|--------|------|
| `DunetaImage` | Responsive image wrapper với `priority`, `fill`, `sizes`, custom loader |
| `DunetaScript` | Load third-party script theo `afterInteractive` hoặc `lazyOnload` |
| `createDynamicComponent` | Dynamic import wrapper với fallback, preload, optional client-only render |
| `createPageMeta` / `defineMeta` | Helper tạo React Router meta descriptors |
| `preloadImage` / `preconnect` | Helper cho resource hints |

## Extensions (app-level)

| Export | Mô tả |
|--------|--------|
| `DunetaLink` | React Router link |
| `DunetaHrefLink` | HeroUI Link |
| `DunetaAlertDialog` + `showDuneta*` | Alert dialog helpers |
| `DunetaInput*` variants | Email, password, search, … |
| `DunetaSelectSingle` | Select + uFuzzy + virtual |
| `DunetaSimpleTable` | HTML table (≠ HeroUI `DunetaTable`) |
| `DunetaLoadError` | Load error state |
| `DunetaLayout*` | Page section layout |

## Package exports

| Path | Nội dung |
|------|----------|
| `@duneta/client/kit` | Duneta client toolkit: components + app-building primitives |
| `@duneta/client/components` | Barrel (wrappers + extensions) |
| `@duneta/client/components/DunetaButton` | Single component module |
| `@duneta/client/configs` | Web config |
| `@duneta/client/configs/vite` | `createDunetaViteConfig` |
