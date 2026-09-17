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
  /** Optional captions beside the scene, one per beat. Empty by default - the scene speaks for itself. */
  steps?: Array<{ label: string; caption: string }>;
  /** Labels on the three altitude rows. */
  rowLabels?: { leo: string; icarus: string; ground: string };
  /** Labels on the two links ICARUS relays. */
  linkLabels?: { direct: string; laser: string; radio: string };
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

const DEFAULT_ROW_LABELS = { leo: '500 KM · LEO SATELLITE', icarus: '20 KM · ICARUS', ground: '0 KM · GROUND STATION' };
const DEFAULT_LINK_LABELS = { direct: 'DIRECT LINK', laser: 'LASER LINK', radio: 'RF LINK' };

function SatelliteMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 64 28" className="w-16 h-8" style={{ opacity }} aria-hidden="true">
      <rect x="26" y="9" width="12" height="10" rx="2" fill="#e8f2ff" />
      <rect x="4" y="11" width="18" height="6" rx="1" fill="#8fd8ff" opacity=".75" />
      <rect x="42" y="11" width="18" height="6" rx="1" fill="#8fd8ff" opacity=".75" />
      <circle cx="32" cy="22" r="2" fill="#8fd8ff" />
    </svg>
  );
}

function GroundMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 48 34" className="w-12 h-9" style={{ opacity }} aria-hidden="true">
      <path d="M24 2 L32 32 H16 Z" fill="none" stroke="#b9c9e2" strokeWidth="1.6" />
      <path d="M19 20 H29" stroke="#b9c9e2" strokeWidth="1.4" />
      <circle cx="24" cy="2" r="2.4" fill="#8fd8ff" />
    </svg>
  );
}

/** Concentric arcs that read as a radio wave; drawn in its own square viewBox so it never distorts. */
function RadioWaves({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" style={{ opacity }} aria-hidden="true">
      <g fill="none" stroke="#b9c9e2" strokeLinecap="round">
        <path d="M14 26 A 10 10 0 0 1 26 14" strokeWidth="1.5" opacity=".9" />
        <path d="M10 30 A 16 16 0 0 1 30 10" strokeWidth="1.3" opacity=".6" />
        <path d="M6 34 A 22 22 0 0 1 34 6" strokeWidth="1.1" opacity=".35" />
      </g>
    </svg>
  );
}

/**
 * The bottleneck scene, driven by scroll: a satellite and a ground station start out talking
 * straight to each other across 500 km, then the ICARUS airship flies into the empty layer at
 * 20 km and takes over the path - an optical laser link up to the satellite and an RF link down
 * to the ground. `progress` freezes a single frame.
 */
export function AltitudeScrollSection({
  id = 'why-20km',
  eyebrow = 'WHY 20 KM',
  title = 'The layer between orbit and the ground',
  description = 'Solve Communication Bottleneck between LEO and ground',
  steps = [],
  rowLabels = DEFAULT_ROW_LABELS,
  linkLabels = DEFAULT_LINK_LABELS,
  progress,
  trackHeight = '320vh',
  airshipSrc = images.airship3d,
  className,
}: AltitudeScrollSectionProps) {
  const interactive = progress === undefined;
  const { ref, progress: p } = useScrollProgress({ frozen: progress });

  // 0.00-0.30  satellite and ground talk directly
  // 0.30-0.62  the airship flies into the middle layer
  // 0.62-1.00  the direct link gives way to laser up / RF down
  const airshipIn = ramp(p, 0.3, 0.62);
  const relay = ramp(p, 0.62, 0.92);
  const directLink = 1 - relay;
  const activeStep = p < 0.16 ? 0 : p < 0.34 ? 1 : p < 0.66 ? 2 : 3;

  // scene geometry in the 0-100 space the overlay uses
  const airshipX = 20 + airshipIn * 20; // flies in from the left
  const satX = 82;
  const satY = 17;
  const groundX = 82;
  const groundY = 83;
  const relayY = 50;

  const scene = (
    <div className="w-full max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
        <div>
          {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{title}</h2>
          {description ? <p className="mt-6 text-base text-mist leading-relaxed">{description}</p> : null}
          {steps.length ? (
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
          ) : null}
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-space-950/70 overflow-hidden h-[440px] md:h-[540px]">
          <div className="ds-stars absolute inset-0 opacity-50" />

          {/* altitude guides */}
          {(
            [
              [satY, rowLabels.leo, 'text-mist-dim'],
              [relayY, rowLabels.icarus, 'text-ice'],
              [groundY, rowLabels.ground, 'text-mist-dim'],
            ] as const
          ).map(([y, label, tone]) => (
            <div key={label} className="absolute inset-x-0 px-6" style={{ top: `${y}%` }}>
              <div className={cx('font-mono text-[11px] tracking-[0.16em] tabular-nums mb-3', tone)}>{label}</div>
              <div className={cx('border-t border-dashed', y === relayY ? 'border-ice/25' : 'border-white/10')} />
            </div>
          ))}

          {/* links */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* the long direct hop, which fades as the relay takes over */}
            <line
              className="ds-flow"
              x1={satX}
              y1={satY + 4}
              x2={groundX}
              y2={groundY - 2}
              stroke="#b9c9e2"
              strokeWidth="1"
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
              opacity={directLink * 0.55}
            />
            {/* laser: satellite to airship, a clean solid beam */}
            <line
              x1={satX - 2}
              y1={satY + 5}
              x2={airshipX + 4}
              y2={relayY - 4}
              stroke="#8fd8ff"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              opacity={relay * 0.25}
            />
            <line
              x1={satX - 2}
              y1={satY + 5}
              x2={airshipX + 4}
              y2={relayY - 4}
              stroke="#eef6ff"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={relay}
            />
            {/* radio: airship down to the ground station */}
            <line
              className="ds-flow"
              x1={airshipX + 6}
              y1={relayY + 4}
              x2={groundX - 2}
              y2={groundY - 3}
              stroke="#b9c9e2"
              strokeWidth="1"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
              opacity={relay * 0.9}
            />
          </svg>

          {/* link labels */}
          <span
            className="absolute font-mono text-[10px] tracking-[0.16em] text-mist-dim transition-opacity duration-500"
            style={{ left: '86%', top: '46%', transform: 'translate(-50%, -50%)', opacity: directLink * 0.8 }}
          >
            {linkLabels.direct}
          </span>
          <span
            className="absolute font-mono text-[10px] tracking-[0.16em] text-ice transition-opacity duration-500"
            style={{ left: `${(satX + airshipX) / 2}%`, top: '28%', opacity: relay }}
          >
            {linkLabels.laser}
          </span>
          <span
            className="absolute font-mono text-[10px] tracking-[0.16em] text-mist transition-opacity duration-500"
            style={{ left: `${(groundX + airshipX) / 2}%`, top: '70%', opacity: relay }}
          >
            {linkLabels.radio}
          </span>

          {/* marks */}
          <span className="absolute" style={{ left: `${satX}%`, top: `${satY}%`, transform: 'translate(-50%, -140%)' }}>
            <SatelliteMark opacity={0.55 + 0.45 * (1 - relay * 0.4)} />
          </span>
          <span
            className="absolute"
            style={{ left: `${groundX}%`, top: `${groundY}%`, transform: 'translate(-50%, -10%)' }}
          >
            <GroundMark opacity={0.9} />
          </span>
          <span
            className="absolute"
            style={{ left: `${groundX - 12}%`, top: `${groundY - 6}%`, transform: 'translate(-50%, -50%)' }}
          >
            <RadioWaves opacity={relay} />
          </span>

          {/* the airship itself */}
          <img
            src={airshipSrc}
            alt="ICARUS airship"
            className="absolute w-40 md:w-56 h-auto object-contain will-change-transform"
            style={{
              left: `${airshipX}%`,
              top: `${relayY}%`,
              opacity: airshipIn,
              transform: `translate(-50%, -78%) scale(${0.85 + airshipIn * 0.15})`,
            }}
          />
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
      {/* h-screen, not min-h-screen: a sticky box taller than the viewport never pins at the top.
          The page wrapper must not be a scroll container either - use overflow-x-clip, never -hidden. */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">{scene}</div>
    </section>
  );
}
