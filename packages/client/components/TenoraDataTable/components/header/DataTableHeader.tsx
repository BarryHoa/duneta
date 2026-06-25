'use client';

import { useSortable } from '@dnd-kit/sortable';
import { Table } from '@heroui/react';
import { flexRender, type Header } from '@tanstack/react-table';
import { useCallback, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../../../helpers';
import { TenoraTable } from '../../../TenoraTable';
import { useColumnDragState } from './column-drag-context';
import { ColumnGripIcon } from './ColumnGripIcon';

type DataTableHeaderProps<TData> = {
  headers: Array<Header<TData, unknown>>;
  columnDrag: boolean;
};

type SortableTableColumnProps = {
  columnId: string;
  id: string;
  allowsSorting: boolean;
  isRowHeader: boolean;
  children: ReactNode;
};

function ColumnDropIndicator({ side }: { side: 'left' | 'right' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute top-1 bottom-1 z-20 w-1 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.65)]',
        side === 'left' ? '-left-0.5' : '-right-0.5',
      )}
    />
  );
}

function SortableTableColumn({
  columnId,
  id,
  allowsSorting,
  isRowHeader,
  children,
}: SortableTableColumnProps) {
  const { activeId, overId, columnIds } = useColumnDragState();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({
    id: columnId,
    animateLayoutChanges: () => false,
  });

  const columnRef = useCallback(
    (element: HTMLTableCellElement | null) => {
      setNodeRef(element);
    },
    [setNodeRef],
  );

  const stopPointerPropagation = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const isDropTarget = overId === columnId && activeId !== null && activeId !== columnId;
  const activeIndex = activeId ? columnIds.indexOf(activeId) : -1;
  const overIndex = columnIds.indexOf(columnId);
  const showInsertLeft = isDropTarget && activeIndex > overIndex;
  const showInsertRight = isDropTarget && activeIndex < overIndex;

  return (
    <TenoraTable.Column
      ref={columnRef}
      allowsSorting={allowsSorting}
      id={id}
      isRowHeader={isRowHeader}
      style={{ opacity: isDragging ? 0.35 : undefined }}
    >
      {({ sortDirection }) => (
        <div
          className={cn(
            'relative flex min-w-0 items-center gap-1.5 rounded-sm px-0.5 transition-colors',
            isDropTarget && 'bg-cyan-500/10',
          )}
        >
          {showInsertLeft ? <ColumnDropIndicator side="left" /> : null}
          {showInsertRight ? <ColumnDropIndicator side="right" /> : null}
          <button
            type="button"
            ref={setActivatorNodeRef}
            aria-label={`Drag ${columnId} column`}
            className="shrink-0 cursor-grab rounded p-0.5 text-muted hover:bg-default-100 hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
            onPointerDown={stopPointerPropagation}
          >
            <ColumnGripIcon />
          </button>
          {allowsSorting ? (
            <Table.SortableColumnHeader
              sortDirection={sortDirection}
              className="min-w-0 flex-1"
            >
              {children}
            </Table.SortableColumnHeader>
          ) : (
            <span className="min-w-0 flex-1">{children}</span>
          )}
        </div>
      )}
    </TenoraTable.Column>
  );
}

export function DataTableHeader<TData>({
  headers,
  columnDrag,
}: DataTableHeaderProps<TData>) {
  return (
    <TenoraTable.Header>
      {headers.map((header, index) => {
        const label = flexRender(
          header.column.columnDef.header,
          header.getContext(),
        );
        const columnId = header.column.id;
        const isRowHeader = index === 0;

        if (!columnDrag) {
          return (
            <TenoraTable.Column
              key={header.id}
              allowsSorting={header.column.getCanSort()}
              id={columnId}
              isRowHeader={isRowHeader}
            >
              {({ sortDirection }) =>
                header.column.getCanSort() ? (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {label}
                  </Table.SortableColumnHeader>
                ) : (
                  label
                )
              }
            </TenoraTable.Column>
          );
        }

        return (
          <SortableTableColumn
            key={header.id}
            columnId={columnId}
            allowsSorting={header.column.getCanSort()}
            id={columnId}
            isRowHeader={isRowHeader}
          >
            {label}
          </SortableTableColumn>
        );
      })}
    </TenoraTable.Header>
  );
}
