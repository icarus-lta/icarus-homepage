import type * as React from 'react';
import type { ReactNode } from 'react';
import { heroCredit } from '../generated/hero';
import { containerClass } from '../primitives/container';
import { cx } from '../utils';

export interface SiteFooterProps {
  /** Wordmark text. */
  brand?: string;
  /** Legal line under the wordmark. */
  legal?: ReactNode;
  /** Registered address. Pass null to omit. */
  address?: ReactNode;
  /** Links on the right. */
  links?: Array<{ label: string; href: string; external?: boolean; onClick?: React.MouseEventHandler<HTMLAnchorElement> }>;
  /** Small credit line at the very bottom (image and data credits). Pass null to omit. */
  credit?: ReactNode;
}

const DEFAULT_LINKS = [
  { label: 'Info', href: '/info' },
  { label: 'Technology', href: '/technology' },
  { label: 'Career', href: '/career' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Closing bar: ICARUS wordmark and legal line on the left, page links on the right,
 * a hairline, then the copyright and image credit.
 */
export function SiteFooter({
  brand = 'ICARUS',
  legal = 'ICARUS LTA Inc.',
  address = 'Startup Center A-318-1, GIST, 123 Cheomdangwagi-ro, Buk-gu, Gwangju, Republic of Korea',
  links = DEFAULT_LINKS,
  credit = heroCredit,
}: SiteFooterProps) {
  return (
    <footer className="bg-space-950 border-t border-white/10">
      <div className={cx(containerClass, 'py-16')}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <div className="text-white font-bold text-lg tracking-[0.2em]">{brand}</div>
            {legal ? <div className="mt-4 text-sm text-mist">{legal}</div> : null}
            {address ? <div className="mt-2 text-sm text-mist-dim max-w-sm leading-relaxed">{address}</div> : null}
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-sm text-mist hover:text-white no-underline transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span className="text-xs text-mist-dim">© 2026 ICARUS LTA. All rights reserved.</span>
          {credit ? <span className="text-xs text-mist-dim/70">{credit}</span> : null}
        </div>
      </div>
    </footer>
  );
}
