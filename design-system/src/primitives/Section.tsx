import type { ReactNode } from 'react';
import { containerClass } from './container';
import { cx } from '../utils';

const TONE = {
  base: 'bg-space-950',
  raised: 'bg-space-900',
  deep: 'bg-gradient-to-b from-space-950 via-space-900 to-space-950',
  navy: 'bg-gradient-to-b from-space-900 via-space-800 to-space-900',
} as const;

export interface SectionProps {
  /** Anchor id; header links target it. */
  id?: string;
  /** Background: `base` near-black, `raised` one step up, `deep`/`navy` gradient bands for depth. */
  tone?: 'base' | 'raised' | 'deep' | 'navy';
  /** Scatter a faint star field across the band. */
  stars?: boolean;
  /** Drop the centered max-w-6xl column and let children run full width. */
  bleed?: boolean;
  children?: ReactNode;
  /** Extra classes appended to the <section>. */
  className?: string;
}

/**
 * Full-width band with the site's vertical rhythm (py-24, md:py-32) and the shared page
 * gutter, so its content lines up with the header and the full-bleed photography.
 * Build every new page section inside one.
 */
export function Section({ id, tone = 'base', stars = false, bleed = false, children, className }: SectionProps) {
  return (
    <section id={id} className={cx('relative overflow-hidden py-24 md:py-32', TONE[tone], className)}>
      {stars ? <div className="ds-stars absolute inset-0 opacity-60 pointer-events-none animate-twinkle" /> : null}
      <div className={cx('relative', !bleed && containerClass)}>{children}</div>
    </section>
  );
}
