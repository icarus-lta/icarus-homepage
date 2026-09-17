import type * as React from 'react';
import type { ReactNode } from 'react';
import { images } from '../assets';
import { EarthLimb } from '../media/EarthLimb';
import { Button } from '../primitives/Button';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface HeroProps {
  /** Anchor id. */
  id?: string;
  /** Photograph filling the top band. Defaults to `images.heroStratosphere`; pass null for the CSS-drawn Earth limb. */
  backgroundImage?: string | null;
  /** Height of the image band. */
  imageHeight?: 'tall' | 'medium' | 'short';
  /** Where the horizon sits when the CSS-drawn limb is used. */
  horizon?: string;
  /** Headline under the image, one entry per line. Three short lines read best. */
  titleLines?: string[];
  /** Mono label above the headline. Off by default. */
  eyebrow?: ReactNode;
  /** Paragraph under the headline. Off by default. */
  subtitle?: ReactNode;
  /** Ice pill label. Pass null to hide it. */
  primaryLabel?: string | null;
  primaryHref?: string;
  onPrimaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Outlined pill label. Pass null to hide it. */
  secondaryLabel?: string | null;
  secondaryHref?: string;
  onSecondaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Extra classes appended to the <section>. */
  className?: string;
}

const IMAGE_HEIGHT = {
  tall: 'h-[70vh] min-h-[420px]',
  medium: 'h-[56vh] min-h-[340px]',
  short: 'h-[42vh] min-h-[260px]',
} as const;

/**
 * Opening view: a full-bleed stratospheric horizon photograph across the top, fading into
 * the page, with the display headline set left-aligned underneath it. The fixed SiteHeader
 * floats over the image.
 */
export function Hero({
  id = 'hero',
  backgroundImage = images.heroStratosphere,
  imageHeight = 'tall',
  horizon = '72%',
  titleLines = ['Building Humanity’s', 'Next Infrastructure Layer', 'In the Stratosphere'],
  eyebrow,
  subtitle,
  primaryLabel = 'Company Profile (PDF)',
  primaryHref = '#company-profile',
  onPrimaryClick,
  secondaryLabel = 'Contact',
  secondaryHref = 'mailto:contact@icarus-airship.com',
  onSecondaryClick,
  className,
}: HeroProps) {
  return (
    <section id={id} className={cx('relative bg-space-950', className)}>
      <div className={cx('relative w-full overflow-hidden', IMAGE_HEIGHT[imageHeight])}>
        {backgroundImage ? (
          <img src={backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <EarthLimb horizon={horizon} scrim={0.35} />
        )}
        {/* the image dissolves into the page rather than ending on a hard edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-space-950" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 pt-10 md:pt-14 pb-20 md:pb-28">
        {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] max-w-4xl">
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
        {subtitle ? <p className="mt-7 text-base md:text-lg text-mist max-w-xl leading-relaxed">{subtitle}</p> : null}
        {primaryLabel || secondaryLabel ? (
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {primaryLabel ? (
              <Button href={primaryHref} onClick={onPrimaryClick}>
                {primaryLabel}
              </Button>
            ) : null}
            {secondaryLabel ? (
              <Button variant="secondary" href={secondaryHref} onClick={onSecondaryClick}>
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
