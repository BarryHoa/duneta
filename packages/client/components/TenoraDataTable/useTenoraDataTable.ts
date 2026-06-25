'use client';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnOrderState,
  type ColumnPinningState,
  type Table,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState, useId } from 'react';
import type { SortDescriptor } from '@heroui/react';
import { createTenoraDataTableSelectionColumn } from './selection-column';
import type { TenoraDataTableColumnMeta, UseTenoraDataTableOptions } from './types';
import { TENORA_DATA_TABLE_DEFAULT_MIN_WIDTH, TENORA_DATA_TABLE_SELECTION_COLUMN_ID } from './types';
import { TENORA_DATA_TABLE_DEFAULT_COLUMN_WIDTH } from './column-width';
import {
  normalizeRowSelectionChange,
  rowSelectionToSelectedIds,
  selectedIdsToRowSelection,
} from './row-selection';
import { descriptorToSortingState, sortingStateToDescriptor } from './utils';

function freezeFromColumns<TData>(columns: UseTenoraDataTableOptions<TData>['columns']): ColumnPinningState {
  const left: string[] = [];
  const right: string[] = [];
  for (const column of columns) {
    const id = column.id ?? ('accessorKey' in column ? String(column.accessorKey) : undefined);
    if (!id) continue;
    const meta = column.meta as TenoraDataTableColumnMeta | undefined;
    const freeze = meta?.freeze ?? meta?.pin;
    if (freeze === 'left') left.push(id);
    if (freeze === 'right') right.push(id);
  }
  return { left, right };
}

function withSelectionColumn<TData>(
  columns: UseTenoraDataTableOptions<TData>['columns'],
  rowSelectionConfig?: UseTenoraDataTableOptions<TData>['rowSelectionConfig'],
  instanceId?: string,
) {
  if (!rowSelectionConfig) return columns;
  if (columns.some((column) => column.id === TENORA_DATA_TABLE_SELECTION_COLUMN_ID)) return columns;
  return [
    createTenoraDataTableSelectionColumn<TData>({ ...rowSelectionConfig, instanceId }),
    ...columns,
  ];
}

function defaultColumnOrder<TData>(columns: UseTenoraDataTableOptions<TData>['columns']): ColumnOrderState {
  return columns
    .map((column) => column.id ?? ('accessorKey' in column ? String(column.accessorKey) : ''))
    .filter(Boolean);
}

export function useTenoraDataTable<TData>({
  data,
  columns,
  getRowId,
  sortDescriptor: controlledSortDescriptor,
  onSortChange,
  manualSorting = false,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  manualFiltering = false,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  columnPinning: controlledColumnPinning,
  onColumnPinningChange,
  grouping: controlledGrouping,
  onGroupingChange,
  pinGroupedColumns = true,
  clientPagination = false,
  rowSelectionConfig,
  instanceId,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  enableColumnResize = true,
  columnSizingDefaults,
}: UseTenoraDataTableOptions<TData>): {
  table: Table<TData>;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (sort: SortDescriptor) => void;
  instanceId: string;
} {
  const autoInstanceId = useId().replaceAll(':', '');
  const resolvedInstanceId = instanceId ?? autoInstanceId;

  const sizingDefaults = {
    minWidth: columnSizingDefaults?.minWidth ?? TENORA_DATA_TABLE_DEFAULT_MIN_WIDTH,
    maxWidth: columnSizingDefaults?.maxWidth ?? 'auto',
    defaultWidth: columnSizingDefaults?.defaultWidth ?? TENORA_DATA_TABLE_DEFAULT_COLUMN_WIDTH,
  };

  const resolvedColumns = useMemo(
    () => withSelectionColumn(columns, rowSelectionConfig, resolvedInstanceId),
    [columns, rowSelectionConfig, resolvedInstanceId],
  );

  const [sorting, setSorting] = useState(() => descriptorToSortingState(controlledSortDescriptor));
  const [globalFilter, setGlobalFilter] = useState(controlledGlobalFilter ?? '');
  const [columnFilters, setColumnFilters] = useState(controlledColumnFilters ?? []);
  const [columnVisibility, setColumnVisibility] = useState(controlledColumnVisibility ?? {});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    () => controlledColumnPinning ?? freezeFromColumns(resolvedColumns),
  );
  const [grouping, setGrouping] = useState(controlledGrouping ?? []);
  const [rowSelection, setRowSelection] = useState(() =>
    rowSelectionConfig ? selectedIdsToRowSelection(rowSelectionConfig.selectedIds) : {},
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    () => controlledColumnOrder ?? defaultColumnOrder(resolvedColumns),
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: clientPagination ? (clientPagination.pageSize ?? 50) : 50,
  });

  useEffect(() => {
    if (controlledSortDescriptor) setSorting(descriptorToSortingState(controlledSortDescriptor));
  }, [controlledSortDescriptor]);

  useEffect(() => {
    if (controlledGlobalFilter !== undefined) setGlobalFilter(controlledGlobalFilter);
  }, [controlledGlobalFilter]);

  useEffect(() => {
    if (controlledColumnFilters) setColumnFilters(controlledColumnFilters);
  }, [controlledColumnFilters]);

  useEffect(() => {
    if (controlledColumnVisibility) setColumnVisibility(controlledColumnVisibility);
  }, [controlledColumnVisibility]);

  useEffect(() => {
    if (controlledColumnPinning) setColumnPinning(controlledColumnPinning);
  }, [controlledColumnPinning]);

  useEffect(() => {
    if (controlledGrouping) setGrouping(controlledGrouping);
  }, [controlledGrouping]);

  useEffect(() => {
    if (rowSelectionConfig) {
      setRowSelection(selectedIdsToRowSelection(rowSelectionConfig.selectedIds));
    }
  }, [rowSelectionConfig?.selectedIds, rowSelectionConfig]);

  useEffect(() => {
    if (controlledColumnOrder) setColumnOrder(controlledColumnOrder);
  }, [controlledColumnOrder]);

  const resolvedPinning = useMemo<ColumnPinningState>(() => {
    let left = [...(columnPinning.left ?? [])];
    if (rowSelectionConfig && !left.includes(TENORA_DATA_TABLE_SELECTION_COLUMN_ID)) {
      left = [TENORA_DATA_TABLE_SELECTION_COLUMN_ID, ...left];
    }
    if (pinGroupedColumns && grouping.length > 0) {
      left = [...new Set([...grouping, ...left])];
    }
    return { ...columnPinning, left };
  }, [columnPinning, grouping, pinGroupedColumns, rowSelectionConfig]);

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    defaultColumn: {
      size: sizingDefaults.defaultWidth,
      minSize: sizingDefaults.minWidth,
      maxSize: sizingDefaults.maxWidth === 'auto' ? undefined : sizingDefaults.maxWidth,
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      columnPinning: resolvedPinning,
      grouping,
      rowSelection,
      columnOrder,
      ...(clientPagination ? { pagination } : {}),
    },
    enableRowSelection: Boolean(rowSelectionConfig),
    enableColumnResizing: enableColumnResize,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === 'function' ? updater(globalFilter) : updater;
      setGlobalFilter(next);
      onGlobalFilterChange?.(next);
    },
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(next);
      onColumnFiltersChange?.(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(next);
      onColumnVisibilityChange?.(next);
    },
    onColumnPinningChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnPinning) : updater;
      setColumnPinning(next);
      onColumnPinningChange?.(next);
    },
    onGroupingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(grouping) : updater;
      setGrouping(next);
      onGroupingChange?.(next);
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (rowSelectionConfig) {
        rowSelectionConfig.onChange(normalizeRowSelectionChange(rowSelectionConfig, next));
      }
    },
    onColumnOrderChange: (updater) => {
      const next = typeof updater === 'function' ? updater(columnOrder) : updater;
      setColumnOrder(next);
      onColumnOrderChange?.(next);
    },
    onPaginationChange: clientPagination ? setPagination : undefined,
    getRowId: getRowId ? (row, index) => getRowId(row as TData, index) : undefined,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
    ...(manualFiltering ? {} : { getFilteredRowModel: getFilteredRowModel() }),
    ...(grouping.length ? { getGroupedRowModel: getGroupedRowModel() } : {}),
    ...(clientPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    manualSorting,
    manualFiltering,
    enableColumnPinning: true,
    enableGrouping: true,
  });

  const sortDescriptor = useMemo(
    () => controlledSortDescriptor ?? sortingStateToDescriptor(sorting),
    [controlledSortDescriptor, sorting],
  );

  const handleSortChange = useCallback(
    (next: SortDescriptor) => {
      if (onSortChange) {
        onSortChange(next);
        return;
      }
      setSorting(descriptorToSortingState(next));
    },
    [onSortChange],
  );

  return { table, sortDescriptor, onSortChange: handleSortChange, instanceId: resolvedInstanceId };
}

export { rowSelectionToSelectedIds };
