'use client';

import { RefreshCw } from 'lucide-react';
import { cn } from '../../../../helpers';
import { TenoraButton } from '../../../TenoraButton';

type DataTableToolbarRefreshProps = {
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function DataTableToolbarRefresh({
  onRefresh,
  isRefreshing = false,
}: DataTableToolbarRefreshProps) {
  return (
    <TenoraButton
      isIconOnly
      size="sm"
      variant="secondary"
      aria-label="Refresh data"
      isDisabled={isRefreshing}
      onPress={onRefresh}
    >
      <RefreshCw
        aria-hidden
        className={cn('size-4', isRefreshing && 'animate-spin')}
        strokeWidth={2}
      />
    </TenoraButton>
  );
}
