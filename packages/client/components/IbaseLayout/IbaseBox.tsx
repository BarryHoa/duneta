import type { IbaseBoxProps } from './types';

export function IbaseBox({ children, className = '' }: IbaseBoxProps) {
  return <div className={className}>{children}</div>;
}
