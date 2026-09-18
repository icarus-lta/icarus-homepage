import type * as React from 'react';
import { content } from '../i18n/content';
import { useLanguage } from '../i18n/language';
import { Button } from '../primitives/Button';
import { containerClass } from '../primitives/container';
import { cx } from '../utils';

const POSITION = {
  fixed: 'fixed top-0 left-0 right-0',
  sticky: 'sticky top-0',
  static: 'relative',
} as const;

export interface SiteHeaderProps {
  /** Wordmark text. */
  brand?: string;
  /** Small company suffix aligned at the lower right of the wordmark. */
  brandSuffix?: string | null;
  /** Where the wordmark links. */
  homeHref?: string;
  onHomeClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Nav links (default: Mission / About / Career / News; Contact is the CTA). */
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

/**
 * Translucent top bar over the dark page: ICARUS LTA wordmark on the left, page links
 * and an outlined Contact pill on the right, hairline bottom border and blurred backdrop.
 */
export function SiteHeader(props: SiteHeaderProps) {
  const { language, setLanguage } = useLanguage();
  const copy = content[language].navigation;
  const {
    brand = 'ICARUS',
    brandSuffix = 'LTA',
    homeHref = '/',
    onHomeClick,
    links = copy.links as NonNullable<SiteHeaderProps['links']>,
    ctaLabel = copy.contact,
    ctaHref = 'mailto:contact@icarus-airship.com',
    onCtaClick,
    position = 'fixed',
    className,
  } = props;
  return (
    <header
      className={cx(
        POSITION[position],
        'z-50 bg-space-950/70 backdrop-blur-md border-b border-white/10 transition-colors duration-300',
        className,
      )}
    >
      <div className={cx(containerClass, 'max-md:px-4')}>
        <div className="flex items-center justify-between gap-2 md:gap-4 h-16 md:h-20">
          <a
            href={homeHref}
            onClick={onHomeClick}
            aria-label={[brand, brandSuffix].filter(Boolean).join(' ')}
            className="inline-flex shrink-0 items-baseline gap-1 text-white font-bold uppercase no-underline"
          >
            <span className="-mr-[0.2em] text-xl md:text-2xl leading-none tracking-[0.2em]">{brand}</span>
            {brandSuffix ? (
              <span className="translate-y-px text-[9px] md:text-[10px] font-medium leading-none tracking-[0.03em]">
                {brandSuffix}
              </span>
            ) : null}
          </a>
          <div className="flex items-center gap-3 lg:gap-8">
            <nav aria-label={copy.label} className="hidden md:flex items-center gap-5 lg:gap-8">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className="py-3 text-sm lg:text-[15px] font-medium uppercase tracking-[0.05em] text-mist hover:text-white no-underline transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2 md:gap-3">
              {ctaLabel ? (
                <Button
                  variant="secondary"
                  size="sm"
                  href={ctaHref}
                  onClick={onCtaClick}
                  className="max-md:px-3 max-md:text-xs lg:text-[15px] font-medium uppercase tracking-[0.05em] shrink-0"
                >
                  {ctaLabel}
                </Button>
              ) : null}
              <div role="group" aria-label="Language / 언어" className="flex shrink-0 items-center text-sm lg:text-[15px] font-medium tracking-wide">
                <button
                  type="button"
                  lang="en"
                  aria-label="Switch to English"
                  aria-pressed={language === 'en'}
                  onClick={() => setLanguage('en')}
                  className={cx('min-h-11 min-w-7 px-1 cursor-pointer rounded-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice', language === 'en' ? 'text-ice font-semibold' : 'text-mist-dim')}
                >EN</button>
                <span aria-hidden="true" className="text-mist-dim/60">/</span>
                <button
                  type="button"
                  lang="ko"
                  aria-label="한국어로 보기"
                  aria-pressed={language === 'ko'}
                  onClick={() => setLanguage('ko')}
                  className={cx('min-h-11 min-w-7 px-1 cursor-pointer rounded-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice', language === 'ko' ? 'text-ice font-semibold' : 'text-mist-dim')}
                >KO</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
