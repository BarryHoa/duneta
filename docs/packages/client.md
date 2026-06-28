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
| `@duneta/client/components` | Barrel (wrappers + extensions) |
| `@duneta/client/components/DunetaButton` | Single component module |
| `@duneta/client/configs` | Web config |
| `@duneta/client/configs/vite` | `createDunetaViteConfig` |
