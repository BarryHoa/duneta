'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { PointerEvent, Ref } from 'react';
import { cn } from '../../../../helpers';
import { TenoraTooltip } from '../../../TenoraTooltip';
import { ColumnGripIcon } from './ColumnGripIcon';

type ColumnDragHandleProps = {
  columnId: string;
  isDragActive: boolean;
  activatorRef: Ref<HTMLButtonElement>;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
};

export function ColumnDragHandle({
  columnId,
  isDragActive,
  activatorRef,
  attributes,
  listeners,
  onPointerDown,
}: ColumnDragHandleProps) {
  return (
    <TenoraTooltip closeDelay={0} delay={400} isDisabled={isDragActive}>
      <button
        type="button"
        ref={activatorRef}
        aria-label={`Drag ${columnId} column`}
        className={cn(
          'shrink-0 cursor-grab rounded p-0.5 text-muted',
          'hover:bg-default-100 hover:text-foreground active:cursor-grabbing',
        )}
        {...attributes}
        {...listeners}
        onPointerDown={onPointerDown}
      >
        <ColumnGripIcon />
      </button>
      <TenoraTooltip.Content offset={8} placement="top" showArrow>
        <TenoraTooltip.Arrow />
        Drag column
      </TenoraTooltip.Content>
    </TenoraTooltip>
  );
}
