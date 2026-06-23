import { Link } from '@heroui/react';
import type { LinkProps } from '@heroui/react';
import type { PropsWithChildren } from 'react';

export type IbaseLinkProps = PropsWithChildren<
  Omit<LinkProps, 'className' | 'isDisabled'> & {
    className?: string;
    /** Renders non-interactive content, rather than an inaccessible disabled anchor. */
    disabled?: boolean;
  }
>;

/**
 * Framework-neutral application link.
 * For Next.js routing, pass `href` normally or wrap this component with a project router adapter.
 */
export function IbaseLink({
  children,
  className = '',
  disabled = false,
  target,
  rel,
  ...props
}: IbaseLinkProps) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={`inline-flex items-center font-medium text-zinc-400 dark:text-zinc-600 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      {...props}
      target={target}
      rel={target === '_blank' ? rel ?? 'noopener noreferrer' : rel}
      className={`inline-flex items-center font-medium text-[color:var(--accent)] transition-colors hover:text-[color:var(--warning)] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)] ${className}`}
    >
      {children}
    </Link>
  );
}
