'use client';

import type { Table, VisibilityState } from '@tanstack/react-table';
import { memo, type ReactNode } from 'react';
import { TenoraButton } from '../TenoraButton';
import { TenoraInputSearch } from '../TenoraInput';
import { TenoraPopover } from '../TenoraPopover';
import { useTenoraDataTableContext } from './TenoraDataTableContext';
import { TenoraDataTableColumnFilterInput } from './TenoraDataTableColumnFilterInput';
import { useTenoraDataTableFavoriteFilters } from './useTenoraDataTableFavoriteFilters';
import {
  useTenoraDataTableColumnUiRevision,
  useTenoraDataTablePinnedFilterColumns,
  useTenoraDataTableSelectedCount,
} from './table-store';
import type {
  TenoraDataTableFavoriteFilter,
  TenoraDataTableFavoritesConfig,
  TenoraDataTableFilterConfig,
  TenoraDataTableGroupingConfig,
  TenoraDataTableRetryConfig,
  TenoraDataTableSearchConfig,
  TenoraDataTableColumnsUiConfig,
} from './types';
import { TENORA_DATA_TABLE_SELECTION_COLUMN_ID } from './types';

export const TenoraDataTableSelectionBadge = memo(function TenoraDataTableSelectionBadge<
  TData,
>() {
  const { table } = useTenoraDataTableContext<TData>();
  const selectedRowCount = useTenoraDataTableSelectedCount(table);

  if (selectedRowCount === 0) return null;

  return (
    <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-200">
      {selectedRowCount} selected
    </span>
  );
});

export const TenoraDataTableToolbarSearch = memo(function TenoraDataTableToolbarSearch({
  search,
  retry,
  filter,
}: {
  search: TenoraDataTableSearchConfig;
  retry?: TenoraDataTableRetryConfig;
  filter?: TenoraDataTableFilterConfig;
}) {
  const { table } = useTenoraDataTableContext();

  return (
    <TenoraInputSearch
      ariaLabel={search.ariaLabel ?? 'Search table'}
      placeholder={search.placeholder}
      initialValue={
        search.value ??
        search.initialValue ??
        filter?.global ??
        String(table.getState().globalFilter ?? '')
      }
      onDebouncedChange={(value) => {
        search.onChange(value);
        if (filter?.onGlobalChange) {
          filter.onGlobalChange(value);
        } else {
          table.setGlobalFilter(value);
        }
      }}
      debounceMs={search.debounceMs ?? search.delay ?? 300}
      onRefresh={search.onRefresh ?? retry?.onRefresh}
      isRefreshing={search.isRefreshing ?? retry?.isRefreshing}
      refreshAria={search.refreshAria}
      clearAria={search.clearAria}
      className={search.className}
    />
  );
});

export const TenoraDataTableToolbarRetry = memo(function TenoraDataTableToolbarRetry({
  retry,
  hidden,
}: {
  retry?: TenoraDataTableRetryConfig;
  hidden?: boolean;
}) {
  if (hidden || !retry?.onRefresh) return null;

  return (
    <TenoraButton
      size="sm"
      variant="ghost"
      isDisabled={retry.isRefreshing}
      onPress={retry.onRefresh}
    >
      {retry.isRefreshing ? '◌' : '↻'} {retry.refreshLabel ?? 'Refresh'}
    </TenoraButton>
  );
});

export const TenoraDataTableToolbarPinnedFilters = memo(
  function TenoraDataTableToolbarPinnedFilters({
    pinnedFilterColumnIds = [],
  }: {
    pinnedFilterColumnIds?: string[];
  }) {
    const { table } = useTenoraDataTableContext();
    const filterPinColumns = useTenoraDataTablePinnedFilterColumns(table, pinnedFilterColumnIds);

    return filterPinColumns.map((column) => (
      <TenoraDataTableColumnFilterInput key={column.id} column={column} />
    ));
  },
);

export const TenoraDataTableToolbarFavorites = memo(function TenoraDataTableToolbarFavorites({
  favorites,
  filter,
  columnsUi,
  grouping,
}: {
  favorites?: TenoraDataTableFavoritesConfig;
  filter?: TenoraDataTableFilterConfig;
  columnsUi?: TenoraDataTableColumnsUiConfig;
  grouping?: TenoraDataTableGroupingConfig;
}) {
  const { table } = useTenoraDataTableContext();
  const [persistedFavorites, setPersistedFavorites] = useTenoraDataTableFavoriteFilters(
    favorites?.storageKey ?? '',
    favorites?.items ?? [],
  );

  const favoriteItems = favorites?.storageKey ? persistedFavorites : (favorites?.items ?? []);
  const onFavoriteFiltersChange = favorites?.storageKey
    ? setPersistedFavorites
    : favorites?.onChange;

  if (!favorites) return null;

  const pinnedFavorites = favoriteItems.filter((item) => item.pinned);

  const applyFavorite = (favorite: TenoraDataTableFavoriteFilter) => {
    filter?.onColumnFiltersChange?.(favorite.columnFilters);
    if (favorite.globalFilter !== undefined) filter?.onGlobalChange?.(favorite.globalFilter);
    if (favorite.grouping) grouping?.onChange?.(favorite.grouping);
    if (favorite.columnVisibility) columnsUi?.onVisibilityChange?.(favorite.columnVisibility);
    table.setColumnFilters(favorite.columnFilters);
    if (favorite.globalFilter !== undefined) table.setGlobalFilter(favorite.globalFilter);
    if (favorite.grouping) table.setGrouping(favorite.grouping);
    if (favorite.columnVisibility) table.setColumnVisibility(favorite.columnVisibility);
  };

  const saveFavorite = () => {
    if (!onFavoriteFiltersChange) return;
    const label = window.prompt('Favorite filter name', `Filter ${favoriteItems.length + 1}`);
    if (!label?.trim()) return;
    onFavoriteFiltersChange([
      ...favoriteItems,
      {
        id: `fav-${Date.now()}`,
        label: label.trim(),
        columnFilters: filter?.columnFilters ?? table.getState().columnFilters,
        globalFilter: filter?.global ?? table.getState().globalFilter,
        grouping: grouping?.columns ?? table.getState().grouping,
        columnVisibility: columnsUi?.visibility ?? table.getState().columnVisibility,
        pinned: false,
      },
    ]);
  };

  const toggleFavoritePin = (id: string) => {
    if (!onFavoriteFiltersChange) return;
    onFavoriteFiltersChange(
      favoriteItems.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)),
    );
  };

  const deleteFavorite = (id: string) => {
    if (!onFavoriteFiltersChange) return;
    onFavoriteFiltersChange(favoriteItems.filter((item) => item.id !== id));
  };

  return (
    <>
      {pinnedFavorites.map((favorite) => (
        <span key={favorite.id} className="inline-flex items-center gap-1">
          <TenoraButton size="sm" variant="secondary" onPress={() => applyFavorite(favorite)}>
            {favorite.label}
          </TenoraButton>
          {onFavoriteFiltersChange ? (
            <>
              <TenoraButton
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label={favorite.pinned ? 'Unpin favorite filter' : 'Pin favorite filter'}
                onPress={() => toggleFavoritePin(favorite.id)}
              >
                {favorite.pinned ? '★' : '☆'}
              </TenoraButton>
              <TenoraButton
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label={`Delete ${favorite.label}`}
                onPress={() => deleteFavorite(favorite.id)}
              >
                ×
              </TenoraButton>
            </>
          ) : null}
        </span>
      ))}
      {onFavoriteFiltersChange ? (
        <TenoraButton size="sm" variant="ghost" onPress={saveFavorite}>
          Save filter
        </TenoraButton>
      ) : null}
    </>
  );
});

export const TenoraDataTableColumnPanel = memo(function TenoraDataTableColumnPanel({
  show = true,
}: {
  show?: boolean;
}) {
  const { table } = useTenoraDataTableContext();
  useTenoraDataTableColumnUiRevision(table);

  if (!show) return null;

  const leafColumns = table
    .getAllLeafColumns()
    .filter((column) => column.id !== TENORA_DATA_TABLE_SELECTION_COLUMN_ID);

  const freezeColumn = (columnId: string, side: 'left' | 'right') => {
    const column = table.getColumn(columnId);
    if (!column) return;
    const pinned = column.getIsPinned();
    column.pin(pinned === side ? false : side);
  };

  return (
    <TenoraPopover>
      <TenoraPopover.Trigger>
        <TenoraButton size="sm" variant="secondary">
          Columns
        </TenoraButton>
      </TenoraPopover.Trigger>
      <TenoraPopover.Content className="w-80 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Columns · freeze · group
        </p>
        <div className="max-h-64 space-y-1 overflow-auto">
          {leafColumns.map((column) => (
            <label key={column.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
              />
              <span className="min-w-0 flex-1 truncate">
                {String(column.columnDef.header ?? column.id)}
              </span>
              <span className="inline-flex gap-0.5">
                <TenoraButton
                  size="sm"
                  variant={column.getIsPinned() === 'left' ? 'primary' : 'ghost'}
                  isIconOnly
                  aria-label={`Freeze ${column.id} left`}
                  onPress={() => freezeColumn(column.id, 'left')}
                >
                  ◧
                </TenoraButton>
                <TenoraButton
                  size="sm"
                  variant={column.getIsPinned() === 'right' ? 'primary' : 'ghost'}
                  isIconOnly
                  aria-label={`Freeze ${column.id} right`}
                  onPress={() => freezeColumn(column.id, 'right')}
                >
                  ◨
                </TenoraButton>
                {column.getCanGroup() ? (
                  <TenoraButton
                    size="sm"
                    variant={column.getIsGrouped() ? 'primary' : 'ghost'}
                    isIconOnly
                    aria-label={`Group by ${column.id}`}
                    onPress={() => column.toggleGrouping()}
                  >
                    G
                  </TenoraButton>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </TenoraPopover.Content>
    </TenoraPopover>
  );
});

export type TenoraDataTableToolbarSlotsProps = {
  search?: TenoraDataTableSearchConfig;
  retry?: TenoraDataTableRetryConfig;
  toolbar?: ReactNode;
  showColumnPanel?: boolean;
  favorites?: TenoraDataTableFavoritesConfig;
  filter?: TenoraDataTableFilterConfig;
  columnsUi?: TenoraDataTableColumnsUiConfig;
  grouping?: TenoraDataTableGroupingConfig;
};

export const TenoraDataTableToolbarSlots = memo(function TenoraDataTableToolbarSlots({
  search,
  retry,
  toolbar,
  showColumnPanel = true,
  favorites,
  filter,
  columnsUi,
  grouping,
}: TenoraDataTableToolbarSlotsProps) {
  const hasSearchRefresh = Boolean(search?.onRefresh ?? retry?.onRefresh);

  return (
    <header className="shrink-0 border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-700/80">
      <div className="flex flex-wrap items-center gap-2">
        {search ? <TenoraDataTableToolbarSearch search={search} retry={retry} filter={filter} /> : null}
        <TenoraDataTableToolbarRetry retry={retry} hidden={hasSearchRefresh} />
        <TenoraDataTableSelectionBadge />
        <TenoraDataTableToolbarPinnedFilters pinnedFilterColumnIds={filter?.pinnedColumnIds} />
        <TenoraDataTableToolbarFavorites
          favorites={favorites}
          filter={filter}
          columnsUi={columnsUi}
          grouping={grouping}
        />
        {toolbar ? <div className="flex flex-wrap items-center gap-2">{toolbar}</div> : null}
        <TenoraDataTableColumnPanel show={showColumnPanel} />
      </div>
    </header>
  );
});

/** @deprecated use TenoraDataTableToolbarSlots inside TenoraDataTable */
export function TenoraDataTableToolbar<TData>(props: TenoraDataTableToolbarSlotsProps & {
  table?: Table<TData>;
  favoriteFilters?: TenoraDataTableFavoriteFilter[];
  onFavoriteFiltersChange?: (items: TenoraDataTableFavoriteFilter[]) => void;
  pinnedFilterColumnIds?: string[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  columnFilters?: ReturnType<Table<TData>['getState']>['columnFilters'];
  onColumnFiltersChange?: (filters: ReturnType<Table<TData>['getState']>['columnFilters']) => void;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  grouping?: string[];
  onGroupingChange?: (grouping: string[]) => void;
  selectedRowCount?: number;
}) {
  return <TenoraDataTableToolbarSlots {...props} />;
}
