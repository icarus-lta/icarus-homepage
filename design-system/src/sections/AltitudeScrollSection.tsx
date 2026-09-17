import type { ReactNode } from 'react';
import { images } from '../assets';
import { ramp, useScrollProgress } from '../hooks/useScrollProgress';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface AltitudeScrollSectionProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** The four beats of the animation, in order. */
  steps?: Array<{ label: string; caption: string }>;
  /**
   * Freeze the animation at a point from 0 (start) to 1 (end) instead of following the scroll.
   * Use it for static frames; leave it out on a real page.
   */
  progress?: number;
  /** Scroll distance the animation is spread over, as a CSS height. */
  trackHeight?: string;
  /** Airship render that flies into the middle layer. */
  airshipSrc?: string;
  /** Extra classes appended to the <section>. */
  className?: string;
}

const DEFAULT_STEPS = [
  { label: 'Satellites sit 500 km up', caption: 'Wide reach, but far away and expensive per bit.' },
  { label: 'Ground towers stop at the coast', caption: 'Mountains and open sea stay dark.' },
  { label: 'ICARUS enters at 20 km', caption: 'Above the weather, below the orbits.' },
  { label: 'The middle layer closes the gap', caption: 'One airship holds station over a ~200 km area.' },
];

function SatelliteMark({ dim }: { dim: number }) {
  return (
    <svg viewBox="0 0 64 28" className="w-16 h-8" style={{ opacity: dim }} aria-hidden="true">
      <rect x="26" y="9" width="12" height="10" rx="2" fill="#e8f2ff" />
      <rect x="4" y="11" width="18" height="6" rx="1" fill="#8fd8ff" opacity=".75" />
      <rect x="42" y="11" width="18" height="6" rx="1" fill="#8fd8ff" opacity=".75" />
      <circle cx="32" cy="22" r="2" fill="#8fd8ff" />
    </svg>
  );
}

function GroundMark({ dim }: { dim: number }) {
  return (
    <svg viewBox="0 0 48 34" className="w-12 h-9" style={{ opacity: dim }} aria-hidden="true">
      <path d="M24 2 L32 32 H16 Z" fill="none" stroke="#b9c9e2" strokeWidth="1.6" />
      <path d="M19 20 H29" stroke="#b9c9e2" strokeWidth="1.4" />
      <circle cx="24" cy="2" r="2.4" fill="#8fd8ff" />
    </svg>
  );
}

/**
 * The problem scene, driven by scroll: a satellite holds 500 km up, ground stations stop at
 * the horizon, and the ICARUS airship flies into the empty middle layer at 20 km until its
 * coverage spans the gap. Four captions track the scroll; `progress` freezes a single frame.
 */
export function AltitudeScrollSection({
  id = 'why-20km',
  eyebrow = 'WHY 20 KM',
  title = 'The layer between orbit and the ground',
  description = 'Satellites are too far and towers are too low. At 20 km one airship stays above the weather and covers what neither can.',
  steps = DEFAULT_STEPS,
  progress,
  trackHeight = '300vh',
  airshipSrc = images.airship3d,
  className,
}: AltitudeScrollSectionProps) {
  const interactive = progress === undefined;
  const { ref, progress: p } = useScrollProgress({ frozen: progress });

  const airshipIn = ramp(p, 0.18, 0.62);
  const coverage = ramp(p, 0.62, 0.95);
  const activeStep = p < 0.2 ? 0 : p < 0.45 ? 1 : p < 0.75 ? 2 : 3;

  const scene = (
    <div className="w-full max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
        <div>
          {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{title}</h2>
          {description ? <p className="mt-6 text-base text-mist leading-relaxed">{description}</p> : null}
          <ol className="mt-10 space-y-4">
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

        <div className="relative rounded-2xl border border-white/10 bg-space-950/70 overflow-hidden h-[420px] md:h-[520px]">
          <div className="ds-stars absolute inset-0 opacity-50" />

          {/* 500 km - satellite */}
          <div className="absolute inset-x-0 top-[12%] px-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.16em] text-mist-dim tabular-nums">500 KM · LEO</span>
              <SatelliteMark dim={0.55 + 0.35 * (1 - airshipIn)} />
            </div>
            <div className="mt-4 border-t border-dashed border-white/10" />
          </div>

          {/* 20 km - the airship flies in */}
          <div className="absolute inset-x-0 top-[48%] px-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.16em] text-ice tabular-nums">20 KM · ICARUS</span>
              <span
                className="font-mono text-[11px] tracking-[0.16em] text-ice/80 transition-opacity duration-300"
                style={{ opacity: coverage }}
              >
                ≈ 200 KM COVERAGE
              </span>
            </div>
            <div className="relative mt-4">
              <div className="border-t border-dashed border-ice/30" />
              <div
                className="absolute left-0 right-0 -top-px h-px bg-gradient-to-r from-transparent via-ice to-transparent origin-center transition-transform duration-300"
                style={{ transform: `scaleX(${coverage})` }}
              />
              <img
                src={airshipSrc}
                alt="ICARUS airship"
                className="absolute -top-16 md:-top-20 w-40 md:w-56 h-auto object-contain will-change-transform"
                style={{
                  left: `${8 + airshipIn * 34}%`,
                  opacity: airshipIn,
                  transform: `translateX(-50%) scale(${0.85 + airshipIn * 0.15})`,
                }}
              />
            </div>
          </div>

          {/* 0 km - ground station */}
          <div className="absolute inset-x-0 bottom-[10%] px-8">
            <div className="border-b border-dashed border-white/10 mb-4" />
            <div className="flex items-end justify-between">
              <span className="font-mono text-[11px] tracking-[0.16em] text-mist-dim tabular-nums">0 KM · GROUND</span>
              <GroundMark dim={0.9 - 0.3 * airshipIn} />
            </div>
          </div>

          {/* the ground link reaching up to the airship once it is on station */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="87"
              y1="84"
              x2={String(8 + airshipIn * 34)}
              y2="54"
              stroke="#8fd8ff"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="4 4"
              opacity={coverage * 0.8}
            />
          </svg>
        </div>
      </div>
    </div>
  );

  if (!interactive) {
    return (
      <section id={id} className={cx('relative bg-space-900 py-24 md:py-28', className)}>
        {scene}
      </section>
    );
  }

  return (
    <section id={id} ref={ref} className={cx('relative bg-space-900', className)} style={{ height: trackHeight }}>
      <div className="sticky top-0 min-h-screen flex items-center py-24">{scene}</div>
    </section>
  );
}
