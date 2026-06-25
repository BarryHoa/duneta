'use client';

import type { SortDescriptor } from '@heroui/react';
import type { ReactNode } from 'react';
import { cn } from '../../../helpers';
import { TenoraTable } from '../../TenoraTable';

type DataTableContentProps = {
  ariaLabel: string;
  resizeEnabled: boolean;
  sortDescriptor: SortDescriptor | undefined;
  onSortChange: (descriptor: SortDescriptor) => void;
  children: ReactNode;
};

export function DataTableContent({
  ariaLabel,
  resizeEnabled,
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
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      {children}
    </TenoraTable.Content>
  );
}
