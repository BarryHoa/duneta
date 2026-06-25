import type { TenoraLayoutSectionProps } from './types';
import { TenoraLayoutActions } from './TenoraLayoutActions';
import { TenoraLayoutGrid } from './TenoraLayoutGrid';
import { TenoraLayoutHeader } from './TenoraLayoutHeader';

function Root({ children, className = '' }: TenoraLayoutSectionProps) {
  return <section className={`flex min-w-0 flex-col gap-4 md:gap-6 ${className}`}>{children}</section>;
}

export const TenoraLayoutSection = Object.assign(Root, {
  Header: TenoraLayoutHeader,
  Actions: TenoraLayoutActions,
  Grid: TenoraLayoutGrid,
});
