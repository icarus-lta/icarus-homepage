import type * as React from 'react';
import { Button } from '../primitives/Button';
import { cx } from '../utils';

const POSITION = {
  fixed: 'fixed top-0 left-0 right-0',
  sticky: 'sticky top-0',
  static: 'relative',
} as const;

export interface SiteHeaderProps {
  /** Wordmark text. */
  brand?: string;
  /** Where the wordmark links. */
  homeHref?: string;
  onHomeClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Nav links (default: the four subpages Info / Technology / Career / Contact). */
  links?: Array<{ label: string; href: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> }>;
  /** Right-hand pill label. Pass null to hide it. */
  ctaLabel?: string | null;
  ctaHref?: string;
  onCtaClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** `fixed` (default) floats over the hero; the first section needs pt-32 (Hero has it). */
  position?: 'fixed' | 'sticky' | 'static';
  /** Extra classes appended to the <header>. */
  className?: string;
}

const DEFAULT_LINKS = [
  { label: 'Info', href: '/info' },
  { label: 'Technology', href: '/technology' },
  { label: 'Career', href: '/career' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Translucent top bar over the dark page: ICARUS wordmark on the left, page links and
 * an ice CTA pill on the right, hairline bottom border and blurred backdrop.
 */
export function SiteHeader({
  brand = 'ICARUS',
  homeHref = '/',
  onHomeClick,
  links = DEFAULT_LINKS,
  ctaLabel = 'Get in touch',
  ctaHref = 'mailto:contact@icarus-airship.com',
  onCtaClick,
  position = 'fixed',
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cx(
        POSITION[position],
        'z-50 bg-space-950/70 backdrop-blur-md border-b border-white/10 transition-colors duration-300',
        className,
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href={homeHref}
            onClick={onHomeClick}
            className="text-white font-bold text-lg tracking-[0.2em] no-underline"
          >
            {brand}
          </a>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className="text-sm text-mist hover:text-white no-underline transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {ctaLabel ? (
              <Button variant="secondary" size="sm" href={ctaHref} onClick={onCtaClick}>
                {ctaLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
