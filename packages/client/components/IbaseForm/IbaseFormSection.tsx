import type { PropsWithChildren } from 'react';
// Layout section for related form controls.
export type IbaseFormSectionProps = PropsWithChildren<{ className?: string; layout?: 'horizontal' | 'vertical' }>;
export function IbaseFormSection({ children, className = '', layout = 'vertical' }: IbaseFormSectionProps) { return <div className={`flex min-w-0 ${layout === 'horizontal' ? 'flex-row flex-wrap gap-3' : 'flex-col gap-3'} ${className}`}>{children}</div>; }
