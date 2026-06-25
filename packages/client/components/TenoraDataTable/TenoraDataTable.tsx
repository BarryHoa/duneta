'use client';

import { useCallback, useMemo, useRef, type ReactNode } from 'react';
import { cn } from '../../helpers';
import { TenoraButton } from '../TenoraButton';
import { TenoraLoadError } from '../TenoraLoadError';
import { TenoraSkeleton } from '../TenoraSkeleton';
import { TENORA_DATA_TABLE_CONTENT_MAX_HEIGHT } from './TenoraDataTableGrid';
import { TenoraDataTableGridRegion } from './TenoraDataTableGridRegion';
import { TenoraDataTablePaginationFooterRegion } from './TenoraDataTablePaginationFooterRegion';
import { TenoraDataTableProvider } from './TenoraDataTableContext';
import { TenoraDataTableToolbarRegion } from './TenoraDataTableToolbarRegion';
import { isTenoraDataTableFeatureEnabled } from './feature';
import { useTenoraDataTable } from './useTenoraDataTable';
import type {
  TenoraDataTablePaginationOffsetConfig,
  TenoraDataTableProps,
} from './types';
import { resolveRangeLine } from './utils';

const shellClassName =
  'flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-700/70 dark:bg-zinc-950';

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <TenoraSkeleton className="h-10 w-full rounded-lg" />
      <TenoraSkeleton className="h-10 w-full rounded-lg" />
      <TenoraSkeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

type TenoraDataTableEngineProps<TData> = TenoraDataTableProps<TData> & {
  children: ReactNode;
};

/** Hosts TanStack table state; children subscribe selectively via context + table store. */
function TenoraDataTableEngine<TData>({
  data,
  columns,
  getRowId,
  pagination,
  rowSelection,
  freeze,
  grouping,
  sort,
  filter,
  columnsUi,
  table: externalTable,
  instanceId,
  children,
}: TenoraDataTableEngineProps<TData>) {
  const paginationEnabled = isTenoraDataTableFeatureEnabled(pagination);
  const rowSelectionEnabled = isTenoraDataTableFeatureEnabled(rowSelection);
  const freezeEnabled = isTenoraDataTableFeatureEnabled(freeze);
  const groupingEnabled = isTenoraDataTableFeatureEnabled(grouping);
  const sortEnabled = isTenoraDataTableFeatureEnabled(sort);
  const filterEnabled = isTenoraDataTableFeatureEnabled(filter);
  const columnsUiEnabled = isTenoraDataTableFeatureEnabled(columnsUi);

  const clientPagination =
    paginationEnabled && pagination.mode === 'client'
      ? { pageSize: pagination.pageSize }
      : false;

  const internal = useTenoraDataTable({
    data,
    columns,
    getRowId,
    sortDescriptor: sortEnabled ? sort.descriptor : undefined,
    onSortChange: sortEnabled ? sort.onChange : undefined,
    manualSorting: sortEnabled ? sort.manual : false,
    globalFilter: filterEnabled ? filter.global : undefined,
    onGlobalFilterChange: filterEnabled ? filter.onGlobalChange : undefined,
    columnFilters: filterEnabled ? filter.columnFilters : undefined,
    onColumnFiltersChange: filterEnabled ? filter.onColumnFiltersChange : undefined,
    manualFiltering: filterEnabled ? filter.manual : false,
    columnVisibility: columnsUiEnabled ? columnsUi.visibility : undefined,
    onColumnVisibilityChange: columnsUiEnabled ? columnsUi.onVisibilityChange : undefined,
    columnPinning: freezeEnabled
      ? { left: freeze.left, right: freeze.right }
      : undefined,
    onColumnPinningChange: freezeEnabled
      ? (pinning) => freeze.onChange?.(pinning)
      : undefined,
    grouping: groupingEnabled ? grouping.columns : undefined,
    onGroupingChange: groupingEnabled ? grouping.onChange : undefined,
    pinGroupedColumns: freezeEnabled ? freeze.pinGroupedColumns : true,
    clientPagination,
    rowSelectionConfig: rowSelectionEnabled ? rowSelection : undefined,
    instanceId,
    columnOrder: columnsUiEnabled ? columnsUi.order : undefined,
    onColumnOrderChange: columnsUiEnabled ? columnsUi.onOrderChange : undefined,
    enableColumnResize: columnsUiEnabled ? columnsUi.resize !== false : false,
    columnSizingDefaults: columnsUiEnabled
      ? {
          minWidth: columnsUi.minWidth,
          maxWidth: columnsUi.maxWidth,
          defaultWidth: columnsUi.defaultWidth,
        }
      : undefined,
  });

  const table = externalTable ?? internal.table;
  const onSortChange = externalTable
    ? sortEnabled
      ? (sort.onChange ?? (() => undefined))
      : () => undefined
    : internal.onSortChange;

  const onSortChangeRef = useRef(onSortChange);
  onSortChangeRef.current = onSortChange;

  const stableOnSortChange = useCallback((next: Parameters<typeof onSortChange>[0]) => {
    onSortChangeRef.current(next);
  }, []);

  const contextValue = useMemo(
    () => ({ table, onSortChange: stableOnSortChange }),
    [table, stableOnSortChange],
  );

  return (
    <TenoraDataTableProvider value={contextValue}>{children}</TenoraDataTableProvider>
  );
}

export function TenoraDataTable<TData>({
  data,
  columns,
  getRowId,
  loading,
  error,
  empty,
  ariaLabel = 'Data table',
  instanceId,
  className,
  contentMaxHeight = TENORA_DATA_TABLE_CONTENT_MAX_HEIGHT,
  toolbar,
  search,
  pagination,
  rowSelection,
  virtual,
  freeze,
  grouping,
  sort,
  filter,
  favorites,
  columnsUi,
  edit,
  retry,
  table: externalTable,
}: TenoraDataTableProps<TData>) {
  const searchEnabled = isTenoraDataTableFeatureEnabled(search);
  const paginationEnabled = isTenoraDataTableFeatureEnabled(pagination);
  const rowSelectionEnabled = isTenoraDataTableFeatureEnabled(rowSelection);
  const virtualEnabled = isTenoraDataTableFeatureEnabled(virtual);
  const freezeEnabled = isTenoraDataTableFeatureEnabled(freeze);
  const groupingEnabled = isTenoraDataTableFeatureEnabled(grouping);
  const filterEnabled = isTenoraDataTableFeatureEnabled(filter);
  const favoritesEnabled = isTenoraDataTableFeatureEnabled(favorites);
  const columnsUiEnabled = isTenoraDataTableFeatureEnabled(columnsUi);
  const editEnabled = isTenoraDataTableFeatureEnabled(edit);
  const retryEnabled = isTenoraDataTableFeatureEnabled(retry);
  const errorEnabled = isTenoraDataTableFeatureEnabled(error);

  const virtualRows = virtualEnabled ? virtual.rows !== false : true;
  const virtualColumns = virtualEnabled ? virtual.columns !== false : true;

  const offsetPagination: TenoraDataTablePaginationOffsetConfig | undefined =
    paginationEnabled && pagination.mode !== 'client' ? pagination : undefined;

  const showToolbar =
    searchEnabled ||
    (retryEnabled && Boolean(retry?.onRefresh)) ||
    Boolean(toolbar) ||
    rowSelectionEnabled ||
    (columnsUiEnabled && columnsUi.showPanel !== false) ||
    favoritesEnabled ||
    Boolean(filterEnabled && filter.pinnedColumnIds?.length);

  const showFooter =
    Boolean(offsetPagination) &&
    (Boolean(resolveRangeLine(offsetPagination, data.length)) ||
      (offsetPagination?.limit != null && offsetPagination.total > offsetPagination.limit));

  const toolbarRegion = showToolbar ? (
    <TenoraDataTableToolbarRegion
      search={searchEnabled ? search : undefined}
      retry={retryEnabled ? retry : undefined}
      toolbar={toolbar}
      showColumnPanel={columnsUiEnabled ? columnsUi.showPanel !== false : true}
      favorites={favoritesEnabled ? favorites : undefined}
      filter={filterEnabled ? filter : undefined}
      columnsUi={columnsUiEnabled ? columnsUi : undefined}
      grouping={groupingEnabled ? grouping : undefined}
    />
  ) : null;

  const engineProps = {
    data,
    columns,
    getRowId,
    search,
    pagination,
    rowSelection,
    freeze,
    grouping,
    sort,
    filter,
    columnsUi,
    table: externalTable,
    instanceId,
  };

  if (loading) {
    return (
      <div className={cn(shellClassName, className)}>
        <TenoraDataTableEngine {...engineProps}>{toolbarRegion}</TenoraDataTableEngine>
        <TableSkeleton />
      </div>
    );
  }

  if (errorEnabled) {
    return (
      <div className={cn(shellClassName, className)}>
        <TenoraDataTableEngine {...engineProps}>{toolbarRegion}</TenoraDataTableEngine>
        <div className="p-4">
          <TenoraLoadError onRetry={error.onRetry ?? (retryEnabled ? retry?.onRetry : undefined)} />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn(shellClassName, className)}>
        <TenoraDataTableEngine {...engineProps}>{toolbarRegion}</TenoraDataTableEngine>
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {empty?.title ?? 'No data'}
          </p>
          {empty?.description ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{empty.description}</p>
          ) : null}
          {empty?.actionLabel && empty.onAction ? (
            <TenoraButton className="mt-4" size="sm" variant="primary" onPress={empty.onAction}>
              {empty.actionLabel}
            </TenoraButton>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(shellClassName, className)}>
      <TenoraDataTableEngine {...engineProps}>
        {toolbarRegion}
        <div className="flex min-h-0 w-full flex-1 flex-col">
          <TenoraDataTableGridRegion
            ariaLabel={ariaLabel}
            contentMaxHeight={contentMaxHeight}
            virtual={virtualEnabled ? virtual : undefined}
            virtualRows={virtualRows}
            virtualColumns={virtualColumns}
            columnsUi={columnsUiEnabled ? columnsUi : undefined}
            columnsUiEnabled={columnsUiEnabled}
            edit={editEnabled ? edit : undefined}
            editEnabled={editEnabled}
          />
          {showFooter && offsetPagination ? (
            <TenoraDataTablePaginationFooterRegion
              pagination={offsetPagination}
              pageItemCount={data.length}
            />
          ) : null}
        </div>
      </TenoraDataTableEngine>
    </div>
  );
}
