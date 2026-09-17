import type * as React from 'react';
import type { ReactNode } from 'react';
import { images } from '../assets';
import { heroPosition } from '../generated/hero';
import { EarthLimb } from '../media/EarthLimb';
import { Button } from '../primitives/Button';
import { containerClass } from '../primitives/container';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface HeroProps {
  /** Anchor id. */
  id?: string;
  /** Photograph behind the hero. Defaults to `images.heroStratosphere`; pass null for the CSS-drawn Earth limb. */
  backgroundImage?: string | null;
  /** Height of the hero; the headline sits inside it. */
  imageHeight?: 'tall' | 'medium' | 'short';
  /**
   * Which part of the photograph stays in frame when it is cropped to the band - any CSS
   * object-position value, e.g. "center top", "center 30%", "left bottom".
   */
  imagePosition?: string;
  /** Where the horizon sits when the CSS-drawn limb is used. */
  horizon?: string;
  /** Headline set over the image, one entry per line. Three short lines read best. */
  titleLines?: string[];
  /** Mono label above the headline. Off by default. */
  eyebrow?: ReactNode;
  /** Paragraph under the headline. Off by default. */
  subtitle?: ReactNode;
  /** Ice pill label. Off by default; set it to show a call to action under the headline. */
  primaryLabel?: string | null;
  primaryHref?: string;
  onPrimaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Outlined pill label. Off by default. */
  secondaryLabel?: string | null;
  secondaryHref?: string;
  onSecondaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Extra classes appended to the <section>. */
  className?: string;
}

const IMAGE_HEIGHT = {
  tall: 'h-[88vh] min-h-[600px]',
  medium: 'h-[72vh] min-h-[500px]',
  short: 'h-[56vh] min-h-[420px]',
} as const;


/**
 * Opening view: a full-bleed stratospheric horizon photograph with the display headline set
 * into the empty sky beside it - left of the limb on wide screens, along the bottom once the
 * crop narrows. The fixed SiteHeader floats over the image.
 */
export function Hero({
  id = 'hero',
  backgroundImage = images.heroStratosphere,
  imageHeight = 'tall',
  imagePosition = heroPosition,
  horizon = '72%',
  titleLines = ['Building Humanity’s', 'Next Infrastructure Layer', 'In the Stratosphere'],
  eyebrow,
  subtitle,
  primaryLabel = null,
  primaryHref = '#company-profile',
  onPrimaryClick,
  secondaryLabel = null,
  secondaryHref = 'mailto:contact@icarus-airship.com',
  onSecondaryClick,
  className,
}: HeroProps) {
  return (
    <section id={id} className={cx('relative w-full overflow-hidden bg-space-950', IMAGE_HEIGHT[imageHeight], className)}>
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <EarthLimb horizon={horizon} scrim={0.35} />
      )}
      {/* The headline sits on the photograph, so it carries its own dark ground: from the left
          on wide screens, up from the bottom once the crop is too narrow to keep sky beside it. */}
      <div className="md:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent" />
      <div className="hidden md:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-space-950 via-space-950/50 to-transparent" />
      {/* the image dissolves into the page rather than ending on a hard edge */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-space-950" />
      <div
        className={cx(
          containerClass,
          'relative h-full flex flex-col justify-end pb-16 md:justify-center md:pb-0',
        )}
      >
        {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
        {/* The headline shares the frame with the limb, and the sky beside it narrows as the
            window does, so the type is sized off the viewport rather than stepped at breakpoints. */}
        <h1 className="text-[clamp(2.25rem,4.2vw,4.5rem)] font-bold text-white tracking-tight leading-[1.12] max-w-5xl">
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
