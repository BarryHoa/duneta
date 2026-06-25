'use client';

import type { SortDescriptor } from '@heroui/react';
import type { ColumnPinningState, GroupingState, Table, VisibilityState } from '@tanstack/react-table';
import { useCallback, useRef, useSyncExternalStore } from 'react';
import { TENORA_DATA_TABLE_SELECTION_COLUMN_ID } from './types';
import { sortingStateToDescriptor } from './utils';

type TableListener = () => void;

function subscribeTable<TData>(table: Table<TData>, onStoreChange: TableListener) {
  const subscribe = (
    table as Table<TData> & { subscribe?: (listener: TableListener) => () => void }
  ).subscribe;

  if (subscribe) {
    return subscribe.call(table, onStoreChange);
  }

  const previous = table.options.onStateChange;
  table.setOptions((options) => ({
    ...options,
    onStateChange: (updater) => {
      previous?.(updater);
      onStoreChange();
    },
  }));

  return () => {
    table.setOptions((options) => ({
      ...options,
      onStateChange: previous,
    }));
  };
}

export function useTenoraDataTableStore<TData, TSelected>(
  table: Table<TData>,
  select: (table: Table<TData>) => TSelected,
  isEqual: (previous: TSelected, next: TSelected) => boolean = Object.is,
): TSelected {
  const selectRef = useRef(select);
  selectRef.current = select;

  const cacheRef = useRef<TSelected>(select(table));

  const getSnapshot = useCallback(() => {
    const next = selectRef.current(table);
    if (isEqual(cacheRef.current, next)) {
      return cacheRef.current;
    }
    cacheRef.current = next;
    return next;
  }, [table, isEqual]);

  const subscribe = useCallback(
    (onStoreChange: TableListener) =>
      subscribeTable(table, () => {
        const next = selectRef.current(table);
        if (!isEqual(cacheRef.current, next)) {
          cacheRef.current = next;
          onStoreChange();
        }
      }),
    [table, isEqual],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useTenoraDataTableSelectedCount<TData>(table: Table<TData>) {
  return useTenoraDataTableStore(table, (instance) => instance.getSelectedRowModel().rows.length);
}

export function useTenoraDataTableSortDescriptor<TData>(table: Table<TData>) {
  return useTenoraDataTableStore(
    table,
    (instance) => sortingStateToDescriptor(instance.getState().sorting),
    (previous, next) =>
      previous?.column === next?.column && previous?.direction === next?.direction,
  );
}

export function useTenoraDataTableColumnUiRevision<TData>(table: Table<TData>) {
  return useTenoraDataTableStore(
    table,
    (instance) => {
      const state = instance.getState();
      return {
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        grouping: state.grouping,
      };
    },
    (
      previous: {
        columnVisibility: VisibilityState;
        columnPinning: ColumnPinningState;
        grouping: GroupingState;
      },
      next: {
        columnVisibility: VisibilityState;
        columnPinning: ColumnPinningState;
        grouping: GroupingState;
      },
    ) =>
      previous.columnVisibility === next.columnVisibility &&
      previous.columnPinning === next.columnPinning &&
      arraysEqual(previous.grouping, next.grouping),
  );
}

export function useTenoraDataTablePinnedFilterColumns<TData>(
  table: Table<TData>,
  pinnedFilterColumnIds: string[] = [],
) {
  return useTenoraDataTableStore(
    table,
    (instance) => {
      const ids = new Set(pinnedFilterColumnIds);
      return instance
        .getAllLeafColumns()
        .filter((column) => column.id !== TENORA_DATA_TABLE_SELECTION_COLUMN_ID)
        .filter((column) => {
          const meta = column.columnDef.meta as { filterPin?: boolean } | undefined;
          if (meta?.filterPin) ids.add(column.id);
          return ids.has(column.id) && column.getCanFilter();
        });
    },
    (previous, next) =>
      previous.length === next.length && previous.every((column, index) => column.id === next[index]?.id),
  );
}

export function useTenoraDataTableGridSnapshot<TData>(table: Table<TData>) {
  return useTenoraDataTableStore(table, (instance) => {
    const state = instance.getState();
    return {
      rows: instance.getRowModel().rows,
      headerGroups: instance.getHeaderGroups(),
      leftColumns: instance.getLeftVisibleLeafColumns(),
      centerColumns: instance.getCenterVisibleLeafColumns(),
      rightColumns: instance.getRightVisibleLeafColumns(),
      rowSelection: state.rowSelection,
      sorting: state.sorting,
      columnPinning: state.columnPinning,
      columnOrder: state.columnOrder,
      columnVisibility: state.columnVisibility,
      columnSizing: state.columnSizing,
      grouping: state.grouping,
    };
  });
}

function arraysEqual<T>(previous: T[], next: T[]) {
  if (previous.length !== next.length) return false;
  for (let index = 0; index < previous.length; index += 1) {
    if (previous[index] !== next[index]) return false;
  }
  return true;
}

export type TenoraDataTableSortDescriptor = SortDescriptor | undefined;
