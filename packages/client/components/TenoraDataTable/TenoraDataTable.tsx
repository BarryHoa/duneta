'use client';

import { useCallback, useMemo } from 'react';
import { useClientMounted } from './state/use-client-mounted';
import { isColumnDragEnabled } from './core/column-drag';
import { isColumnResizeEnabled } from './core/column-resize';
import { getDataTableEngineState } from './core/get-engine-state';
import { toSortingState } from './core/sort-bridge';
import { useTenoraDataTable } from './core/useTenoraDataTable';
import { DEFAULT_TABLE_HEIGHT } from './constants';
import { DataTableContent } from './components/DataTableContent';
import { DataTablePlaceholder } from './components/DataTablePlaceholder';
import { DataTableRoot } from './components/DataTableRoot';
import {
  DataTableStaticBody,
  DataTableVirtualBody,
} from './components/body/DataTableBody';
import { DataTableColumnDnD } from './components/header/DataTableColumnDnD';
import { DataTableHeader } from './components/header/DataTableHeader';
import { getHeaderLabel } from './components/header/get-header-label';
import { DataTableFooter } from './components/pagination/DataTablePagination';
import { DataTableVirtualizer } from './components/DataTableVirtualizer';
import type { TenoraDataTableProps } from './types';

function TenoraDataTableImpl<TData extends object>({
  columns,
  data,
  pagination = false,
  getRowId,
  ariaLabel = 'Data table',
  className,
  variant,
  virtual = false,
  columnDrag,
  columnResize,
  height = DEFAULT_TABLE_HEIGHT,
}: TenoraDataTableProps<TData>) {
  const { table, setSorting, columnOrder, setColumnOrder, sortDescriptor } =
    useTenoraDataTable({ columns, data, getRowId });

  const { headers, columnCount } = getDataTableEngineState(table);
  const virtualEnabled = virtual && pagination === false;
  const showPagination = pagination !== false;
  const columnDragEnabled = isColumnDragEnabled(columnDrag);
  const columnResizeEnabled = isColumnResizeEnabled(columnResize);

  const sortableColumnIds = useMemo(
    () => headers.map((header) => header.column.id),
    [headers],
  );

  const columnLabels = useMemo(
    () =>
      Object.fromEntries(
        headers.map((header) => [header.column.id, getHeaderLabel(header)]),
      ),
    [headers],
  );

  const handleSortChange = useCallback(
    (descriptor: Parameters<typeof toSortingState>[0]) => {
      setSorting(toSortingState(descriptor));
    },
    [setSorting],
  );

  return (
    <DataTableVirtualizer enabled={virtualEnabled}>
      <DataTableColumnDnD
        enabled={columnDragEnabled}
        columnIds={sortableColumnIds}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
        onColumnOrderChange={setColumnOrder}
      >
        <DataTableRoot
          className={className}
          variant={variant}
          bodyMaxHeight={height}
          virtualEnabled={virtualEnabled}
          resizeEnabled={columnResizeEnabled}
          footer={
            showPagination ? (
              <DataTableFooter pagination={pagination} />
            ) : undefined
          }
        >
          <DataTableContent
            ariaLabel={ariaLabel}
            resizeEnabled={columnResizeEnabled}
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
          >
            <DataTableHeader
              headers={headers}
              columnDrag={columnDrag}
              columnResize={columnResize}
              resizeEnabled={columnResizeEnabled}
            />
            {virtualEnabled ? (
              <DataTableVirtualBody
                table={table}
                data={data}
                getRowId={getRowId}
                columnCount={columnCount}
              />
            ) : (
              <DataTableStaticBody table={table} columnCount={columnCount} />
            )}
          </DataTableContent>
        </DataTableRoot>
      </DataTableColumnDnD>
    </DataTableVirtualizer>
  );
}

/** Client-only table — skips SSR to avoid React Aria collection / dnd-kit hydration issues. */
export function TenoraDataTable<TData extends object>(
  props: TenoraDataTableProps<TData>,
) {
  const mounted = useClientMounted();

  if (!mounted) {
    return (
      <DataTablePlaceholder
        ariaLabel={props.ariaLabel}
        className={props.className}
        height={props.height}
      />
    );
  }

  return <TenoraDataTableImpl {...props} />;
}
