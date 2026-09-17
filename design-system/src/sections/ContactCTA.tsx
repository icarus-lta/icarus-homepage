import type * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '../primitives/Button';
import { Section } from '../primitives/Section';
import { cx } from '../utils';

export interface ContactCTAProps {
  /** Anchor id. */
  id?: string;
  /** Closing line of the page. */
  title?: ReactNode;
  description?: ReactNode;
  /** Ice pill; defaults to a mailto link on `email`. */
  primaryLabel?: string | null;
  email?: string;
  onPrimaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Outlined pill beside it. Pass null to hide it. */
  secondaryLabel?: string | null;
  secondaryHref?: string;
  onSecondaryClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Extra classes appended to the <section>. */
  className?: string;
}

/**
 * Closing call to action: a centered line over a starry navy band, with the contact
 * address as the ice pill and a quieter second action beside it.
 */
export function ContactCTA({
  id = 'contact',
  title = 'From the ground to the stratosphere',
  description = 'We are looking for partners, operators and engineers to climb with us.',
  primaryLabel,
  email = 'contact@icarus-airship.com',
  onPrimaryClick,
  secondaryLabel = 'Careers',
  secondaryHref = '/career',
  onSecondaryClick,
  className,
}: ContactCTAProps) {
  return (
    <Section id={id} tone="navy" stars className={cx('text-center', className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">{title}</h2>
      {description ? <p className="mt-6 text-base md:text-lg text-mist max-w-2xl mx-auto">{description}</p> : null}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {primaryLabel !== null ? (
          <Button href={`mailto:${email}`} onClick={onPrimaryClick}>
            {primaryLabel ?? email}
          </Button>
        ) : null}
        {secondaryLabel ? (
          <Button variant="secondary" href={secondaryHref} onClick={onSecondaryClick}>
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </Section>
  );
}
