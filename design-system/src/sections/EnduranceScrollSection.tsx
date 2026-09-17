import type { ReactNode } from 'react';
import { images } from '../assets';
import { ramp, useScrollProgress } from '../hooks/useScrollProgress';
import { containerClass } from '../primitives/container';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface EnduranceScrollSectionProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Optional captions beside the scene, one per beat. Empty by default - the scene speaks for itself. */
  steps?: Array<{ label: string; caption: string }>;
  /** Duration ladder under the battery. */
  ladder?: string[];
  /**
   * Freeze the animation at a point from 0 to 1 instead of following the scroll.
   * Use it for static frames; leave it out on a real page.
   */
  progress?: number;
  /** Scroll distance the animation is spread over, as a CSS height. */
  trackHeight?: string;
  /** Extra classes appended to the <section>. */
  className?: string;
}

const DEFAULT_STEPS = [
  { label: 'Solar arrays charge by day', caption: 'Sunlight above the clouds runs the props and fills the pack.' },
  { label: 'Batteries carry it through the night', caption: 'Stored energy holds position until sunrise.' },
  { label: 'The cycle repeats, with no fuel', caption: 'Every day closes the loop again.' },
  { label: 'Station-keeping for years', caption: 'Days become months; the target is five years and beyond.' },
];

const DEFAULT_LADDER = ['1 DAY', '30 DAYS', '1 YEAR', '5 YEARS+'];

function SunMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7 absolute inset-0" style={{ opacity }} aria-hidden="true">
      <circle cx="16" cy="16" r="6" fill="#ffd9a0" />
      <g stroke="#ffd9a0" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3" />
      </g>
    </svg>
  );
}

function MoonMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7 absolute inset-0" style={{ opacity }} aria-hidden="true">
      <path d="M21 6a11 11 0 1 0 5 12 9 9 0 0 1-5-12Z" fill="#cfe4ff" />
    </svg>
  );
}

/**
 * The endurance scene, driven by scroll: solar arrays fill the battery through the day,
 * the pack carries the airship through the night, and the duration ladder climbs from one
 * day to five years. `progress` freezes a single frame.
 */
export function EnduranceScrollSection({
  id = 'endurance',
  eyebrow = 'ENDURANCE',
  title = 'It charges itself, and stays',
  description = 'Above the weather the sun is reliable. Solar arrays charge by day, batteries fly it through the night, and the loop repeats without refuelling.',
  steps = [],
  ladder = DEFAULT_LADDER,
  progress,
  trackHeight = '300vh',
  className,
}: EnduranceScrollSectionProps) {
  const { ref, progress: p } = useScrollProgress({ frozen: progress });

  const charge =
    p < 0.35
      ? 0.3 + ramp(p, 0, 0.35) * 0.7
      : p < 0.6
        ? 1 - ramp(p, 0.35, 0.6) * 0.45
        : p < 0.8
          ? 0.55 + ramp(p, 0.6, 0.8) * 0.4
          : 0.95;
  const daylight = p < 0.35 ? 1 : p < 0.6 ? 1 - ramp(p, 0.35, 0.5) : p < 0.8 ? ramp(p, 0.6, 0.72) : 0.65;
  const activeStep = p < 0.3 ? 0 : p < 0.55 ? 1 : p < 0.78 ? 2 : 3;
  const ladderIndex = p < 0.3 ? 0 : p < 0.55 ? 1 : p < 0.8 ? 2 : 3;

  const scene = (
    <div className={containerClass}>
      {/* the heading introduces the scene, so it sits above the frame rather than beside it */}
      <div className="max-w-4xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        {description ? <p className="mt-4 text-base md:text-lg text-mist leading-relaxed">{description}</p> : null}
        <ol className={cx('mt-10 space-y-4', !steps.length && 'hidden')}>
            {steps.map((step, i) => (
              <li key={step.label} className="flex gap-4">
                <span
                  className={cx(
                    'font-mono text-xs pt-1 tabular-nums transition-colors duration-500',
                    i === activeStep ? 'text-ice' : 'text-mist-dim/60',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span
                    className={cx(
                      'block text-sm font-medium transition-colors duration-500',
                      i === activeStep ? 'text-white' : 'text-mist-dim',
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cx(
                      'block text-sm mt-1 transition-opacity duration-500',
                      i === activeStep ? 'text-mist opacity-100' : 'text-mist-dim opacity-50',
                    )}
                  >
                    {step.caption}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

      {/* The frame the scene plays inside. Its height is viewport-relative so heading plus frame
          always fit the sticky h-screen box, which clips whatever overflows. */}
      <div className="mt-8 md:mt-10 relative w-full rounded-2xl border border-white/10 bg-space-950/70 overflow-hidden h-[44vh] min-h-[320px] md:h-[52vh] md:min-h-[380px] md:max-h-[520px] flex flex-col">
          <div className="ds-stars absolute inset-0 opacity-40" />

          {/* sky: the band warms at noon and goes dark at night */}
          <div className="relative h-40 md:h-52 shrink-0 overflow-hidden">
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: daylight,
                background: 'linear-gradient(180deg, #123a6b 0%, #2f6ea8 55%, #7fb4dd 100%)',
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: 1 - daylight,
                background: 'linear-gradient(180deg, #01030a 0%, #050d20 60%, #0a1730 100%)',
              }}
            />
            <div className="ds-stars absolute inset-0" style={{ opacity: (1 - daylight) * 0.8 }} />
            <span
              className="absolute w-7 h-7 transition-all duration-700"
              style={{ left: `${18 + daylight * 60}%`, top: `${58 - daylight * 34}%` }}
            >
              <SunMark opacity={daylight} />
              <MoonMark opacity={1 - daylight} />
            </span>
            <img
              src={images.airship3d}
              alt=""
              aria-hidden="true"
              className="absolute left-[8%] bottom-6 w-28 md:w-36 h-auto object-contain animate-float"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-space-950" />
            <span className="absolute left-6 top-5 font-mono text-[11px] tracking-[0.16em] text-white/70">
              ENERGY CYCLE
            </span>
          </div>

          {/* battery */}
          <div className="relative px-8 md:px-10 -mt-4">
            <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.16em]">
              <span className="text-mist-dim">STATE OF CHARGE</span>
              <span className="text-ice tabular-nums">{Math.round(charge * 100)}%</span>
            </div>
            <div className="mt-3 h-4 rounded-full border border-white/15 bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ice-600 to-ice transition-[width] duration-300"
                style={{ width: `${charge * 100}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.14em] text-mist-dim">
              <span style={{ opacity: 0.4 + daylight * 0.6 }}>CHARGING</span>
              <span style={{ opacity: 0.4 + (1 - daylight) * 0.6 }}>ON BATTERY</span>
            </div>
          </div>

          {/* duration ladder */}
          <div className="relative mt-auto px-8 md:px-10 pb-8 md:pb-10">
            <div className="h-px bg-white/10" />
            <div
              className="h-px bg-gradient-to-r from-ice-600 to-ice -mt-px origin-left transition-transform duration-500"
              style={{ transform: `scaleX(${0.12 + (ladderIndex / (ladder.length - 1)) * 0.88})` }}
            />
            <div className="mt-4 grid" style={{ gridTemplateColumns: `repeat(${ladder.length}, minmax(0, 1fr))` }}>
              {ladder.map((mark, i) => (
                <span
                  key={mark}
                  className={cx(
                    'font-mono text-[11px] tracking-[0.14em] tabular-nums transition-colors duration-500',
                    i === ladder.length - 1 ? 'text-right' : '',
                    i <= ladderIndex ? 'text-white' : 'text-mist-dim/60',
                  )}
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>
      </div>
    </div>
  );

  if (progress !== undefined) {
    return (
      <section id={id} className={cx('relative bg-space-950 py-24 md:py-28', className)}>
        {scene}
      </section>
    );
  }

  return (
    <section id={id} ref={ref} className={cx('relative bg-space-950', className)} style={{ height: trackHeight }}>
      {/* h-screen, not min-h-screen: a sticky box taller than the viewport never pins at the top. */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">{scene}</div>
    </section>
  );
}
