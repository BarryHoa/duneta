# Duneta UI components

Custom layer on [HeroUI v3](https://heroui.com/en/docs/react/components) (`@heroui/react` + `@heroui/styles`).

## Structure

```text
components/
  DunetaButton/           # HeroUI wrapper
    types.ts              # DunetaButtonProps (= ComponentProps<typeof Button>)
    DunetaButton.tsx
    index.ts
  DunetaCard/
  DunetaModal/
  ... (70 HeroUI components)
  DunetaLink/             # React Router (not HeroUI Link → DunetaHrefLink)
  DunetaInput/            # input + variants (email, password, search, …)
  DunetaAlertDialog/      # high-level alert + show* helpers
  DunetaSelect/           # select + DunetaSelectSingle (search/virtual)
  DunetaLayout/           # page layout helpers
  DunetaSimpleTable/      # lightweight HTML table
  DunetaDataTable/        # TanStack Table + virtual rows + filters
  DunetaLoadError/
  index.ts
```

## Usage

```tsx
import {
  DunetaButton,
  DunetaCard,
  DunetaInput,
  DunetaTable,        // HeroUI Table
  DunetaSimpleTable,  // lightweight HTML table extension
  DunetaLink,         // React Router
  DunetaHrefLink,     // HeroUI Link
} from '@duneta/client/components';

// Or import one module:
import { DunetaModal } from '@duneta/client/components/DunetaModal';
```

## Naming

| HeroUI | Duneta wrapper | Folder |
|--------|----------------|--------|
| Button | DunetaButton | DunetaButton |
| Card | DunetaCard | DunetaCard |
| Link | DunetaHrefLink | DunetaHrefLink |
| AlertDialog | (skip) | DunetaAlertDialog (custom) |

App extensions override or extend where noted in `components/index.ts`.

## HeroUI imports

Application code must not import `@heroui/react` or `@heroui/*` directly. ESLint enforces this repo-wide, with an exception only for files under `packages/client/components/Duneta*/` (the wrapper layer).

Load HeroUI styles once via `themes/globals.css` (`@import '@heroui/styles'`).

## DunetaDataTable

Grouped feature props — `false` | `null` | `undefined` disables a feature.

```tsx
<DunetaDataTable
  data={rows}
  columns={columns}
  getRowId={(row) => row.id}
  search={{
    placeholder: 'Search…',
    value: query,
    onChange: setQuery,
    debounceMs: 300,
  }}
  rowSelection={{
    type: 'checkbox',
    selectedIds,
    onChange: setSelectedIds,
    groupSelection: true,
  }}
  freeze={{ left: ['sku'], right: ['actions'] }}
  columnsUi={{
    minWidth: 80,
    maxWidth: 'auto',
    resize: true,
    drag: true,
  }}
  virtual={{ rows: true, columns: true }}
  pagination={{ mode: 'offset', total, offset, limit: 50, onPageChange: setOffset }}
  retry={{ onRefresh: refetch, isRefreshing }}
  favorites={{ storageKey: 'orders-list' }}
  edit={{ onCellEdit: handleEdit }}
/>
```

Column `meta`: `freeze`, `minWidth`, `maxWidth`, `width`, `editable`, `editType`, `filterPin`.

### Render performance

State is split so toolbar and grid re-render independently:

| Region | Subscribes to | Isolated state |
|--------|---------------|----------------|
| `DunetaDataTableToolbarSearch` | — | local input (debounced) |
| `DunetaDataTableToolbarPinnedFilters` | pinned columns list | per-column debounced input |
| `DunetaDataTableSelectionBadge` | `selectedCount` only | — |
| `DunetaDataTableColumnPanel` | visibility / pin / grouping | — |
| `DunetaDataTableToolbarFavorites` | — | favorites localStorage |
| `DunetaDataTableGrid` | rows, sort, sizing, selection… | — |
| `DunetaDataTableGridRegion` | — | `editingCell` |
| `DunetaDataTablePaginationFooterRegion` | — | props only (memo) |
| `DunetaDataTableEditableCell` | — | memo per cell |

Context exposes only stable `table` + `onSortChange` (sort descriptor subscribed inside grid).

Avoid controlled `search.value` synced to parent on every keystroke — use `initialValue` instead.

### Multiple tables on one page

Each `<DunetaDataTable>` is fully isolated: own Engine, Context, TanStack `table` instance, internal state.

```tsx
<DunetaDataTable instanceId="orders" ariaLabel="Orders" favorites={{ storageKey: 'orders-list' }} ... />
<DunetaDataTable instanceId="lines" ariaLabel="Order lines" favorites={{ storageKey: 'lines-list' }} ... />
```

- Use distinct `instanceId` only when you need a stable id across remounts (optional — auto `useId` per mount).
- Use distinct `favorites.storageKey` per table.
- Hold page-level state separately: `ordersQuery` / `linesQuery`, `selectedOrderIds` / `selectedLineIds`.
- Internal UI state (search draft, column resize, sort if uncontrolled) does not leak between tables.

### Navigate away and back

On unmount (redirect to another route), **in-memory state is reset** when the page remounts:

| State | Survives navigation? |
|-------|----------------------|
| Search / filter / sort / selection (uncontrolled) | No — remount fresh |
| `favorites.storageKey` (localStorage) | Yes |
| Parent `useState` in a layout that stays mounted | Yes |
| URL query (`?q=&page=`) | Yes — if you wire props from URL |
| React Query / SWR cache | Yes — refetch or show cached `data` |

To restore UX after back navigation, lift important state to **URL** or **parent**:

```tsx
const [q, setQ] = useSearchParamsState('q')
const [offset, setOffset] = useSearchParamsState('offset')

<DunetaDataTable
  search={{ initialValue: q, onChange: setQ }}
  pagination={{ mode: 'offset', offset, onPageChange: setOffset, ... }}
  sort={{ descriptor, onChange: setSort }}
  rowSelection={{ selectedIds, onChange: setSelectedIds }}
/>
```
