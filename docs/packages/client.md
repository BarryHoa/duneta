# `@tenora/client`

Framework React Router web — config, default routes, UI components, `tenora-web` CLI.

## UI components (HeroUI v3)

Toàn bộ [HeroUI v3 components](https://heroui.com/en/docs/react/components) được wrap thành `Tenora*`:

```text
packages/client/components/
  TenoraButton/
    types.ts              # TenoraButtonProps
    TenoraButton.tsx      # wrap HeroUI Button
    index.ts
  TenoraCard/
  TenoraModal/
  ... (70 components)
  index.ts                # export * all
```

Regenerate sau khi upgrade `@heroui/react` không còn cần — wrappers là source thủ công trong repo.

## Usage

```tsx
import { TenoraButton, TenoraCard, TenoraModal } from '@tenora/client/components';
import { TenoraTabs } from '@tenora/client/components/TenoraTabs';
```

## Extensions (app-level)

| Export | Mô tả |
|--------|--------|
| `TenoraLink` | React Router link |
| `TenoraHrefLink` | HeroUI Link |
| `TenoraAlertDialog` + `showTenora*` | Alert dialog helpers |
| `TenoraInput*` variants | Email, password, search, … |
| `TenoraSelectSingle` | Select + uFuzzy + virtual |
| `TenoraSimpleTable` | HTML table (≠ HeroUI `TenoraTable`) |
| `TenoraLoadError` | Load error state |
| `TenoraLayout*` | Page section layout |

## Package exports

| Path | Nội dung |
|------|----------|
| `@tenora/client/components` | Barrel (wrappers + extensions) |
| `@tenora/client/components/TenoraButton` | Single component module |
| `@tenora/client/configs` | Web config |
| `@tenora/client/configs/vite` | `createTenoraViteConfig` |
