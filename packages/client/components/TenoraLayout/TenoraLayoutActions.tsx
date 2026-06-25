import type { TenoraLayoutSectionActionsProps } from './types';

export function TenoraLayoutActions({ children, className = '' }: TenoraLayoutSectionActionsProps) {
  return <div className={`ml-auto flex flex-wrap items-center justify-end gap-2 ${className}`}>{children}</div>;
}
