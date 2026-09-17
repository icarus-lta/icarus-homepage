import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';
import { cx } from '../utils';

export interface SectionHeadingProps {
  /** Uppercase mono label above the title. */
  eyebrow?: ReactNode;
  /** The heading itself. Line breaks are honoured, so pass two short lines rather than one long one. */
  title: ReactNode;
  /** Supporting paragraph under the title. */
  description?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level. Sections use h2; the hero owns the page's h1. */
  as?: 'h1' | 'h2' | 'h3';
  /** Extra classes appended to the wrapper. */
  className?: string;
}

/** Section header block: ice eyebrow, white display title, and optional mist description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cx(centered && 'text-center', className)}>
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
      <Tag className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight whitespace-pre-line">
        {title}
      </Tag>
      {description ? (
        <p className={cx('mt-6 text-base md:text-lg text-mist leading-relaxed max-w-2xl', centered && 'mx-auto')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
