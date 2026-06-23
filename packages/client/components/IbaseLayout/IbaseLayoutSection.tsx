import type { IbaseLayoutSectionProps } from './types';
import { IbaseLayoutActions } from './IbaseLayoutActions';
import { IbaseLayoutGrid } from './IbaseLayoutGrid';
import { IbaseLayoutHeader } from './IbaseLayoutHeader';

function Root({ children, className = '' }: IbaseLayoutSectionProps) {
  return <section className={`flex min-w-0 flex-col gap-4 md:gap-6 ${className}`}>{children}</section>;
}

export const IbaseLayoutSection = Object.assign(Root, {
  Header: IbaseLayoutHeader,
  Actions: IbaseLayoutActions,
  Grid: IbaseLayoutGrid,
});
