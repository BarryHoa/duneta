'use client';

import { useSortable } from '@dnd-kit/sortable';
import { Table } from '@heroui/react';
import { flexRender, type Header } from '@tanstack/react-table';
import {
  useCallback,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '../../../../helpers';
import {
  isColumnDragEnabled,
  isColumnDraggable,
  type ColumnDragConfig,
} from '../../core/column-drag';
import {
  isColumnResizable,
  type ColumnResizeConfig,
} from '../../core/column-resize';
import { resolveColumnWidthProps } from '../../core/column-width';
import { TenoraTable } from '../../../TenoraTable';
import { useColumnDragState } from './column-drag-context';
import { ColumnDragHandle } from './ColumnDragHandle';
import { ColumnResizerHandle } from './ColumnResizerHandle';

type DataTableHeaderProps<TData> = {
  headers: Array<Header<TData, unknown>>;
  columnDrag: ColumnDragConfig;
  columnResize: ColumnResizeConfig;
  resizeEnabled: boolean;
};

type HeaderColumnShellProps = {
  allowsSorting: boolean;
  columnRef?: Ref<HTMLTableCellElement>;
  id: string;
  isRowHeader: boolean;
  resizeEnabled: boolean;
  resizable: boolean;
  widthProps?: ReturnType<typeof resolveColumnWidthProps>;
  style?: React.CSSProperties;
  label: ReactNode;
  leading?: ReactNode;
  dropIndicators?: ReactNode;
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

function HeaderColumnShell({
  allowsSorting,
  columnRef,
  id,
  isRowHeader,
  resizeEnabled,
  resizable,
  widthProps,
  style,
  label,
  leading,
  dropIndicators,
}: HeaderColumnShellProps) {
  return (
    <TenoraTable.Column
      ref={columnRef}
      allowsSorting={allowsSorting}
      className={cn(
        resizable &&
          'group/column relative data-[resizing]:bg-cyan-500/10 data-[resizing]:text-foreground',
      )}
      id={id}
      isRowHeader={isRowHeader}
      style={style}
      {...widthProps}
    >
      {({ sortDirection, isResizing }) => (
        <>
          <div
            className={cn(
              'relative flex min-w-0 items-center gap-1.5 rounded-sm px-0.5',
              !isResizing && 'transition-colors',
            )}
          >
            {dropIndicators}
            {leading}
            {allowsSorting ? (
              <Table.SortableColumnHeader
                sortDirection={sortDirection}
                className={cn(
                  'min-w-0 flex-1 truncate',
                  isResizing && 'pointer-events-none select-none',
                )}
              >
                {label}
              </Table.SortableColumnHeader>
            ) : (
              <span
                className={cn(
                  'min-w-0 flex-1 truncate',
                  isResizing && 'pointer-events-none select-none',
                )}
              >
                {label}
              </span>
            )}
          </div>
          {resizeEnabled && resizable ? (
            <ColumnResizerHandle columnId={id} isResizing={isResizing} />
          ) : null}
        </>
      )}
    </TenoraTable.Column>
  );
}

function SortableHeaderColumn({
  columnId,
  allowsSorting,
  draggable,
  id,
  isRowHeader,
  resizeEnabled,
  resizable,
  widthProps,
  label,
}: {
  columnId: string;
  allowsSorting: boolean;
  draggable: boolean;
  id: string;
  isRowHeader: boolean;
  resizeEnabled: boolean;
  resizable: boolean;
  widthProps: ReturnType<typeof resolveColumnWidthProps>;
  label: ReactNode;
}) {
  const { activeId, overId, columnIds } = useColumnDragState();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({
    id: columnId,
    disabled: !draggable,
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

  const isDropTarget =
    overId === columnId && activeId !== null && activeId !== columnId;
  const activeIndex = activeId ? columnIds.indexOf(activeId) : -1;
  const overIndex = columnIds.indexOf(columnId);

  return (
    <HeaderColumnShell
      allowsSorting={allowsSorting}
      columnRef={columnRef}
      dropIndicators={
        <>
          {isDropTarget && activeIndex > overIndex ? (
            <ColumnDropIndicator side="left" />
          ) : null}
          {isDropTarget && activeIndex < overIndex ? (
            <ColumnDropIndicator side="right" />
          ) : null}
        </>
      }
      id={id}
      isRowHeader={isRowHeader}
      label={label}
      leading={
        draggable ? (
          <ColumnDragHandle
            activatorRef={setActivatorNodeRef}
            attributes={attributes}
            columnId={columnId}
            isDragActive={activeId !== null}
            listeners={listeners}
            onPointerDown={stopPointerPropagation}
          />
        ) : null
      }
      resizeEnabled={resizeEnabled}
      resizable={resizable}
      style={{ opacity: isDragging ? 0.35 : undefined }}
      widthProps={widthProps}
    />
  );
}

export function DataTableHeader<TData>({
  headers,
  columnDrag,
  columnResize,
  resizeEnabled,
}: DataTableHeaderProps<TData>) {
  const dragEnabled = isColumnDragEnabled(columnDrag);

  return (
    <TenoraTable.Header>
      {headers.map((header, index) => {
        const label = flexRender(
          header.column.columnDef.header,
          header.getContext(),
        );
        const columnId = header.column.id;
        const isRowHeader = index === 0;
        const allowsSorting = header.column.getCanSort();
        const widthProps = resizeEnabled
          ? resolveColumnWidthProps(header.column.columnDef.meta)
          : {};
        const resizable = isColumnResizable(columnResize, columnId);

        if (dragEnabled) {
          return (
            <SortableHeaderColumn
              key={header.id}
              allowsSorting={allowsSorting}
              columnId={columnId}
              draggable={isColumnDraggable(columnDrag, columnId)}
              id={columnId}
              isRowHeader={isRowHeader}
              label={label}
              resizeEnabled={resizeEnabled}
              resizable={resizable}
              widthProps={widthProps}
            />
          );
        }

        return (
          <HeaderColumnShell
            key={header.id}
            allowsSorting={allowsSorting}
            id={columnId}
            isRowHeader={isRowHeader}
            label={label}
            resizeEnabled={resizeEnabled}
            resizable={resizable}
            widthProps={widthProps}
          />
        );
      })}
    </TenoraTable.Header>
  );
}
