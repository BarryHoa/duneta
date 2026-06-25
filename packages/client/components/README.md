# Tenora UI components

Custom layer on [HeroUI v3](https://heroui.com/en/docs/react/components) (`@heroui/react` + `@heroui/styles`).

## Structure

```text
components/
  TenoraButton/           # HeroUI wrapper
    types.ts              # TenoraButtonProps (= ComponentProps<typeof Button>)
    TenoraButton.tsx
    index.ts
  TenoraCard/
  TenoraModal/
  ... (70 HeroUI components)
  TenoraLink/             # React Router (not HeroUI Link → TenoraHrefLink)
  TenoraInput/            # input + variants (email, password, search, …)
  TenoraAlertDialog/      # high-level alert + show* helpers
  TenoraSelect/           # select + TenoraSelectSingle (search/virtual)
  TenoraLayout/           # page layout helpers
  TenoraSimpleTable/      # lightweight HTML table
  TenoraLoadError/
  index.ts
```

## Usage

```tsx
import {
  TenoraButton,
  TenoraCard,
  TenoraInput,
  TenoraTable,        // HeroUI Table
  TenoraSimpleTable,  // lightweight HTML table extension
  TenoraLink,         // React Router
  TenoraHrefLink,     // HeroUI Link
} from '@tenora/client/components';

// Or import one module:
import { TenoraModal } from '@tenora/client/components/TenoraModal';
```

## Naming

| HeroUI | Tenora wrapper | Folder |
|--------|----------------|--------|
| Button | TenoraButton | TenoraButton |
| Card | TenoraCard | TenoraCard |
| Link | TenoraHrefLink | TenoraHrefLink |
| AlertDialog | (skip) | TenoraAlertDialog (custom) |

App extensions override or extend where noted in `components/index.ts`.

## HeroUI imports

Application code must not import `@heroui/react` or `@heroui/*` directly. ESLint enforces this repo-wide, with an exception only for files under `packages/client/components/Tenora*/` (the wrapper layer).

Load HeroUI styles once via `themes/globals.css` (`@import '@heroui/styles'`).
