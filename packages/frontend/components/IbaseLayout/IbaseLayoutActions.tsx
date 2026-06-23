import type { IbaseLayoutSectionActionsProps } from './types';

export function IbaseLayoutActions({ children, className = '' }: IbaseLayoutSectionActionsProps) {
  return <div className={`ml-auto flex flex-wrap items-center justify-end gap-2 ${className}`}>{children}</div>;
}
