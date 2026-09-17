import type * as React from 'react';
import type { ReactNode } from 'react';
import { cx } from '../utils';

const VARIANT = {
  primary: 'bg-ice text-space-950 hover:bg-ice-100 border border-transparent',
  secondary: 'bg-transparent text-white border border-white/25 hover:border-ice hover:text-ice',
  ghost: 'bg-white/5 text-white border border-transparent hover:bg-white/10',
} as const;

const SIZE = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-base',
} as const;

export interface ButtonProps {
  children: ReactNode;
  /** `primary` is the ice-blue pill (one per view); `secondary` is the outlined pill; `ghost` is the quiet fill. */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  /** Renders an <a> when set (page links, mailto:, PDF); otherwise a <button>. */
  href?: string;
  /** Open href in a new tab (target="_blank" rel="noopener noreferrer"). */
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  /** Extra classes appended to the button. */
  className?: string;
}

/**
 * Pill call-to-action. `primary` (ice fill) carries the main action of a view,
 * `secondary` (hairline outline) sits beside it, `ghost` is for quiet in-page actions.
 * All three lift slightly on hover.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  const classes = cx(
    'inline-flex items-center justify-center gap-2 rounded-full font-medium no-underline cursor-pointer',
    'transition-all duration-300 hover:-translate-y-0.5',
    VARIANT[variant],
    SIZE[size],
    className,
  );
  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
