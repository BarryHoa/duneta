'use client';

import { cn } from '../../../../helpers';
import { TenoraTable } from '../../../TenoraTable';
import { TenoraTooltip } from '../../../TenoraTooltip';

type ColumnResizerHandleProps = {
  columnId: string;
  isResizing: boolean;
};

export function ColumnResizerHandle({
  columnId,
  isResizing,
}: ColumnResizerHandleProps) {
  return (
    <TenoraTooltip closeDelay={0} delay={400} isDisabled={isResizing}>
      <TenoraTooltip.Trigger
        aria-label={`Resize ${columnId} column`}
        className={cn(
          '!absolute !inset-y-0 !top-0 !bottom-0 !end-0 z-30 w-3 translate-x-1/2',
          'cursor-col-resize touch-none border-0 bg-transparent p-0 outline-none',
          'opacity-0 transition-opacity',
          isResizing && 'opacity-100',
          'group-hover/column:opacity-100',
          'hover:opacity-100',
          'data-[hovered]:opacity-100',
          'before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-cyan-500/45 before:transition-[width,background-color,box-shadow]',
          'group-hover/column:before:bg-cyan-500/80',
          'hover:before:bg-cyan-500',
          'data-[hovered]:before:bg-cyan-500/90',
          isResizing &&
            'before:w-1 before:bg-cyan-500 before:shadow-[0_0_8px_rgba(6,182,212,0.65)]',
        )}
      >
        <TenoraTable.ColumnResizer
          aria-label={`Resize ${columnId} column`}
          className={cn(
            '!absolute !inset-0 !top-0 !bottom-0 !end-0 !h-auto !w-full',
            '!translate-x-0 !-translate-y-0 touch-none !bg-transparent',
          )}
        />
      </TenoraTooltip.Trigger>
      <TenoraTooltip.Content offset={8} placement="top" showArrow>
        <TenoraTooltip.Arrow />
        Resize column
      </TenoraTooltip.Content>
    </TenoraTooltip>
  );
}
