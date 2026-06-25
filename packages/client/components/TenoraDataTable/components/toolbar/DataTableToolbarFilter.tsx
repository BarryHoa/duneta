'use client';

import { Filter } from 'lucide-react';
import { TenoraTypography } from '../../../TenoraTypography';
import type { TenoraDataTableToolbarFilterConfig } from '../../types/toolbar';
import { DataTableToolbarPanel } from './DataTableToolbarPanel';
import { ToolbarActionButton } from './ToolbarActionButton';

type DataTableToolbarFilterProps = {
  config: TenoraDataTableToolbarFilterConfig;
};

export function DataTableToolbarFilter({ config }: DataTableToolbarFilterProps) {
  return (
    <DataTableToolbarPanel
      title="Filter"
      trigger={
        <ToolbarActionButton
          label="Filter"
          icon={<Filter aria-hidden className="size-4" strokeWidth={2} />}
          activeCount={config.activeCount}
        />
      }
      onApply={config.onApply}
    >
      <div className="px-3 py-3">
        {config.children ?? (
          <TenoraTypography.Paragraph className="text-sm text-muted">
            No filters applied. Pass{' '}
            <TenoraTypography.Code>toolbar.filter.children</TenoraTypography.Code>{' '}
            and{' '}
            <TenoraTypography.Code>toolbar.filter.onApply</TenoraTypography.Code>{' '}
            for a custom filter panel.
          </TenoraTypography.Paragraph>
        )}
      </div>
    </DataTableToolbarPanel>
  );
}
