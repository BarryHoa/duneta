'use client';

import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  type PaginationState,
  type SortingState,
  type Table as ReactTable,
} from '@tanstack/react-table';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Selection } from '@heroui/react';
import {
  createInitialColumnOrder,
  createInitialColumnPinning,
  withTanStackColumnSizing,
} from '../core/columns';
import { isDynamicDataType } from '../core/data-mode';
import {
  areSelectedIdsEqual,
  createSelectionColumn,
  selectedIdsToRowSelection,
} from '../core/row-selection';
import { toSortDescriptor, toSortingState } from '../core/sort';
import type {
  TenoraDataTableDataType,
  TenoraDataTablePaginationConfig,
  TenoraDataTableProps,
  TenoraDataTableRowSelectionConfig,
  TenoraDataTableSortConfig,
} from '../types';

export type UseTenoraDataTableOptions<TData extends object> = {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  dataType?: TenoraDataTableDataType;
  pagination?: false | TenoraDataTablePaginationConfig;
  sort?: TenoraDataTableSortConfig;
  getRowId?: TenoraDataTableProps<TData>['getRowId'];
  rowSelection?: TenoraDataTableRowSelectionConfig;
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
};

export function useTenoraDataTable<TData extends object>({
  columns,
  data,
  dataType,
  pagination = false,
  sort,
  getRowId,
  rowSelection: rowSelectionConfig,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
}: UseTenoraDataTableOptions<TData>): {
  table: ReactTable<TData>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnOrder: ColumnOrderState;
  setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>;
  sortDescriptor: ReturnType<typeof toSortDescriptor>;
  rowSelectionEnabled: boolean;
  selectedRowCount: number;
  selectedKeys: Selection;
  onSelectionChange: (keys: Selection) => void;
} {
  const isDynamic = isDynamicDataType(dataType);
  const paginationEnabled = pagination !== false;

  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const rowSelectionEnabled = rowSelectionConfig != null;

  const sortingFromProps = useMemo(
    () => (sort?.descriptor ? toSortingState(sort.descriptor) : []),
    [sort?.descriptor],
  );

  const sorting = isDynamic ? sortingFromProps : internalSorting;

  const paginationState = useMemo((): PaginationState => {
    if (!paginationEnabled) {
      return { pageIndex: 0, pageSize: Math.max(data.length, 1) };
    }
    return {
      pageIndex: Math.max(0, pagination.page - 1),
      pageSize: pagination.pageSize,
    };
  }, [data.length, pagination, paginationEnabled]);

  const serverRowCount = useMemo(() => {
    if (!isDynamic || !paginationEnabled) return data.length;
    return pagination.total ?? data.length;
  }, [data.length, isDynamic, pagination, paginationEnabled]);

  const sizedColumns = useMemo(
    () => withTanStackColumnSizing(columns),
    [columns],
  );

  const groupSelection = rowSelectionConfig?.groupSelection ?? false;

  const tableColumns = useMemo(() => {
    if (!rowSelectionEnabled) return sizedColumns;
    return [
      createSelectionColumn<TData>({ groupSelection }),
      ...sizedColumns,
    ];
  }, [groupSelection, rowSelectionEnabled, sizedColumns]);

  const columnPinningFromMeta = useMemo(
    () => createInitialColumnPinning(tableColumns),
    [tableColumns],
  );

  const columnOrderFromMeta = useMemo(
    () => createInitialColumnOrder(tableColumns, columnPinningFromMeta),
    [tableColumns, columnPinningFromMeta],
  );

  const selectedIds = rowSelectionConfig?.selectedIds ?? [];
  const selectedIdsKey = selectedIds.join('\0');

  const rowSelection = useMemo(
    () =>
      rowSelectionEnabled ? selectedIdsToRowSelection(selectedIds) : {},
    [rowSelectionEnabled, selectedIdsKey],
  );

  const rowSelectionOnChangeRef = useRef(rowSelectionConfig?.onChange);
  rowSelectionOnChangeRef.current = rowSelectionConfig?.onChange;

  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(columnPinningFromMeta);
  const [internalColumnOrder, setInternalColumnOrder] =
    useState<ColumnOrderState>(columnOrderFromMeta);

  useEffect(() => {
    setColumnPinning(columnPinningFromMeta);
    setInternalColumnOrder(columnOrderFromMeta);
  }, [columnPinningFromMeta, columnOrderFromMeta]);

  const skipPageSelectionResetRef = useRef(true);
  useEffect(() => {
    if (!rowSelectionEnabled || !paginationEnabled) return;
    if (skipPageSelectionResetRef.current) {
      skipPageSelectionResetRef.current = false;
      return;
    }
    if (selectedIdsRef.current.length === 0) return;
    rowSelectionOnChangeRef.current?.([]);
  }, [paginationState.pageIndex, paginationEnabled, rowSelectionEnabled]);

  const columnOrder = controlledColumnOrder ?? internalColumnOrder;

  const setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>> = (
    value,
  ) => {
    const next =
      typeof value === 'function' ? value(columnOrder) : value;
    if (onColumnOrderChange) {
      onColumnOrderChange(next);
      return;
    }
    setInternalColumnOrder(next);
  };

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const current = isDynamic ? sortingFromProps : internalSorting;
    const next = typeof updater === 'function' ? updater(current) : updater;

    if (isDynamic) {
      const descriptor = toSortDescriptor(next);
      if (descriptor) sort?.onChange(descriptor);
      return;
    }

    setInternalSorting(next);
  };

  const handlePaginationChange = (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    if (!paginationEnabled) return;

    const next =
      typeof updater === 'function' ? updater(paginationState) : updater;

    if (next.pageIndex !== paginationState.pageIndex) {
      pagination.onPageChange?.(next.pageIndex + 1);
    }
    if (next.pageSize !== paginationState.pageSize) {
      pagination.onPageSizeChange?.(next.pageSize);
    }
  };

  const pageRowIdsRef = useRef<string[]>([]);

  const table = useReactTable({
    columns: tableColumns,
    data,
    getRowId,
    enableColumnPinning: true,
    enableRowSelection: rowSelectionEnabled,
    enableMultiRowSelection: true,
    manualPagination: isDynamic,
    manualSorting: isDynamic,
    rowCount: isDynamic && paginationEnabled ? serverRowCount : undefined,
    pageCount:
      isDynamic && paginationEnabled
        ? Math.max(1, Math.ceil(serverRowCount / pagination.pageSize))
        : undefined,
    initialState: {
      columnPinning: columnPinningFromMeta,
      columnOrder: columnOrderFromMeta,
      rowSelection,
    },
    state: {
      sorting,
      columnOrder,
      columnPinning,
      ...(paginationEnabled ? { pagination: paginationState } : {}),
      ...(rowSelectionEnabled ? { rowSelection } : {}),
    },
    onSortingChange: handleSortingChange,
    onColumnOrderChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(columnOrder) : updater;
      setColumnOrder(next);
    },
    onColumnPinningChange: setColumnPinning,
    onPaginationChange: paginationEnabled ? handlePaginationChange : undefined,
    onRowSelectionChange: rowSelectionEnabled
      ? (updater) => {
          const next =
            typeof updater === 'function' ? updater(rowSelection) : updater;
          const pageIdSet = new Set(pageRowIdsRef.current);
          const pageIds = Object.keys(next).filter(
            (id) => next[id] && pageIdSet.has(id),
          );
          if (areSelectedIdsEqual(pageIds, selectedIdsRef.current)) return;
          rowSelectionOnChangeRef.current?.(pageIds);
        }
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    ...(!isDynamic
      ? {
          getSortedRowModel: getSortedRowModel(),
          ...(paginationEnabled
            ? { getPaginationRowModel: getPaginationRowModel() }
            : {}),
        }
      : {}),
  });

  pageRowIdsRef.current = table.getRowModel().rows.map((row) => row.id);

  const sortDescriptor = useMemo(() => toSortDescriptor(sorting), [sorting]);
  const selectedKeys = useMemo(
    () => new Set(selectedIds),
    [selectedIdsKey],
  );

  const handleSelectionChange = useCallback((selection: Selection) => {
    const pageRowIds = pageRowIdsRef.current;
    const pageRowIdSet = new Set(pageRowIds);
    const ids =
      selection === 'all'
        ? pageRowIds
        : [...selection].map(String).filter((id) => pageRowIdSet.has(id));

    if (areSelectedIdsEqual(ids, selectedIdsRef.current)) return;
    rowSelectionOnChangeRef.current?.(ids);
  }, []);

  const selectedRowCount = selectedIds.length;

  return {
    table,
    sorting,
    setSorting: isDynamic
      ? () => {
          /* dynamic sort is controlled via `sort` prop */
        }
      : setInternalSorting,
    columnOrder,
    setColumnOrder,
    sortDescriptor,
    rowSelectionEnabled,
    selectedRowCount,
    selectedKeys,
    onSelectionChange: handleSelectionChange,
  };
}
