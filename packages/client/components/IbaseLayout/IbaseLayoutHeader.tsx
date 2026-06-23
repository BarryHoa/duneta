import type { IbaseLayoutSectionHeaderProps } from './types';

export function IbaseLayoutHeader({ children, className = '' }: IbaseLayoutSectionHeaderProps) {
  return <header className={`flex min-w-0 items-center justify-between gap-3 ${className}`}>{children}</header>;
}
