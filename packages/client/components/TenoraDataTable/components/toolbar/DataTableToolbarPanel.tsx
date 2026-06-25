'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '../../../../helpers';
import { TenoraPopover } from '../../../TenoraPopover';
import { DataTableToolbarPanelApplyFooter } from './DataTableToolbarPanelApplyFooter';

type DataTableToolbarPanelProps = {
  trigger: ReactNode;
  title: string;
  titleExtra?: ReactNode;
  children: ReactNode;
  /** When set, renders an Apply footer that calls this then closes the panel. */
  onApply?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  widthClassName?: string;
};

export function DataTableToolbarPanel({
  trigger,
  title,
  titleExtra,
  children,
  onApply,
  open: controlledOpen,
  onOpenChange,
  widthClassName = 'w-80',
}: DataTableToolbarPanelProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (controlledOpen === undefined) setInternalOpen(next);
  };

  const handleApply = () => {
    onApply?.();
    setOpen(false);
  };

  return (
    <TenoraPopover isOpen={open} onOpenChange={setOpen}>
      <TenoraPopover.Trigger>{trigger}</TenoraPopover.Trigger>
      <TenoraPopover.Content className={cn(widthClassName, 'p-0')}>
        <TenoraPopover.Dialog>
          <div className="flex flex-col">
            <header
              className={cn(
                'border-b border-border px-3 py-3',
                titleExtra != null &&
                  'flex items-center justify-between gap-3',
              )}
            >
              <p className="text-sm font-semibold text-foreground">{title}</p>
              {titleExtra}
            </header>

            {children}

            {onApply ? (
              <DataTableToolbarPanelApplyFooter onApply={handleApply} />
            ) : null}
          </div>
        </TenoraPopover.Dialog>
      </TenoraPopover.Content>
    </TenoraPopover>
  );
}
