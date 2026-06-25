'use client';

import { memo } from 'react';
import { TenoraDataTablePaginationFooter } from './TenoraDataTablePaginationFooter';
import type { TenoraDataTablePaginationOffsetConfig } from './types';

export const TenoraDataTablePaginationFooterRegion = memo(
  function TenoraDataTablePaginationFooterRegion({
    pagination,
    pageItemCount,
  }: {
    pagination: TenoraDataTablePaginationOffsetConfig;
    pageItemCount: number;
  }) {
    return (
      <TenoraDataTablePaginationFooter pagination={pagination} pageItemCount={pageItemCount} />
    );
  },
);
