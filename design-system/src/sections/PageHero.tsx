import type { ReactNode } from 'react';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface PageHeroProps {
  /** Anchor id. */
  id?: string;
  /** Mono label above the title (usually the page name). */
  eyebrow?: ReactNode;
  /** Page title. */
  title: ReactNode;
  /** One or two lines of introduction. */
  description?: ReactNode;
  /** Optional photograph behind the band. */
  backgroundImage?: string | null;
  /** Extra classes appended to the <section>. */
  className?: string;
}

/**
 * Subpage header - the shorter counterpart to Hero for Info, Technology, Career and
 * Contact pages: page label, title and intro over a dark band with a hairline base.
 * Its top padding clears the fixed SiteHeader.
 */
export function PageHero({ id, eyebrow, title, description, backgroundImage, className }: PageHeroProps) {
  return (
    <section
      id={id}
      className={cx('relative overflow-hidden bg-space-950 border-b border-white/10 pt-36 pb-16 md:pt-44 md:pb-20', className)}
    >
      {backgroundImage ? (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/70 to-space-950/40" />
        </>
      ) : (
        <div className="ds-stars absolute inset-0 opacity-40" />
      )}
      <div className="relative max-w-6xl mx-auto px-6">
        {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight max-w-3xl">{title}</h1>
        {description ? <p className="mt-6 text-base md:text-lg text-mist max-w-2xl leading-relaxed">{description}</p> : null}
      </div>
    </section>
  );
}
