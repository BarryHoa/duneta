'use client';

import type { ReactNode } from 'react';
import { cn } from '../../../helpers';
import {
  TABLE_ROOT_OVERFLOW_CLASS,
  TABLE_SCROLL_CONTAINER_CLASS,
  TABLE_SHELL_RADIUS_CLASS,
} from '../constants';
import { resolveTableScrollMaxHeight } from '../core/table';
import { TenoraTable } from '../../TenoraTable';
import type { TenoraTableProps } from '../../TenoraTable/types';

type DataTableRootProps = {
  className?: string;
  variant?: TenoraTableProps['variant'];
  bodyMaxHeight: number | string;
  virtualEnabled: boolean;
  resizeEnabled: boolean;
  children: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
};

export function DataTableRoot({
  className,
  variant = 'secondary',
  bodyMaxHeight,
  virtualEnabled,
  resizeEnabled,
  children,
  toolbar,
  footer,
}: DataTableRootProps) {
  const scrollMaxHeight = virtualEnabled
    ? bodyMaxHeight
    : resolveTableScrollMaxHeight(bodyMaxHeight);

  const tableContent = (
    <TenoraTable.ScrollContainer
      className={TABLE_SCROLL_CONTAINER_CLASS}
      style={{ maxHeight: scrollMaxHeight }}
    >
      {resizeEnabled ? (
        <TenoraTable.ResizableContainer className="min-w-full !overflow-visible">
          {children}
        </TenoraTable.ResizableContainer>
      ) : (
        children
      )}
    </TenoraTable.ScrollContainer>
  );

  return (
    <TenoraTable
      variant={variant}
      className={cn(
        'border border-border',
        TABLE_SHELL_RADIUS_CLASS,
        TABLE_ROOT_OVERFLOW_CLASS,
        className,
      )}
    >
      {toolbar}
      {tableContent}
      {footer}
    </TenoraTable>
  );
}
