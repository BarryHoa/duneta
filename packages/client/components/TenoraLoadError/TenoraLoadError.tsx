import { TenoraButton } from '../TenoraButton';
import type { TenoraLoadErrorProps } from './types';

export function TenoraLoadError({
  title = 'Unable to load data',
  description = 'Please try again.',
  retryLabel = 'Try again',
  onRetry,
  className = '',
}: TenoraLoadErrorProps) {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 ${className}`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {onRetry ? (
        <TenoraButton className="mt-4" size="sm" variant="primary" onPress={onRetry}>
          {retryLabel}
        </TenoraButton>
      ) : null}
    </div>
  );
}
