import { IbaseButton } from '../IbaseButton';
// Reusable recoverable-load error state.
export type IbaseLoadErrorProps = { title?: string; description?: string; retryLabel?: string; onRetry?: () => void; className?: string };
export function IbaseLoadError({ title = 'Unable to load data', description = 'Please try again.', retryLabel = 'Try again', onRetry, className = '' }: IbaseLoadErrorProps) { return <div role="alert" className={`rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 ${className}`}><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-500">{description}</p>{onRetry ? <IbaseButton className="mt-4" size="sm" variant="primary" onPress={onRetry}>{retryLabel}</IbaseButton> : null}</div>; }
