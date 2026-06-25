import type { TenoraFlexProps } from './types';

export function TenoraFlex({ children, className = '' }: TenoraFlexProps) {
  return <div className={`flex ${className}`}>{children}</div>;
}
