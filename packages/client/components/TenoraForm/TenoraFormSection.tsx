import type { PropsWithChildren } from 'react';
// Layout section for related form controls.
export type TenoraFormSectionProps = PropsWithChildren<{ className?: string; layout?: 'horizontal' | 'vertical' }>;
export function TenoraFormSection({ children, className = '', layout = 'vertical' }: TenoraFormSectionProps) { return <div className={`flex min-w-0 ${layout === 'horizontal' ? 'flex-row flex-wrap gap-3' : 'flex-col gap-3'} ${className}`}>{children}</div>; }
