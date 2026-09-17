import type { ReactNode } from 'react';
import { images } from '../assets';
import { ramp, useScrollProgress } from '../hooks/useScrollProgress';
import { containerClass } from '../primitives/container';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';

export interface AltitudeScrollSectionProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** The altitude scale down the left edge - a name and the altitude it sits at. */
  rowLabels?: {
    leo: string;
    leoAlt: string;
    icarus: string;
    icarusAlt: string;
    atmosphere: string;
    atmosphereAlt: string;
    ground: string;
  };
  /** Throughput written beside each link. Keep the relay figure marked as a target. */
  rates?: { crosslink: string; direct: string; laser: string; relay: string };
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

const DEFAULT_ROW_LABELS = {
  leo: 'LEO',
  leoAlt: '400–700 km',
  icarus: 'ICARUS',
  icarusAlt: '20 km',
  atmosphere: 'ATMOSPHERE',
  atmosphereAlt: '~10 km',
  ground: 'GROUND STATION',
};

const DEFAULT_RATES = {
  crosslink: '~Tbps',
  direct: '~Mbps',
  laser: '~Tbps',
  relay: 'Tens of Gbps (target)',
};

// Link colours, fixed by the wireframe so the three kinds of hop never read as each other:
// red for an optical laser, blue for the radio relay, amber for the weak direct drop. Ice stays
// on the hardware itself. These are local constants, not theme tokens - the brand still has one
// accent, and nothing outside this scene can reach for a second.
const LASER = '#ff4a5c';
const LASER_CORE = '#ffd9dd';
const LASER_TEXT = '#ff9aa4';
const RADIO = '#4aa8e0';
const WEAK = '#d9a441';
const ICE = '#8fd8ff';

const LEO_Y = 19;
const ICARUS_Y = 52;
const ATMO_Y = 76;
const GROUND_Y = 91;
const AXIS_X = 50;
const SAT_X = [18, 50, 82];

function SatelliteMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 64 28" className="w-12 md:w-16 h-auto" style={{ opacity }} aria-hidden="true">
      <rect x="26" y="9" width="12" height="10" rx="2" fill="#e8f2ff" />
      <rect x="4" y="11" width="18" height="6" rx="1" fill={ICE} opacity=".75" />
      <rect x="42" y="11" width="18" height="6" rx="1" fill={ICE} opacity=".75" />
      <circle cx="32" cy="22" r="2" fill={ICE} />
    </svg>
  );
}

function GroundMark({ opacity }: { opacity: number }) {
  return (
    <svg viewBox="0 0 48 34" className="w-10 md:w-12 h-auto" style={{ opacity }} aria-hidden="true">
      <path d="M24 2 L32 32 H16 Z" fill="none" stroke="#b9c9e2" strokeWidth="1.6" />
      <path d="M19 20 H29" stroke="#b9c9e2" strokeWidth="1.4" />
      <circle cx="24" cy="2" r="2.4" fill={ICE} />
    </svg>
  );
}

/** A bank of the cloud deck. Two of these flank the downlink, which threads between them. */
function CloudMark({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 22"
      className="w-20 md:w-32 h-auto"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <path
        d="M10 18 q-8 0 -8 -5 q0 -5 7 -5 q1 -6 9 -6 q7 0 9 5 q4 -3 8 1 q4 -4 8 0 q7 0 7 5 q0 5 -8 5 z"
        fill="#b9c9e2"
        fillOpacity=".12"
        stroke="#b9c9e2"
        strokeOpacity=".45"
        strokeWidth="1.1"
      />
    </svg>
  );
}

/**
 * The bandwidth bottleneck, driven by scroll, in three frames. The LEO constellation, the cloud
 * deck and the ground station stand still the whole way and the red laser crosslinks never stop
 * pulsing; only the downlink changes. Orbit carries Tbps, a direct drop through the cloud deck is
 * worth Mbps, then ICARUS takes the empty layer at 20 km - laser up, radio down. An altitude
 * scale runs down the left edge. `progress` freezes one frame.
 */
export function AltitudeScrollSection({
  id = 'why-20km',
  eyebrow,
  title = 'The layer between orbit and the ground',
  description = 'Solve Communication Bottleneck between LEO and ground',
  rowLabels = DEFAULT_ROW_LABELS,
  rates = DEFAULT_RATES,
  progress,
  trackHeight = '320vh',
  airshipSrc = images.airship3d,
  className,
}: AltitudeScrollSectionProps) {
  const interactive = progress === undefined;
  const { ref, progress: p } = useScrollProgress({ frozen: progress });

  // frame 1 (0.00-0.24)  only the orbital crosslinks - Tbps stays inside the constellation
  // frame 2 (0.24-0.56)  a direct drop to the ground appears, thin and slow through the cloud
  // frame 3 (0.56-1.00)  ICARUS arrives, the direct drop dies, then laser up / radio down light
  // The drop is fully gone before the relay lights, so the two never share the same segment.
  const directIn = ramp(p, 0.24, 0.44);
  const directOut = ramp(p, 0.56, 0.68);
  const direct = directIn * (1 - directOut);
  const airshipIn = ramp(p, 0.58, 0.76);
  const relay = ramp(p, 0.68, 0.88);

  const scene = (
    <div className={containerClass}>
      {/* The display heading the photograph runs into: it introduces the scene, so it sits above
          the frame, and it carries no eyebrow - it is the first thing under the hero. */}
      <div className="max-w-6xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        {description ? <p className="mt-4 text-base md:text-lg text-mist leading-relaxed">{description}</p> : null}
      </div>

      {/* The frame the scene plays inside. Its height is viewport-relative so heading plus frame
          always fit the sticky h-screen box, which clips whatever overflows. */}
      <div className="mt-8 md:mt-10 relative w-full rounded-2xl border border-white/10 bg-space-950/70 overflow-hidden h-[44vh] min-h-[320px] md:h-[52vh] md:min-h-[400px] md:max-h-[620px]">
          <div className="ds-stars absolute inset-0 opacity-50" />

          {/* the atmosphere the downlink has to cross - drawn from the first frame */}
          <div className="absolute inset-x-0 px-5 md:px-6" style={{ top: `${ATMO_Y}%` }}>
            <div className="border-t border-dashed border-white/10" />
          </div>

          {/* The altitude scale down the left edge - the whole point of the scene is which layer
              each hop lives in, so the figures are set large. The LEO block sits above its row
              rather than beside it: the leftmost satellite reaches into that corner. */}
          <div
            className="absolute left-5 md:left-6"
            style={{ top: `${LEO_Y}%`, transform: 'translateY(-118%)' }}
          >
            <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-mist-dim">
              {rowLabels.leo}
            </div>
            <div className="text-base md:text-2xl font-semibold tracking-tight leading-tight text-mist tabular-nums">
              {rowLabels.leoAlt}
            </div>
          </div>
          <div
            className="absolute left-5 md:left-6 transition-opacity duration-500"
            style={{ top: `${ICARUS_Y}%`, transform: 'translateY(-50%)', opacity: airshipIn }}
          >
            <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-ice/70">
              {rowLabels.icarus}
            </div>
            <div className="text-base md:text-2xl font-semibold tracking-tight leading-tight text-ice tabular-nums">
              {rowLabels.icarusAlt}
            </div>
          </div>
          <div
            className="absolute left-5 md:left-6"
            style={{ top: `${ATMO_Y}%`, transform: 'translateY(-118%)' }}
          >
            <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-mist-dim/70">
              {rowLabels.atmosphere}
            </div>
            <div className="text-base md:text-2xl font-semibold tracking-tight leading-tight text-mist-dim tabular-nums">
              {rowLabels.atmosphereAlt}
            </div>
          </div>

          {/* links */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* orbital crosslinks: solid laser, pulsing in every frame */}
            {[0, 1].map((i) => (
              <g key={i} className="animate-pulse">
                <line
                  x1={SAT_X[i] + 6}
                  y1={LEO_Y}
                  x2={SAT_X[i + 1] - 6}
                  y2={LEO_Y}
                  stroke={LASER}
                  strokeWidth="7"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity=".22"
                />
                <line
                  x1={SAT_X[i] + 6}
                  y1={LEO_Y}
                  x2={SAT_X[i + 1] - 6}
                  y2={LEO_Y}
                  stroke={LASER_CORE}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}

            {/* frame 2: the direct drop - thin, dashed, and the only thing crossing the cloud */}
            <line
              className="ds-flow"
              x1={AXIS_X}
              y1={LEO_Y + 5}
              x2={AXIS_X}
              y2={GROUND_Y - 4}
              stroke={WEAK}
              strokeWidth="2"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
              opacity={direct}
            />

            {/* frame 3: laser up to the constellation */}
            <line
              x1={AXIS_X}
              y1={LEO_Y + 5}
              x2={AXIS_X}
              y2={ICARUS_Y - 6}
              stroke={LASER}
              strokeWidth="7"
              vectorEffect="non-scaling-stroke"
              opacity={relay * 0.2}
            />
            <line
              x1={AXIS_X}
              y1={LEO_Y + 5}
              x2={AXIS_X}
              y2={ICARUS_Y - 6}
              stroke={LASER_CORE}
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
              opacity={relay}
            />

            {/* frame 3: radio down to the ground, fatter than the drop it replaced */}
            <line
              className="ds-flow"
              x1={AXIS_X}
              y1={ICARUS_Y + 7}
              x2={AXIS_X}
              y2={GROUND_Y - 4}
              stroke={RADIO}
              strokeWidth="4"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
              opacity={relay}
            />
          </svg>

          {/* Two banks of cloud on the atmosphere line, one either side of the downlink, so the
              link threads between them instead of disappearing behind one. They are centred with
              a fixed gap rather than placed at a percentage: a wide frame would otherwise push
              them off to the sides and leave the link crossing nothing. */}
          <div
            className="absolute inset-x-0 flex items-center justify-center gap-20 md:gap-32"
            style={{ top: `${ATMO_Y}%`, transform: 'translateY(-58%)' }}
          >
            <CloudMark />
            <CloudMark flip />
          </div>

          {/* rates */}
          <span
            className="absolute font-mono text-[10px] md:text-xs tracking-[0.14em]"
            style={{
              left: `${(SAT_X[0] + SAT_X[1]) / 2}%`,
              top: `${LEO_Y + 4}%`,
              transform: 'translateX(-50%)',
              color: LASER_TEXT,
            }}
          >
            {rates.crosslink}
          </span>
          {/* the drop is labelled on the left and the laser that replaces it on the right, so a
              half-finished scroll never stacks the two figures on top of each other */}
          <span
            className="absolute font-mono text-[10px] md:text-xs tracking-[0.14em] whitespace-nowrap transition-opacity duration-500"
            style={{ left: `${AXIS_X - 3}%`, top: '32%', transform: 'translateX(-100%)', color: WEAK, opacity: direct }}
          >
            {rates.direct}
          </span>
          <span
            className="absolute font-mono text-[10px] md:text-xs tracking-[0.14em] transition-opacity duration-500"
            style={{ left: `${AXIS_X + 3}%`, top: '32%', color: LASER_TEXT, opacity: relay }}
          >
            {rates.laser}
          </span>
          <span
            className="absolute font-mono text-[10px] md:text-xs tracking-[0.14em] max-w-[9rem] leading-tight transition-opacity duration-500"
            style={{ left: `${AXIS_X + 3}%`, top: '63%', color: RADIO, opacity: relay }}
          >
            {rates.relay}
          </span>

          {/* marks */}
          {SAT_X.map((x) => (
            <span key={x} className="absolute" style={{ left: `${x}%`, top: `${LEO_Y}%`, transform: 'translate(-50%, -50%)' }}>
              <SatelliteMark opacity={0.95} />
            </span>
          ))}
          <span
            className="absolute"
            style={{ left: `${AXIS_X}%`, top: `${GROUND_Y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <GroundMark opacity={0.9} />
          </span>
          <span
            className="absolute text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-mist-dim whitespace-nowrap"
            style={{ left: `${AXIS_X}%`, top: `${GROUND_Y + 5}%`, transform: 'translateX(-50%)' }}
          >
            {rowLabels.ground}
          </span>

          {/* the airship takes the empty layer */}
          <img
            src={airshipSrc}
            alt="ICARUS airship"
            className="absolute w-32 md:w-44 h-auto object-contain will-change-transform"
            style={{
              left: `${AXIS_X}%`,
              top: `${ICARUS_Y}%`,
              opacity: airshipIn,
              transform: `translate(-50%, -50%) scale(${0.85 + airshipIn * 0.15})`,
            }}
          />
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
