'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender, type Column, type Header, type Table } from '@tanstack/react-table';
import { useRef, useState, memo, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import type { SortDescriptor } from '@heroui/react';
import { cn } from '../../helpers';
import { TenoraTable } from '../TenoraTable';
import {
  columnSizingStyle,
  getTenoraDataTableColumnWidth,
  resolveTenoraDataTableColumnSizing,
} from './column-width';
import { TenoraDataTableEditableCell } from './TenoraDataTableEditableCell';
import type { TenoraDataTableColumnMeta, TenoraDataTableEditingCell } from './types';
import { TENORA_DATA_TABLE_SELECTION_COLUMN_ID } from './types';
import { useTenoraDataTableGridSnapshot, useTenoraDataTableSortDescriptor } from './table-store';

export const TENORA_DATA_TABLE_CONTENT_MAX_HEIGHT = 'max-h-[min(70vh,720px)]';

function freezeStyle<TData>(column: Column<TData, unknown>, zIndex: number): CSSProperties {
  const pinned = column.getIsPinned();
  if (!pinned) return {};
  return {
    position: 'sticky',
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex,
    background: 'inherit',
    boxShadow:
      pinned === 'left'
        ? '2px 0 4px -2px rgb(0 0 0 / 0.08)'
        : pinned === 'right'
          ? '-2px 0 4px -2px rgb(0 0 0 / 0.08)'
          : undefined,
  };
}

function reorderColumnIds(order: string[], sourceId: string, targetId: string) {
  if (sourceId === targetId) return order;
  const next = order.filter((id) => id !== sourceId);
  const targetIndex = next.indexOf(targetId);
  if (targetIndex < 0) return order;
  next.splice(targetIndex, 0, sourceId);
  return next;
}

function SpacerCell({ width }: { width: number }) {
  if (width <= 0) return null;
  return (
    <TenoraTable.Cell
      aria-hidden
      className="p-0"
      style={{ width, minWidth: width, maxWidth: width, padding: 0, border: 'none' }}
    />
  );
}

function TenoraDataTableGridInner<TData>({
  table,
  ariaLabel,
  onSortChange,
  contentMaxHeight = TENORA_DATA_TABLE_CONTENT_MAX_HEIGHT,
  virtualRows = true,
  virtualColumns = true,
  estimatedRowHeight = 40,
  rowOverscan = 12,
  estimatedColumnWidth = 120,
  columnOverscan = 4,
  enableResize = true,
  enableDrag = true,
  columnSizingDefaults,
  editingCell,
  onEditingCellChange,
  onCellEdit,
}: {
  table: Table<TData>;
  ariaLabel: string;
  onSortChange: (sort: SortDescriptor) => void;
  contentMaxHeight?: string;
  virtualRows?: boolean;
  virtualColumns?: boolean;
  estimatedRowHeight?: number;
  rowOverscan?: number;
  estimatedColumnWidth?: number;
  columnOverscan?: number;
  enableResize?: boolean;
  enableDrag?: boolean;
  columnSizingDefaults?: {
    minWidth?: number;
    maxWidth?: number | 'auto';
    defaultWidth?: number;
  };
  editingCell?: TenoraDataTableEditingCell;
  onEditingCellChange?: (cell: TenoraDataTableEditingCell) => void;
  onCellEdit?: (edit: {
    rowId: string;
    columnId: string;
    row: TData;
    value: unknown;
  }) => void | Promise<void>;
}) {
  const sortDescriptor = useTenoraDataTableSortDescriptor(table);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragColumnId, setDragColumnId] = useState<string | null>(null);
  const {
    rows,
    headerGroups,
    leftColumns,
    centerColumns,
    rightColumns,
  } = useTenoraDataTableGridSnapshot(table);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: rowOverscan,
    enabled: virtualRows && rows.length > 0,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: centerColumns.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      centerColumns[index]
        ? getTenoraDataTableColumnWidth(centerColumns[index])
        : estimatedColumnWidth,
    overscan: columnOverscan,
    enabled: virtualColumns && centerColumns.length > 0,
  });

  const virtualRowItems = virtualRows ? rowVirtualizer.getVirtualItems() : null;
  const virtualCenterColumns = virtualColumns
    ? columnVirtualizer.getVirtualItems().map((item) => centerColumns[item.index]).filter(Boolean)
    : centerColumns;

  const centerPaddingLeft =
    virtualColumns && columnVirtualizer.getVirtualItems().length > 0
      ? columnVirtualizer.getVirtualItems()[0].start
      : 0;
  const centerPaddingRight =
    virtualColumns && columnVirtualizer.getVirtualItems().length > 0
      ? columnVirtualizer.getTotalSize() -
        columnVirtualizer.getVirtualItems()[columnVirtualizer.getVirtualItems().length - 1].end
      : 0;

  const handleColumnDrop = (event: DragEvent, targetColumnId: string) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain') || dragColumnId;
    if (!sourceId || sourceId === TENORA_DATA_TABLE_SELECTION_COLUMN_ID) return;
    const next = reorderColumnIds(table.getState().columnOrder, sourceId, targetColumnId);
    table.setColumnOrder(next);
    setDragColumnId(null);
  };

  const renderHeaderCell = (header: Header<TData, unknown>, index: number, pinnedZ: number) => {
    const colId = header.column.id;
    const canSort = header.column.getCanSort();
    const isSorted = sortDescriptor?.column === colId;
    const sortIcon = !canSort
      ? null
      : isSorted
        ? sortDescriptor?.direction === 'descending'
          ? '↓'
          : '↑'
        : '↕';
    const meta = header.column.columnDef.meta as TenoraDataTableColumnMeta | undefined;
    const sizing = resolveTenoraDataTableColumnSizing(header.column, columnSizingDefaults);
    const headerAlignEnd =
      meta?.thClassName?.includes('text-right') ||
      meta?.thClassName?.includes('!text-right') ||
      meta?.thClassName?.includes('text-end');
    const canDrag = enableDrag && colId !== TENORA_DATA_TABLE_SELECTION_COLUMN_ID;

    return (
      <TenoraTable.Column
        key={`${header.id}:${colId}`}
        id={colId}
        allowsSorting={canSort}
        isRowHeader={index === 0 && leftColumns.length === 0}
        className={cn(
          meta?.thClassName,
          header.column.getIsPinned() && 'bg-inherit',
        )}
        style={{ ...columnSizingStyle(sizing), ...freezeStyle(header.column, pinnedZ) }}
      >
        <div
          className={cn(
            'relative flex min-w-0 items-center gap-1 pr-2',
            canDrag && 'cursor-grab active:cursor-grabbing',
            dragColumnId === colId && 'opacity-60',
          )}
          draggable={canDrag}
          onDragStart={(event: DragEvent) => {
            if (!canDrag) return;
            setDragColumnId(colId);
            event.dataTransfer.setData('text/plain', colId);
            event.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(event: DragEvent) => {
            if (!canDrag) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(event: DragEvent) => handleColumnDrop(event, colId)}
          onDragEnd={() => setDragColumnId(null)}
        >
          {header.isPlaceholder ? (
            ''
          ) : (
            <span
              className={cn(
                'min-w-0 flex-1',
                canSort && 'inline-flex items-center gap-1.5',
                headerAlignEnd && canSort && 'ml-auto',
              )}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {sortIcon ? (
                <span
                  aria-hidden
                  className={cn(
                    'text-lg leading-none',
                    isSorted
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400 dark:text-zinc-500',
                  )}
                >
                  {sortIcon}
                </span>
              ) : null}
            </span>
          )}
          {enableResize && header.column.getCanResize() ? (
            <TenoraTable.ColumnResizer
              aria-label={`Resize ${colId}`}
              className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none select-none bg-transparent hover:bg-cyan-400/60"
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
              onClick={(event) => event.stopPropagation()}
            />
          ) : null}
        </div>
      </TenoraTable.Column>
    );
  };

  const renderBodyCell = (cell: ReturnType<(typeof rows)[number]['getVisibleCells']>[number]) => {
    const meta = cell.column.columnDef.meta as TenoraDataTableColumnMeta | undefined;
    const sizing = resolveTenoraDataTableColumnSizing(cell.column, columnSizingDefaults);
    return (
      <TenoraTable.Cell
        key={cell.id}
        className={cn(
          meta?.tdClassName,
          'min-w-0 align-top whitespace-normal break-words',
          cell.column.getIsPinned() && 'bg-inherit',
        )}
        style={{ ...columnSizingStyle(sizing), ...freezeStyle(cell.column, 1) }}
      >
        <TenoraDataTableEditableCell
          cell={cell}
          editingCell={editingCell ?? null}
          onEditingCellChange={onEditingCellChange}
          onCellEdit={onCellEdit}
        />
      </TenoraTable.Cell>
    );
  };

  const renderRowCells = (rowIndex: number): ReactNode => {
    const row = rows[rowIndex];
    if (!row) return null;

    const cellByColumn = new Map(row.getVisibleCells().map((cell) => [cell.column.id, cell]));
    const centerCols = virtualColumns ? virtualCenterColumns : centerColumns;

    return (
      <>
        {leftColumns.map((column) => {
          const cell = cellByColumn.get(column.id);
          return cell ? renderBodyCell(cell) : null;
        })}
        <SpacerCell width={centerPaddingLeft} />
        {centerCols.map((column) => {
          const cell = cellByColumn.get(column.id);
          return cell ? renderBodyCell(cell) : null;
        })}
        <SpacerCell width={centerPaddingRight} />
        {rightColumns.map((column) => {
          const cell = cellByColumn.get(column.id);
          return cell ? renderBodyCell(cell) : null;
        })}
      </>
    );
  };

  const renderHeaderRow = () => {
    const headerGroup = headerGroups[0];
    if (!headerGroup) return null;

    const headerByColumn = new Map(headerGroup.headers.map((header) => [header.column.id, header]));
    const centerCols = virtualColumns ? virtualCenterColumns : centerColumns;

    return (
      <>
        {leftColumns.map((column, index) => {
          const header = headerByColumn.get(column.id);
          return header ? renderHeaderCell(header, index, 3) : null;
        })}
        <SpacerCell width={centerPaddingLeft} />
        {centerCols.map((column, index) => {
          const header = headerByColumn.get(column.id);
          return header ? renderHeaderCell(header, index, 2) : null;
        })}
        <SpacerCell width={centerPaddingRight} />
        {rightColumns.map((column, index) => {
          const header = headerByColumn.get(column.id);
          return header ? renderHeaderCell(header, index, 3) : null;
        })}
      </>
    );
  };

  const renderRow = (rowIndex: number, style?: CSSProperties) => (
    <TenoraTable.Row key={rows[rowIndex]?.id ?? rowIndex} style={style}>
      {renderRowCells(rowIndex)}
    </TenoraTable.Row>
  );

  return (
    <div ref={scrollRef} className={cn('min-h-0 w-full overflow-auto', contentMaxHeight)}>
      <TenoraTable variant="secondary">
        <TenoraTable.ScrollContainer>
          <TenoraTable.Content
            aria-label={ariaLabel}
            className="min-w-full w-max table-fixed overflow-hidden rounded-[2px]"
            sortDescriptor={sortDescriptor}
            onSortChange={onSortChange}
          >
            <TenoraTable.Header className="overflow-hidden rounded-[2px]">
              {renderHeaderRow()}
            </TenoraTable.Header>

            <TenoraTable.Body
              style={
                virtualRows && virtualRowItems
                  ? { height: rowVirtualizer.getTotalSize(), position: 'relative' }
                  : undefined
              }
            >
              {virtualRows && virtualRowItems
                ? virtualRowItems.map((virtualRow) =>
                    renderRow(virtualRow.index, {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }),
                  )
                : rows.map((_, index) => renderRow(index))}
            </TenoraTable.Body>
          </TenoraTable.Content>
        </TenoraTable.ScrollContainer>
      </TenoraTable>
    </div>
  );
}

const TenoraDataTableGridMemo = memo(TenoraDataTableGridInner) as typeof TenoraDataTableGridInner;
export { TenoraDataTableGridMemo as TenoraDataTableGrid };
