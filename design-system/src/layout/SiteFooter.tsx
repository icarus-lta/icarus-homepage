import type * as React from 'react';
import type { ReactNode } from 'react';
import { content } from '../i18n/content';
import { useLanguage } from '../i18n/language';
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

/**
 * Closing bar: ICARUS wordmark and legal line on the left, page links on the right,
 * a hairline, then the copyright and image credit.
 */
export function SiteFooter(props: SiteFooterProps) {
  const { language } = useLanguage();
  const copy = content[language].footer;
  const {
    brand = 'ICARUS',
    legal = 'ICARUS LTA Inc.',
    address = copy.address,
    links = content[language].navigation.links as NonNullable<SiteFooterProps['links']>,
    credit = language === 'ko'
      ? heroCredit.replace('Hero photograph:', '메인 사진:').replace('public domain', '퍼블릭 도메인').replace('retouched', '보정 이미지')
      : heroCredit,
  } = props;
  return (
    <footer className="bg-space-950 border-t border-white/10">
      <div className={cx(containerClass, 'py-16')}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="text-white font-bold text-lg tracking-[0.2em]">{brand}</div>
            {legal ? <div className="mt-4 text-sm text-mist">{legal}</div> : null}
          </div>
          {address ? <div className="min-w-0 text-sm text-mist-dim leading-relaxed md:col-span-2 md:whitespace-nowrap">{address}</div> : null}
          <nav
            aria-label={language === 'ko' ? '하단 메뉴' : 'Footer navigation'}
            className="mt-6 md:mt-0 flex flex-wrap gap-x-8 gap-y-3 md:col-start-2 md:row-start-1"
          >
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
          <span className="text-xs text-mist-dim">{copy.copyright}</span>
          {credit ? <span className="text-xs text-mist-dim/70">{credit}</span> : null}
        </div>
      </div>
    </footer>
  );
}
