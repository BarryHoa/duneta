import type { TenoraLayoutSectionHeaderProps } from './types';

export function TenoraLayoutHeader({ children, className = '' }: TenoraLayoutSectionHeaderProps) {
  return <header className={`flex min-w-0 items-center justify-between gap-3 ${className}`}>{children}</header>;
}
