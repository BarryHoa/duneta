'use client';

import type { ReactNode } from 'react';
import { TenoraTable } from '../../TenoraTable';

type DataTableRootProps = {
  className?: string;
  virtualEnabled: boolean;
  height: number | string;
  children: ReactNode;
  footer?: ReactNode;
};

export function DataTableRoot({
  className,
  virtualEnabled,
  height,
  children,
  footer,
}: DataTableRootProps) {
  return (
    <TenoraTable className={className}>
      <TenoraTable.ScrollContainer
        className={virtualEnabled ? 'overflow-auto' : undefined}
        style={virtualEnabled ? { height, maxHeight: height } : undefined}
      >
        {children}
      </TenoraTable.ScrollContainer>
      {footer}
    </TenoraTable>
  );
}
