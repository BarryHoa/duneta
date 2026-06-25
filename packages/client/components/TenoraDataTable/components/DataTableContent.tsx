'use client';

import type { SortDescriptor } from '@heroui/react';
import type { ReactNode } from 'react';
import { cn } from '../../../helpers';
import { TenoraTable } from '../../TenoraTable';

type DataTableContentProps = {
  ariaLabel: string;
  resizeEnabled: boolean;
  pinEnabled: boolean;
  tableMinWidth?: number;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (descriptor: SortDescriptor) => void;
  children: ReactNode;
};

export function DataTableContent({
  ariaLabel,
  resizeEnabled,
  pinEnabled,
  tableMinWidth,
  sortDescriptor,
  onSortChange,
  children,
}: DataTableContentProps) {
  return (
    <TenoraTable.Content
      aria-label={ariaLabel}
      className={cn(
        'min-w-full !overflow-visible',
        resizeEnabled && '[table-layout:fixed]',
      )}
      style={pinEnabled && tableMinWidth ? { minWidth: tableMinWidth } : undefined}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      {children}
    </TenoraTable.Content>
  );
}
