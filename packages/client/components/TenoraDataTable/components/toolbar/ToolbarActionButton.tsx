'use client';

import type { ReactNode } from 'react';
import { TenoraButton } from '../../../TenoraButton';

type ToolbarActionButtonProps = {
  label: string;
  icon: ReactNode;
  activeCount?: number;
};

export function ToolbarActionButton({
  label,
  icon,
  activeCount,
}: ToolbarActionButtonProps) {
  return (
    <TenoraButton size="sm" variant="secondary" className="gap-1.5">
      {icon}
      <span>{label}</span>
      {activeCount != null && activeCount > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-foreground">
          {activeCount}
        </span>
      ) : null}
    </TenoraButton>
  );
}
