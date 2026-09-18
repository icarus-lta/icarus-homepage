import type { CSSProperties, ReactNode } from 'react';
import { useId } from 'react';
import { content } from '../i18n/content';
import { useLanguage } from '../i18n/language';
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
  /** The altitude scale down the left edge - one name and altitude per layer. */
  rowLabels?: {
    leo: string;
    leoAlt: string;
    /** The 20 km row - the empty layer the airship takes. It keeps this name throughout. */
    stratosphere: string;
    stratosphereAlt: string;
    troposphere: string;
    troposphereAlt: string;
    ground: string;
    groundAlt: string;
    /** Caption under the dish inside the frame. */
    groundStation: string;
  };
  /**
   * What is written beside each link: `*Kind` names the kind of hop, the bare key is what it
   * carries. The relay pairs Gbps with its bandwidth gain.
   */
  rates?: {
    crosslinkKind: string;
    crosslink: string;
    directKind: string;
    direct: string;
    bottleneck: string;
    laserKind: string;
    laser: string;
    relayKind?: string;
    relay: string;
    relayGain?: string;
  };
  /**
   * Freeze the animation at a point from 0 (start) to 1 (end) instead of following the scroll.
   * Use it for static frames; leave it out on a real page.
   */
  progress?: number;
  /** Scroll distance the animation is spread over, as a CSS height. */
  trackHeight?: string;
  /** Optional replacement image; defaults to an airship pictogram matching the diagram icons. */
  airshipSrc?: string;
  /** Extra classes appended to the <section>. */
  className?: string;
}

// Link colours, fixed by the wireframe so the three kinds of hop never read as each other:
// red for an optical laser, blue for the radio relay, amber for the throttled direct drop. Ice stays
// on the hardware itself. These are local constants, not theme tokens - the brand still has one
// accent, and nothing outside this scene can reach for a second.
const LASER = '#ff4a5c';
const LASER_CORE = '#ffd9dd';
const LASER_TEXT = '#ff9aa4';
const RADIO = '#4aa8e0';
const WEAK = '#d9a441';
const ICE = '#8fd8ff';
// Full-opacity light pink keeps the laser labels as legible as Direct to Cell, while retaining
// the optical link's red colour family. The radio label uses equally clear, full-opacity amber.
const LASER_LABEL = '#ffb4bc';
const WEAK_LABEL = '#f2c877';

// The altitude scale, as a percentage of the frame height. Every row is used twice - once by the
// axis on the left and once by whatever sits on that layer - so the two can never drift apart.
const LEO_Y = 17;
const STRATO_Y = 48;
const TROPO_Y = 72;
const GROUND_Y = 88;

/** A row's altitude expressed in the link column's own 0-1000 vertical space. */
const linkY = (y: number) => Math.round(((y - LEO_Y) / (GROUND_Y - LEO_Y)) * 1000);
const LEO_L = linkY(LEO_Y);
const STRATO_L = linkY(STRATO_Y);
const GROUND_L = linkY(GROUND_Y);

// Satellites across the plot area. The downlink drops from the middle one.
const SAT_X = [10, 50, 90];
const LINK_X = 50;
// The link column's viewBox. Its height is a percentage of the frame and it is stretched with
// `preserveAspectRatio="none"`, so `linkY()` can place a hop at exactly the altitude the axis
// gives it; `non-scaling-stroke` then keeps every stroke and dash at its true size however far
// the box has been stretched. Every link in it is vertical and centred on COL_MID.
const COL_W = 200;
const COL_MID = COL_W / 2;
// Half-widths of the two translucent bands, in those same viewBox units. The whole argument of
// the scene is in the ratio between them: the direct drop is the narrow one (megabits), the relay
// that replaces it the wide one (gigabits). The column is stretched to its element width,
// so both narrow with the frame; the wider of the two has to stay inside the gap between the
// cloud banks, which is what caps them on a phone.
const DROP_HALF = 34;
const RELAY_HALF = 56;
// Where the airship comes in from: a third of the way out from the link to the right edge, which
// is about where the wireframe's own entry arrow starts.
const AIRSHIP_FROM = (100 - LINK_X) / 3;
/** Decelerating entry, so the airship settles onto its layer instead of snapping to it. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** A satellite on the constellation line: two panels, a bus, and the glow of its own optics. */
function SatelliteNode() {
  return (
    <svg viewBox="0 0 56 28" className="w-8 md:w-14 h-auto overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="ds-sat-glow">
          <stop offset="0%" stopColor={ICE} stopOpacity=".42" />
          <stop offset="100%" stopColor={ICE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="28" cy="14" r="15" fill="url(#ds-sat-glow)" />
      <g fill={ICE} fillOpacity=".2" stroke={ICE} strokeOpacity=".6" strokeWidth="1">
        <rect x="1.5" y="10" width="16" height="8" rx="1.2" />
        <rect x="38.5" y="10" width="16" height="8" rx="1.2" />
      </g>
      <path d="M9.5 10v8M46.5 10v8" stroke={ICE} strokeOpacity=".45" strokeWidth=".9" />
      <path d="M17.5 14h4.5M34 14h4.5" stroke={ICE} strokeOpacity=".6" strokeWidth="1.2" />
      <rect x="22" y="7.5" width="12" height="13" rx="3" fill="#eef6ff" />
      <path d="M28 7.5V3" stroke={ICE} strokeOpacity=".8" strokeWidth="1.1" />
      <circle cx="28" cy="2.4" r="1.6" fill={ICE} />
    </svg>
  );
}

/** A slender airship with a symmetric silhouette, blue upper hull and flush solar cells. */
function AirshipNode() {
  const { language } = useLanguage();
  const copy = content[language].altitude;
  const envelopeGradient = useId();
  const solarClip = useId();
  // Both halves share the horizontal centreline at y=24; the lower contour mirrors the upper.
  const envelopePath = 'M5 24C30 15 61 9 98 9C121 9 139 14 139 24C139 34 121 39 98 39C61 39 30 33 5 24Z';
  const finPath = 'M23 20 24 10Q24 9 26 9H34L45 18Z';
  return (
    <svg
      viewBox="0 0 144 48"
      className="relative w-28 md:w-48 h-auto overflow-visible"
      style={{ transform: 'scaleX(-1)' }}
      role="img"
      aria-label={copy.airship}
      stroke={ICE}
      strokeWidth=".85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <desc>{copy.airshipDescription}</desc>
      <defs>
        <linearGradient id={envelopeGradient} x1="0" y1="9" x2="0" y2="39" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#bddfff" />
          <stop offset="18%" stopColor="#659ecb" />
          <stop offset="40%" stopColor="#255c95" />
          <stop offset="46%" stopColor="#1c4d82" />
          <stop offset="53%" stopColor="#bcd9ec" />
          <stop offset="66%" stopColor="#d5e2ec" />
          <stop offset="83%" stopColor="#819bb2" />
          <stop offset="100%" stopColor="#344f6b" />
        </linearGradient>
        <clipPath id={solarClip}>
          <path d={envelopePath} />
        </clipPath>
      </defs>
      <path d={finPath} fill="#507fa5" strokeOpacity=".75" />
      <path d={finPath} transform="translate(0 48) scale(1 -1)" fill="#376c99" strokeOpacity=".75" />
      <path d={envelopePath} fill={`url(#${envelopeGradient})`} />
      <path d="M8 24H136" fill="none" stroke="#eef8ff" strokeOpacity=".5" strokeWidth=".7" />
      <path d="M16 28C51 37 104 39 129 29" fill="none" stroke="#315779" strokeOpacity=".4" strokeWidth=".65" />
      {/* The solar skin follows the hull with 25% less depth; cell dividers stay clear at icon size. */}
      <g clipPath={`url(#${solarClip})`} stroke="#b7daf2" strokeWidth=".65">
        <path d="M35 0H122L116 15.5C91 12.4 64 14.8 40 19.1Z" fill="#102f54" fillOpacity=".95" strokeOpacity=".85" />
        <path d="M48 0V17.7M62 0V15.8M76 0V14.5M90 0V13.8M104 0V14.2" fill="none" strokeOpacity=".8" />
        <path d="M38 16.6C63 12.3 91 10.4 118 13.2" fill="none" strokeOpacity=".65" strokeWidth=".5" />
      </g>
      <path d="M5 24C30 15 61 9 98 9C121 9 139 14 139 24" fill="none" stroke="#f1f8ff" strokeOpacity=".65" strokeWidth=".85" />
    </svg>
  );
}

/** One shared text style and baseline for all five ground captions. */
function GroundCaption({ x, children }: { x: number; children: ReactNode }) {
  const { language } = useLanguage();
  return (
    <span
      className={cx(
        'absolute w-max md:max-w-none text-center font-bold uppercase leading-tight text-ice-300',
        language === 'ko'
          ? 'max-w-[26%] text-[11px] md:text-sm tracking-normal md:tracking-[0.03em]'
          : 'max-w-[20%] text-[7px] min-[360px]:text-[7.5px] md:text-[10px] tracking-[0.02em] md:tracking-[0.12em]',
      )}
      style={{ left: `${x}%`, top: `${GROUND_Y + 4}%`, transform: 'translateX(-50%)' }}
    >
      {children}
    </span>
  );
}

/** The dish the whole scene is trying to feed. */
function GroundStation() {
  return (
    <svg viewBox="0 0 44 34" className="w-[var(--ground-station-size)] h-auto overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="ds-gs-glow">
          <stop offset="0%" stopColor={ICE} stopOpacity=".3" />
          <stop offset="100%" stopColor={ICE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="22" cy="20" rx="20" ry="14" fill="url(#ds-gs-glow)" />
      {/* the bowl, tipped off vertical so it reads as a dish aimed up, not a bowl */}
      <g transform="rotate(-14 22 13)">
        <path d="M8 13 A14 14 0 0 1 36 13 Z" fill="#b9c9e2" fillOpacity=".2" stroke="#cfe0f5" strokeOpacity=".75" strokeWidth="1.3" />
        <path d="M8 13 A14 5 0 0 0 36 13" fill="none" stroke="#cfe0f5" strokeOpacity=".4" strokeWidth="1" />
        <path d="M22 13V4.5" stroke="#cfe0f5" strokeOpacity=".5" strokeWidth="1" />
        <circle cx="22" cy="4" r="1.7" fill={ICE} />
      </g>
      <path d="M22 17v11M15 29h14" stroke="#cfe0f5" strokeOpacity=".6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// Four service groups enter in the final frame. Mobility combines adjacent aerial and maritime
// icons at the three-quarter point; Military occupies the far-right end of the ground row.
const SERVICE_GROUPS = [
  { label: 'City', x: 10, nodes: [{ kind: 'buildings', x: 10, y: GROUND_Y }] },
  { label: 'Mobile', x: 29, nodes: [{ kind: 'mobile', x: 29, y: GROUND_Y }] },
  { label: 'Mobility', x: 75, nodes: [{ kind: 'mobility', x: 75, y: GROUND_Y }] },
  { label: 'Military', x: 96, nodes: [{ kind: 'military', x: 96, y: GROUND_Y }] },
] as const;

function ServiceEndpoint({ kind }: { kind: (typeof SERVICE_GROUPS)[number]['nodes'][number]['kind'] }) {
  return (
    <svg
      viewBox={kind === 'mobility' ? '0 0 128 44' : '0 0 64 44'}
      className={cx(
        'h-auto overflow-visible',
        kind === 'mobility' ? 'w-8 min-[360px]:w-12 md:w-28' :
          kind === 'military' ? 'w-6 min-[360px]:w-8 md:w-16' : 'w-9 md:w-16',
      )}
      fill="none"
      stroke={ICE}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'buildings' && (
        <>
          <path d="M5 41V18h15V6h23v17h15v18Z" fill={ICE} fillOpacity=".1" />
          <path d="M20 18v23M43 23v18M27 41v-8h9v8M31 6V1" strokeOpacity=".65" />
          <path d="M10 24h4m-4 7h4m12-18h4m6 0h2m-12 7h4m6 0h2m-12 7h4m6 0h2m11 2h4m-4 7h4" strokeWidth="2" />
        </>
      )}
      {kind === 'mobile' && (
        <>
          <rect x="23" y="9" width="19" height="32" rx="4" fill={ICE} fillOpacity=".12" />
          <path d="M29 13h7M30 36h5M16 10a21 21 0 0 1 33 0M20 14a16 16 0 0 1 25 0" strokeOpacity=".65" />
          <circle cx="32.5" cy="24" r="2.5" fill={ICE} stroke="none" />
        </>
      )}
      {kind === 'mobility' && (
        <g>
          <path d="m16 24 9-8h15l9 8-8 5H25Z" fill={ICE} fillOpacity=".18" />
          <path d="m31 16-4 8h20M16 23l-8-5m40 5 8-5M10 13v9m44-9v9M3 13h14m30 0h14M24 29l-3 6m19-6 3 6M18 35h28" />
          <path d="M3 9h14m30 0h14" strokeOpacity=".35" />
          <g transform="translate(64 0)">
          <path d="m5 28 7 10h39l9-15-18 5Z" fill={ICE} fillOpacity=".16" />
          <path d="M13 28V17h22v11m0-8h11v7M19 17V9h11v8M24 9V3M19 22h4m5 0h3m8 2h3" />
          <path d="M4 42q5-4 10 0t10 0t10 0t10 0t10 0t8 0" strokeOpacity=".5" />
          </g>
        </g>
      )}
      {kind === 'military' && (
        <>
          {/* A field communications vehicle with an antenna and a star insignia. */}
          <path d="M7 31V17h30v-6h15l7 13v10H7Z" fill={ICE} fillOpacity=".14" />
          <path d="M37 17v17M42 16h7l4 9H42ZM14 17V6m-5 3a7 7 0 0 1 10 0M11 5a11 11 0 0 1 11 0" />
          <path d="m23 21 1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5Z" fill={ICE} fillOpacity=".65" strokeWidth=".8" />
          <circle cx="17" cy="35" r="5" fill="#071331" />
          <circle cx="49" cy="35" r="5" fill="#071331" />
          <path d="M17 34v2m32-2v2M4 41h57" strokeOpacity=".5" />
        </>
      )}
    </svg>
  );
}

/** A bank of the cloud deck. Two of these flank the downlink, which threads between them. */
function CloudMark({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 22"
      className="w-16 md:w-32 h-auto"
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

/** One rung of the altitude scale: a right-aligned altitude over its name, then a tick. */
function AxisRow({
  y,
  name,
  alt,
  altColor,
  nameColor,
  tickColor,
}: {
  y: number;
  name: ReactNode;
  alt: string;
  altColor: string;
  nameColor: string;
  tickColor: string;
}) {
  const { language } = useLanguage();
  return (
    <div
      className="absolute inset-x-0 flex items-center justify-end gap-2 md:gap-2.5"
      style={{ top: `${y}%`, transform: 'translateY(-50%)' }}
    >
      <div className="text-right">
        <div
          className="text-xs min-[360px]:text-[14px] md:text-xl font-semibold leading-tight tracking-tight tabular-nums whitespace-nowrap transition-colors duration-500"
          style={{ color: altColor }}
        >
          {alt}
        </div>
        <div
          className={cx(
            'mt-1 uppercase leading-snug whitespace-nowrap transition-colors duration-500',
            language === 'ko'
              ? 'text-[8px] md:text-xs font-bold tracking-normal md:tracking-[0.03em]'
              : 'text-[7px] min-[360px]:text-[8px] md:text-[10px] font-medium tracking-[0.12em] min-[360px]:tracking-[0.16em] md:tracking-[0.24em]',
          )}
          style={{ color: nameColor }}
        >
          {name}
        </div>
      </div>
      <span className="w-2.5 md:w-3 h-px flex-none transition-colors duration-500" style={{ background: tickColor }} />
    </div>
  );
}

/**
 * What is written beside a link: the kind of hop in the axis's own micro-caps, the figure it
 * carries under it. Same face and same rhythm as the altitude scale on the left - this scene has
 * no monospace in it, because beside that scale mono read as a code listing.
 */
function LinkLabel({
  kind,
  rate,
  kindColor,
  rateColor,
  className,
  style,
}: {
  kind: ReactNode;
  rate: ReactNode;
  kindColor: string;
  rateColor: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { language } = useLanguage();
  return (
    <div className={cx('absolute transition-opacity duration-500', className)} style={style}>
      <div
        className={cx(
          'font-bold uppercase leading-snug break-words',
          language === 'ko'
            ? 'text-[11px] md:text-sm tracking-normal md:tracking-[0.03em]'
            : 'text-[9px] md:text-[11px] tracking-[0.08em] min-[360px]:tracking-[0.16em] md:tracking-[0.2em]',
        )}
        style={{ color: kindColor }}
      >
        {kind}
      </div>
      <div
        className="mt-0.5 text-[13px] md:text-base font-bold tracking-tight tabular-nums leading-tight"
        style={{ color: rateColor }}
      >
        {rate}
      </div>
    </div>
  );
}

/**
 * Three scroll milestones: 0% shows the Mbps bottleneck; 50% adds ICARUS at 20 km and its
 * Gbps relay; 100% adds Direct to Cell for City, Mobile, Mobility and Military.
 * The ground station, constellation and clouds remain visible and fixed throughout.
 * `progress` freezes one frame, with smooth transitions approaching each milestone.
 */
export function AltitudeScrollSection(props: AltitudeScrollSectionProps) {
  const { language } = useLanguage();
  const copy = content[language].altitude;
  const {
    id = 'why-20km',
    eyebrow,
    title = copy.title,
    description = copy.description,
    rowLabels = copy.rowLabels,
    rates = copy.rates,
    progress,
    trackHeight = '320vh',
    airshipSrc,
    className,
  } = props;
  const interactive = progress === undefined;
  const { ref, progress: p } = useScrollProgress({ frozen: progress });

  // The initial bottleneck is visible before scrolling. Transition into a complete relay at
  // 50%, hold that frame, then reveal the service endpoints and their links together at 100%.
  // The direct drop fades out before the relay lights so the two bands stay distinct.
  const direct = 1 - ramp(p, 0.3, 0.38);
  const airshipTravel = ramp(p, 0.36, 0.5);
  const airshipIn = easeOut(airshipTravel);
  const relay = ramp(p, 0.42, 0.5);
  const serviceLinks = ramp(p, 0.85, 1);
  const arrived = Math.min(1, airshipIn * 1.15);

  const axisName = '#c9d8ec';
  const dimAlt = 'rgba(185,201,226,.9)';
  const strataName = `rgba(143,216,255,${0.85 + arrived * 0.15})`;
  const strataAlt = `rgba(143,216,255,${0.72 + arrived * 0.28})`;

  const scene = (
    <div className={containerClass}>
      {/* The display heading the scene runs under: it introduces the frame, so it sits above it,
          and it carries no eyebrow - it is the first thing under the hero. */}
      <div className="w-full">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h2 className="max-w-6xl text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        {description ? <p className="mt-4 text-lg md:text-xl text-mist leading-relaxed tracking-[-0.015em] xl:whitespace-nowrap">{description}</p> : null}
      </div>

      {/* The frame the scene plays inside. Its height is viewport-relative so heading plus frame
          always fit the sticky h-screen box, which clips whatever overflows. */}
      <div className="mt-8 md:mt-10 relative w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-space-950 overflow-hidden h-[52vh] min-h-[360px] md:h-[60vh] md:min-h-[440px] md:max-h-[680px] shadow-2xl [--ground-station-size:2rem] md:[--ground-station-size:3rem]">
        {/* Air thickens toward the ground: space at the top, a blue haze over the cloud deck, a
            glow where the horizon would be. Painted before anything else so it never competes. */}
        <div className="ds-stars absolute inset-x-0 top-0 h-3/5 opacity-45" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(2,3,10,0) 22%, rgba(7,19,49,.55) 66%, rgba(28,63,125,.42) 86%, rgba(2,3,10,.85) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: 'radial-gradient(70% 100% at 50% 118%, rgba(143,216,255,.22), transparent 70%)' }}
        />
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07)' }} />

        {/* The altitude scale. Which layer each hop lives in is the whole argument, so the
            altitudes are a real axis - names and figures right-aligned into a rule, a tick at
            every level - and the plot beside it starts where the rule is, so every rung lines up
            with the thing it labels. */}
        <div className="absolute inset-y-0 left-0 w-[88px] min-[360px]:w-[100px] md:w-[152px]">
          <div
            className="absolute right-0 w-px"
            style={{
              top: `${LEO_Y}%`,
              height: `${GROUND_Y - LEO_Y}%`,
              background:
                'linear-gradient(to bottom, rgba(255,255,255,.06), rgba(255,255,255,.24) 25%, rgba(255,255,255,.24) 75%, rgba(255,255,255,.06))',
            }}
          />
          <AxisRow
            y={LEO_Y}
            name={rowLabels.leo}
            alt={rowLabels.leoAlt}
            nameColor={axisName}
            altColor={dimAlt}
            tickColor="rgba(255,255,255,.35)"
          />
          {/* 20 km is on the scale from the first frame - the empty layer is the argument. It
              keeps its own name when the airship lands on it and only brightens. */}
          <AxisRow
            y={STRATO_Y}
            name={rowLabels.stratosphere}
            alt={rowLabels.stratosphereAlt}
            nameColor={strataName}
            altColor={strataAlt}
            tickColor={`rgba(143,216,255,${0.45 + arrived * 0.55})`}
          />
          <AxisRow
            y={TROPO_Y}
            name={rowLabels.troposphere}
            alt={rowLabels.troposphereAlt}
            nameColor={axisName}
            altColor={dimAlt}
            tickColor="rgba(255,255,255,.35)"
          />
          <AxisRow
            y={GROUND_Y}
            name={rowLabels.ground}
            alt={rowLabels.groundAlt}
            nameColor={axisName}
            altColor={dimAlt}
            tickColor="rgba(255,255,255,.35)"
          />
        </div>

        {/* Everything the axis measures lives in here, so a percentage means the same thing on
            both sides of the rule. */}
        <div className="absolute inset-y-0 left-[88px] min-[360px]:left-[100px] md:left-[152px] right-2 min-[360px]:right-4 md:right-8">
          {/* the empty layer at 20 km, drawn from the first frame and lit when it is taken */}
          <div
            className="absolute inset-x-0 border-t border-dashed transition-colors duration-700"
            style={{ top: `${STRATO_Y}%`, borderColor: `rgba(143,216,255,${0.12 + arrived * 0.28})` }}
          />
          {/* the cloud deck the downlink has to cross */}
          <div className="absolute inset-x-0 border-t border-dashed border-white/12" style={{ top: `${TROPO_Y}%` }} />
          {/* the ground itself */}
          <div
            className="absolute inset-x-0 h-px"
            style={{
              top: `${GROUND_Y}%`,
              background: 'linear-gradient(to right, transparent, rgba(185,201,226,.35) 20%, rgba(185,201,226,.35) 80%, transparent)',
            }}
          />

          {/* horizontal links: drawn in the plot's own percentage space, strokes kept true size */}
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
                  x1={SAT_X[i] + 5}
                  y1={LEO_Y}
                  x2={SAT_X[i + 1] - 5}
                  y2={LEO_Y}
                  stroke={LASER}
                  strokeWidth="8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity=".2"
                />
                <line
                  x1={SAT_X[i] + 5}
                  y1={LEO_Y}
                  x2={SAT_X[i + 1] - 5}
                  y2={LEO_Y}
                  stroke={LASER_CORE}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>

          {/* Bands fade all the way to ground level. A separate layer clips only the lines
              4px above the station, keeping the diagram clear without a hard edge on the glow. */}
          <div
            className="absolute pointer-events-none w-[80px] md:w-[112px]"
            style={{
              left: `${LINK_X}%`,
              top: `${LEO_Y}%`,
              height: `${GROUND_Y - LEO_Y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox={`0 0 ${COL_W} 1000`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="ds-drop-band" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={WEAK} stopOpacity="0" />
                  <stop offset="8%" stopColor={WEAK} stopOpacity=".2" />
                  <stop offset="65%" stopColor={WEAK} stopOpacity=".17" />
                  <stop offset="85%" stopColor={WEAK} stopOpacity=".08" />
                  <stop offset="100%" stopColor={WEAK} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="ds-relay-band" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={RADIO} stopOpacity="0" />
                  <stop offset="10%" stopColor={RADIO} stopOpacity=".24" />
                  <stop offset="60%" stopColor={RADIO} stopOpacity=".2" />
                  <stop offset="85%" stopColor={RADIO} stopOpacity=".08" />
                  <stop offset="100%" stopColor={RADIO} stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect
                x={COL_MID - DROP_HALF}
                y={LEO_L + 30}
                width={DROP_HALF * 2}
                height={GROUND_L - (LEO_L + 30)}
                fill="url(#ds-drop-band)"
                opacity={direct}
              />
              <rect
                x={COL_MID - RELAY_HALF}
                y={STRATO_L + 46}
                width={RELAY_HALF * 2}
                height={GROUND_L - (STRATO_L + 46)}
                fill="url(#ds-relay-band)"
                opacity={relay}
              />
            </svg>

            {/* CSS pixels match the icon's responsive dimensions (44:34), independent of the
                SVG's stretched coordinate system. Only the solid/dashed line layer is clipped. */}
            <div
              className="absolute inset-0"
              style={{ clipPath: 'inset(0 0 calc(var(--ground-station-size) * 34 / 44 + 4px) 0)' }}
            >
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${COL_W} 1000`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >

            {/* initial frame: orbit drops straight to the ground, and the whole way down it is worth
                megabits - thin against the relay that replaces it, which is the bottleneck. The
                band is parallel-sided: the drop does not narrow, it is simply never wide. */}
            <g opacity={direct}>
              <line
                className="ds-flow"
                x1={COL_MID}
                y1={LEO_L + 30}
                x2={COL_MID}
                y2={GROUND_L - 16}
                stroke={WEAK}
                strokeWidth="2.5"
                strokeDasharray="9 7"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* 50% frame: the laser pulses at the same cadence as the orbital crosslinks. */}
            <g opacity={relay}>
              <g className="animate-pulse">
                <line
                  x1={COL_MID}
                  y1={LEO_L + 34}
                  x2={COL_MID}
                  y2={STRATO_L - 46}
                  stroke={LASER}
                  strokeWidth="9"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity=".18"
                />
                <line
                  x1={COL_MID}
                  y1={LEO_L + 34}
                  x2={COL_MID}
                  y2={STRATO_L - 46}
                  stroke={LASER_CORE}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
              {/* The wider radio downlink ends above the station, inside its fading band. */}
              <line
                className="ds-flow"
                x1={COL_MID}
                y1={STRATO_L + 46}
                x2={COL_MID}
                y2={GROUND_L - 16}
                stroke={RADIO}
                strokeWidth="5"
                strokeDasharray="12 7"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            </svg>
            </div>
          </div>

          {/* Direct-to-cell links originate at the airship, not at the ground station. Their
              fan starts below the labels, leaving the existing vertical gateway link intact. */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ opacity: serviceLinks }}
            aria-hidden="true"
          >
            {SERVICE_GROUPS.flatMap(({ nodes }) => nodes.map(({ kind, x, y }) => (
              <path
                key={kind}
                d={`M ${LINK_X} ${STRATO_Y + 5} C ${LINK_X} 66, ${x} 72, ${x} ${y - 7}`}
                stroke={RADIO}
                strokeWidth="1.4"
                strokeDasharray="4 6"
                strokeOpacity=".65"
                vectorEffect="non-scaling-stroke"
                fill="none"
                className="ds-flow"
              />
            )))}
          </svg>

          {/* Two banks of cloud on the troposphere line, one either side of the downlink, so the
              link threads between them instead of disappearing behind one. They are centred with
              a fixed gap rather than placed at a percentage: a wide frame would otherwise push
              them off to the sides and leave the link crossing nothing. */}
          <div
            className="absolute inset-x-0 flex items-center justify-center gap-16 md:gap-40 translate-y-[calc(-58%+9px)] md:translate-y-[calc(-58%+15px)]"
            style={{ top: `${TROPO_Y}%` }}
          >
            <CloudMark />
            <CloudMark flip />
          </div>

          {/* Labels. The crosslink's sits under the span it belongs to; everything on the
              downlink hangs off the right of the column, one column of labels rather than two
              sides to read. Each is a kind over a figure, and the bottleneck is a chip under its
              own figure rather than a third line of text inside it - three stacked lines read as
              clutter, not as emphasis. The drop and the relay never share a frame, so their
              labels can take the same side without ever meeting. */}
          {/* `md:left-[30%]` is the midpoint of the left crosslink span - keep it in step with
              SAT_X. On a phone the plot is only ~226px and the band takes 28px out of the middle
              of it, so a label centred under that span would run over the band: below md it goes
              flush left instead, still under its own span and still clear of the column. */}
          <LinkLabel
            kind={rates.crosslinkKind}
            rate={rates.crosslink}
            kindColor={LASER_LABEL}
            rateColor={LASER_TEXT}
            className="max-w-[calc(50%-22px)] md:max-w-none text-left md:text-center left-2 md:left-[30%] md:-translate-x-1/2"
            style={{ top: `${LEO_Y + 5}%` }}
          />
          <LinkLabel
            kind={rates.directKind}
            rate={rates.direct}
            kindColor={WEAK_LABEL}
            rateColor={WEAK}
            className="max-w-[calc(50%-28px)] md:max-w-none text-center top-[31%] left-[calc(50%+28px)] md:left-[calc(50%+44px)]"
            style={{ opacity: direct }}
          />
          <LinkLabel
            kind={rates.laserKind}
            rate={rates.laser}
            kindColor={LASER_LABEL}
            rateColor={LASER_TEXT}
            className="max-w-[calc(50%-22px)] md:max-w-none text-center break-words top-[23%] min-[360px]:top-[27%] md:top-[29%] left-[calc(50%+22px)] md:left-[calc(50%+26px)]"
            style={{ opacity: relay }}
          />

          {/* The bottleneck itself, tagged onto the link it describes: under the figure it
              qualifies, beside the dashed line it is about. A chip carries the weight a third
              line of type could not. */}
          <div
            className={cx(
              'absolute top-[52%] left-[calc(50%+22px)] md:left-[calc(50%+28px)] md:max-w-none transition-opacity duration-500',
              language === 'ko' ? 'max-w-[calc(50%-22px)]' : 'max-w-[calc(50%-16px)]',
            )}
            style={{ opacity: direct }}
          >
            <span
              className={cx(
                'inline-flex max-w-full items-center rounded-2xl md:rounded-full border px-1.5 min-[360px]:px-2 py-1 md:px-3.5 md:py-1.5 font-semibold uppercase',
                language === 'ko'
                  ? 'text-[11px] md:text-sm tracking-normal md:tracking-[0.03em] text-center'
                  : 'text-[7px] min-[360px]:text-[8px] md:text-[10px] tracking-[0.08em] min-[360px]:tracking-[0.18em] md:tracking-[0.24em]',
              )}
              style={{
                borderColor: 'rgba(217,164,65,.5)',
                background: 'rgba(28,18,4,.82)',
                color: '#f2c877',
                boxShadow: '0 0 24px rgba(217,164,65,.22)',
              }}
            >
              {/* on a phone there is not 150px of clear frame beside the band, so it wraps */}
              <span className="min-w-0 max-w-[4.5rem] md:max-w-none leading-tight break-words">{rates.bottleneck}</span>
            </span>
          </div>
          <div
            className="absolute w-max max-w-[calc(50%-20px)] min-[360px]:max-w-[calc(50%-18px)] md:max-w-[17rem] text-center leading-tight left-[calc(50%+26px)] min-[360px]:left-[calc(50%+30px)] md:left-[calc(50%+44px)] top-[calc(52%+8px)] min-[360px]:top-[calc(53%+8px)] md:top-[calc(53%+12px)] transition-opacity duration-500"
            style={{ opacity: relay }}
          >
            <div className={cx(
              'font-bold md:uppercase leading-tight break-words',
              language === 'ko'
                ? 'text-[11px] md:text-sm tracking-normal md:tracking-[0.03em]'
                : 'text-[7.5px] min-[360px]:text-[10px] md:text-xs tracking-[0.01em] md:tracking-[0.16em]',
            )} style={{ color: ICE }}>
              {rates.relayKind ?? copy.rates.relayKind}
            </div>
            <div className="mt-0.5 text-[13px] md:text-base font-bold tracking-tight tabular-nums" style={{ color: RADIO }}>{rates.relay}</div>
            <div
              className={cx(
                'mt-1 inline-flex max-w-full items-center justify-center rounded-2xl md:rounded-full border px-0.5 min-[360px]:px-1.5 md:px-3.5 py-1 font-bold leading-tight',
                language === 'ko' ? 'text-[11px] md:text-[13px]' : 'text-[7px] min-[360px]:text-[9px] md:text-[11px]',
              )}
              style={{
                borderColor: 'rgba(74,168,224,.55)',
                background: 'rgba(4,20,36,.88)',
                color: ICE,
                boxShadow: '0 0 24px rgba(74,168,224,.18)',
              }}
            >
              {rates.relayGain ?? copy.rates.relayGain}
            </div>
          </div>

          <div
            className="absolute left-1 md:left-[12%] top-[62%] max-w-[40%] transition-opacity duration-500"
            style={{ opacity: serviceLinks }}
          >
            <div className={cx(
              'font-bold uppercase text-ice',
              language === 'ko'
                ? 'text-[11px] md:text-sm tracking-normal md:tracking-[0.03em]'
                : 'text-[8px] md:text-[11px] tracking-[0.08em] md:tracking-[0.16em]',
            )}>{copy.directToCell}</div>
          </div>

          {/* marks */}
          {SAT_X.map((x) => (
            <span key={x} className="absolute" style={{ left: `${x}%`, top: `${LEO_Y}%`, transform: 'translate(-50%, -50%)' }}>
              <SatelliteNode />
            </span>
          ))}
          {SERVICE_GROUPS.map(({ label, x, nodes }) => (
            <div
              key={label}
              role="img"
              aria-label={`${copy.services[label]}: ${copy.serviceDescription}`}
              aria-hidden={serviceLinks === 0}
              className="transition-opacity duration-500"
              style={{ opacity: serviceLinks }}
            >
              {nodes.map(({ kind, x: nodeX, y }) => (
                <span
                  key={kind}
                  className="absolute"
                  style={{ left: `${nodeX}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <ServiceEndpoint kind={kind} />
                </span>
              ))}
              <GroundCaption x={x}>{copy.services[label]}</GroundCaption>
            </div>
          ))}
          <div
            role="img"
            aria-label={rowLabels.groundStation}
          >
            <span
              className="absolute"
              style={{ left: `${LINK_X}%`, top: `${GROUND_Y}%`, transform: 'translate(-50%, -100%)' }}
            >
              <GroundStation />
            </span>
            <GroundCaption x={LINK_X}>{rowLabels.groundStation}</GroundCaption>
          </div>

          {/* The airship enters from the right, as the wireframe asks - from a third of the way
              out, where the wireframe's entry arrow starts, not from off the frame - and settles
              on the empty layer. A short trail keeps the direction of travel readable. */}
          <div
            className="absolute"
            style={{
              left: `calc(${LINK_X}% + ${(1 - airshipIn) * AIRSHIP_FROM}%)`,
              top: `${STRATO_Y}%`,
              transform: 'translate(-50%, -50%)',
              opacity: Math.min(1, airshipIn * 3),
            }}
          >
            <div
              className="absolute top-1/2 left-full h-px w-32 md:w-56"
              style={{
                background: 'linear-gradient(to right, rgba(143,216,255,.75), transparent)',
                // driven by the raw travel, not the eased position: the eased value is already
                // past 0.8 halfway across, which would blink the wake out before anyone saw it
                opacity: 1 - airshipTravel,
              }}
            />
            {airshipSrc ? (
              <img
                src={airshipSrc}
                alt={copy.airship}
                className="relative w-24 md:w-40 h-auto object-contain will-change-transform"
              />
            ) : <AirshipNode />}
          </div>
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
