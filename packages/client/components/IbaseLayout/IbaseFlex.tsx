import type { IbaseFlexProps } from './types';

export function IbaseFlex({ children, className = '' }: IbaseFlexProps) {
  return <div className={`flex ${className}`}>{children}</div>;
}
