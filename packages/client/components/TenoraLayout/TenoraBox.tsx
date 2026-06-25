import type { TenoraBoxProps } from './types';

export function TenoraBox({ children, className = '' }: TenoraBoxProps) {
  return <div className={className}>{children}</div>;
}
