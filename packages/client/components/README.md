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
  TenoraDataTable/        # TanStack Table + virtual rows + filters
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

## TenoraDataTable

Grouped feature props — `false` | `null` | `undefined` disables a feature.

```tsx
<TenoraDataTable
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
| `TenoraDataTableToolbarSearch` | — | local input (debounced) |
| `TenoraDataTableToolbarPinnedFilters` | pinned columns list | per-column debounced input |
| `TenoraDataTableSelectionBadge` | `selectedCount` only | — |
| `TenoraDataTableColumnPanel` | visibility / pin / grouping | — |
| `TenoraDataTableToolbarFavorites` | — | favorites localStorage |
| `TenoraDataTableGrid` | rows, sort, sizing, selection… | — |
| `TenoraDataTableGridRegion` | — | `editingCell` |
| `TenoraDataTablePaginationFooterRegion` | — | props only (memo) |
| `TenoraDataTableEditableCell` | — | memo per cell |

Context exposes only stable `table` + `onSortChange` (sort descriptor subscribed inside grid).

Avoid controlled `search.value` synced to parent on every keystroke — use `initialValue` instead.

### Multiple tables on one page

Each `<TenoraDataTable>` is fully isolated: own Engine, Context, TanStack `table` instance, internal state.

```tsx
<TenoraDataTable instanceId="orders" ariaLabel="Orders" favorites={{ storageKey: 'orders-list' }} ... />
<TenoraDataTable instanceId="lines" ariaLabel="Order lines" favorites={{ storageKey: 'lines-list' }} ... />
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

<TenoraDataTable
  search={{ initialValue: q, onChange: setQ }}
  pagination={{ mode: 'offset', offset, onPageChange: setOffset, ... }}
  sort={{ descriptor, onChange: setSort }}
  rowSelection={{ selectedIds, onChange: setSelectedIds }}
/>
```
