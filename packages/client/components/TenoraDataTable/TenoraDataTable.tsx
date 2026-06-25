'use client';

import { useCallback, useMemo } from 'react';
import { DataTableContent } from './components/DataTableContent';
import { DataTablePlaceholder } from './components/DataTablePlaceholder';
import { DataTableRoot } from './components/DataTableRoot';
import { DataTableVirtualizer } from './components/DataTableVirtualizer';
import {
  DataTableStaticBody,
  DataTableVirtualBody,
} from './components/body/DataTableBody';
import { DataTableColumnDnD } from './components/header/DataTableColumnDnD';
import { DataTableHeader } from './components/header/DataTableHeader';
import { DataTableFooter } from './components/footer/DataTableFooter';
import { DEFAULT_TABLE_HEIGHT } from './constants';
import {
  getTablePinnedColumnIds,
  isColumnDragEnabled,
  isColumnDraggable,
  isColumnPinned,
  isColumnResizeEnabled,
} from './core/columns';
import { toSortingState } from './core/sort';
import { isDynamicDataType, resolveFooterPagination } from './core/data-mode';
import { getDataTableEngineState, getHeaderLabel } from './core/table';
import { useClientMounted } from './hooks/use-client-mounted';
import { useTenoraDataTable } from './hooks/use-tenora-data-table';
import type { TenoraDataTableProps } from './types';

function TenoraDataTableImpl<TData extends object>({
  columns,
  data,
  dataType,
  pagination = false,
  sort,
  getRowId,
  ariaLabel = 'Data table',
  className,
  variant,
  virtual = false,
  columnDrag,
  columnResize,
  rowSelection,
  height = DEFAULT_TABLE_HEIGHT,
}: TenoraDataTableProps<TData>) {
  const rowSelectionConfig =
    rowSelection === false || rowSelection == null ? undefined : rowSelection;

  const {
    table,
    setSorting,
    columnOrder,
    setColumnOrder,
    sortDescriptor,
    rowSelectionEnabled,
    selectedKeys,
    onSelectionChange,
  } = useTenoraDataTable({
    columns,
    data,
    dataType,
    pagination,
    sort,
    getRowId,
    rowSelection: rowSelectionConfig,
  });

  const footerPagination = useMemo(() => {
    if (pagination === false) return null;
    return resolveFooterPagination(dataType, data.length, pagination);
  }, [data.length, dataType, pagination]);

  const { headers, columnCount } = getDataTableEngineState(table);
  const virtualEnabled = virtual && pagination === false;
  const columnDragEnabled = isColumnDragEnabled(columnDrag);
  const columnResizeEnabled = isColumnResizeEnabled(columnResize);
  const pinEnabled = table.getIsSomeColumnsPinned();
  const pinnedColumnIds = getTablePinnedColumnIds(table);

  const sortableColumnIds = useMemo(
    () =>
      headers
        .filter((header) =>
          isColumnDraggable(
            columnDrag,
            header.column.id,
            isColumnPinned(header.column),
          ),
        )
        .map((header) => header.column.id),
    [columnDrag, headers],
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
      if (isDynamicDataType(dataType)) {
        sort?.onChange(descriptor);
        return;
      }
      setSorting(toSortingState(descriptor));
    },
    [dataType, setSorting, sort],
  );

  return (
    <DataTableVirtualizer enabled={virtualEnabled}>
      <DataTableColumnDnD
        enabled={columnDragEnabled}
        columnIds={sortableColumnIds}
        lockedColumnIds={pinnedColumnIds}
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
            footerPagination ? (
              <DataTableFooter pagination={footerPagination} />
            ) : undefined
          }
        >
          <DataTableContent
            ariaLabel={ariaLabel}
            resizeEnabled={columnResizeEnabled}
            pinEnabled={pinEnabled}
            tableMinWidth={pinEnabled ? table.getTotalSize() : undefined}
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            rowSelectionEnabled={rowSelectionEnabled}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          >
            <DataTableHeader
              headers={headers}
              table={table}
              columnDrag={columnDrag}
              columnResize={columnResize}
              resizeEnabled={columnResizeEnabled}
              pinEnabled={pinEnabled}
            />
            {virtualEnabled ? (
              <DataTableVirtualBody
                table={table}
                data={data}
                getRowId={getRowId}
                columnCount={columnCount}
                pinEnabled={pinEnabled}
              />
            ) : (
              <DataTableStaticBody
                table={table}
                columnCount={columnCount}
                pinEnabled={pinEnabled}
              />
            )}
          </DataTableContent>
        </DataTableRoot>
      </DataTableColumnDnD>
    </DataTableVirtualizer>
  );
}

/** Client-only — skips SSR to avoid React Aria / dnd-kit hydration issues. */
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
