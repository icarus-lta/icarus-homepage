import type { ReactNode } from 'react';
import { cx } from '../utils';

export interface EyebrowProps {
  children: ReactNode;
  /** Extra classes appended to the label. */
  className?: string;
}

/**
 * Small uppercase monospace label above a heading (WHY 20KM, CORE TECHNOLOGY, ROADMAP).
 * Ice-blue, wide letter spacing - the system's section marker.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <div className={cx('font-mono text-xs uppercase tracking-[0.18em] text-ice', className)}>{children}</div>
  );
}
