import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useId, useState } from 'react';
import { content } from '../i18n/content';
import { useLanguage } from '../i18n/language';
import { images } from '../assets';
import { ramp, useScrollProgress } from '../hooks/useScrollProgress';
import { containerClass } from '../primitives/container';
import { Eyebrow } from '../primitives/Eyebrow';
import { cx } from '../utils';
import { COVERAGE, COVERAGE_RADIUS_KM, PENINSULA_PATH, PENINSULA_ISLANDS_PATH, ROK_PATH, ROK_ISLANDS_PATH } from './koreaCoverage';

export interface EnduranceScrollSectionProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** The five parts called out on the cutaway in scene 1, in the order they arrive. */
  parts?: Array<{ name: string; detail: string }>;
  /** Scene 2's region labels and the coverage-radius callout. */
  map?: {
    north: string;
    south: string;
    radius: string;
    radiusLabel?: string;
    /** Legacy label overrides retained for compatibility; these labels are no longer displayed. */
    radiusNote?: string;
    fleet?: string;
    fleetNote?: string;
    sameShip?: [string, string];
  };
  /**
   * Freeze the animation at a point from 0 to 1 instead of following the scroll.
   * Use it for static frames; leave it out on a real page.
   */
  progress?: number;
  /** The aircraft photographed for scene 1. Swap it when there is a newer shot. */
  airframeSrc?: string;
  /** Scroll distance the animation is spread over, as a CSS height. */
  trackHeight?: string;
  /** Extra classes appended to the <section>. */
  className?: string;
}

const ICE = '#8fd8ff';
// The aircraft from scene 1 lands on the middle-left station; the other five stay on the map.
const ARRIVAL_STATION = COVERAGE.find((station) => station.id === 'central-west')!;
const OTHER_STATIONS = COVERAGE.filter((station) => station.id !== ARRIVAL_STATION.id);
const COVERAGE_SEQUENCE = [ARRIVAL_STATION, ...OTHER_STATIONS];
/** Half the photographed aircraft's length, in the scene's own units. Nose at -x. */
const HALF_L = 112;

const MIST = '#d6e2f2';
const MIST_DIM = 'rgba(128,149,181,.72)';

/**
 * Both scenes share one viewBox, so the airframe can be a single object that simply moves from
 * the middle of the anatomy onto its own station on the map - which is the whole point of ANIM B.
 * There are two of them because one cannot serve a 2.3:1 frame and a 0.9:1 one: the drawing is
 * letterboxed to fit, so on a phone a 440-wide box would put every label at about 4px.
 */
const VB_H = 300;
const WIDE = { w: 440, shipY: 134, shipS: 1.18, mapS: 1.18 };
const NARROW = { w: 252, shipY: 130, shipS: 0.7, mapS: 1.12 };
type Layout = typeof WIDE;

/** The map's own space (the wireframe's `viewBox="14 0 134 230"`) placed into a layout. */
const mapTx = (L: Layout) => L.w / 2 - 74.5 * L.mapS;
// Include Jeju in the same geographic projection with room above and below the coastline.
const mapTy = (L: Layout) => VB_H / 2 - 117.5 * L.mapS;
const toStageX = (L: Layout, x: number) => mapTx(L) + x * L.mapS;
const toStageY = (L: Layout, y: number) => mapTy(L) + y * L.mapS;
/** Sized so the aircraft reads on the map without swamping a 100 km footprint. */
const MAP_LEN = 15;
const shipEndScale = (L: Layout) => ((MAP_LEN / 2) * L.mapS) / HALF_L;

/** Where a fitting sits on screen in scene 1, read straight off the photograph. */
const partAt = (L: Layout, lx: number, ly: number) => ({
  x: L.w / 2 + lx * L.shipS,
  y: L.shipY + ly * L.shipS,
});

/** Where each part label sits, where its leader leaves it, and the part it points at. */
const PART_LAYOUT: Array<{
  at: (L: Layout) => { x: number; y: number };
  anchor: 'start' | 'middle' | 'end';
  part: [number, number];
}> = [
  { at: () => ({ x: 18, y: 40 }), anchor: 'start', part: [-74, -6] },
  { at: (L) => ({ x: L.w - 18, y: 40 }), anchor: 'end', part: [16, -30] },
  { at: (L) => ({ x: L.w - 18, y: 226 }), anchor: 'end', part: [30, 12] },
  // halfway between the left edge and the centre, so it is neither in the corner nor under the
  // aircraft; centred on that point, because anchored left it ran into the propulsion callout
  { at: (L) => ({ x: (18 + L.w / 2) / 2, y: 226 }), anchor: 'middle', part: [0, 33] },
];


const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** Scale has to be interpolated in log space - 25x of it, linearly, stays huge almost to the end. */
const zoom = (a: number, b: number, t: number) => a * (b / a) ** t;
/** Decelerating, for things that only have to arrive. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;
/** Gentle at both ends - the airframe leaves scene 1 and settles onto its station, never slams. */
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Two layouts, chosen the same way the rest of the library chooses one: at the `md` breakpoint. */
function useWideLayout() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const q = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return wide;
}

/**
 * Scene 1 is the aircraft itself: `images.airframe`, the platform photographed nose-left.
 *
 * A photograph cannot survive being shrunk to fifteen units on a map - it turns to mush - so as
 * it comes down it hands over to a line pictogram of the same aircraft at the same angle. The five
 * already on station are that pictogram too, so all six read as one fleet. The photograph and
 * pictogram share one heading throughout the move.
 */
const PHOTO_W = 224;
const PHOTO_H = (224 * 429) / 1215;
/**
 * The heading that puts the nose north. The aircraft is drawn nose at -x - the propeller and the
 * fins are at +x, because they are the tail - and SVG's y runs down, so `rotate(90)` sends -x to
 * -y, which is up. The other way round points the tail north.
 *
 * The photograph makes this turn itself, and finishes it before it becomes the mark. A flat
 * `rotate()` alone would read as a picture being spun, so the swing is eased and carries a yaw
 * foreshortening with it - the body shortens along its own length through the middle of the
 * manoeuvre and comes back, the way a real aircraft does as its nose comes round.
 */
const HEADING_NORTH = 90;

/**
 * The mark the map carries: the lens-and-tail glyph the earlier passes used, in the photograph's
 * own units and facing the same way it does - nose at -x, the tail V beyond the end of the hull.
 * Its strokes are non-scaling, so it is still a line drawing at fifteen units across.
 */
function AirframeMark({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      <ellipse
        cx="0"
        cy="0"
        rx={HALF_L}
        ry={HALF_L * 0.309}
        fill="#17355c"
        stroke="#dbeeff"
        strokeOpacity=".9"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={`M107 0 L137 ${(-HALF_L * 0.289).toFixed(1)} M107 0 L137 ${(HALF_L * 0.289).toFixed(1)}`}
        fill="none"
        stroke="#dbeeff"
        strokeOpacity=".9"
        strokeWidth="0.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

function Airframe({ src, mark }: { src: string; mark: number }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx={HALF_L * 1.25} ry={HALF_L * 0.42} fill="url(#ds-af-halo)" opacity={1 - mark} />
      <image
        href={src}
        x={-PHOTO_W / 2}
        y={-PHOTO_H / 2}
        width={PHOTO_W}
        height={PHOTO_H}
        opacity={1 - mark}
        preserveAspectRatio="xMidYMid meet"
      />
      <AirframeMark opacity={mark} />
    </g>
  );
}

/** One of the other five on station: the same pictogram, the same angle, map-sized. */
function MapAirframe({ cx, cy, len }: { cx: number; cy: number; len: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${HEADING_NORTH}) scale(${len / 224})`}>
      <AirframeMark />
    </g>
  );
}

/** A bright tracing tip leads a solid coastline; its glow settles as the outline completes. */
function CoastlineTrace({
  d,
  progress,
  glowId,
  primary = false,
}: {
  d: string;
  progress: number;
  glowId: string;
  primary?: boolean;
}) {
  const tracing = 1 - ramp(progress, 0.86, 1);
  const line = {
    d,
    fill: 'none',
    pathLength: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    // Keep dash lengths in map space: non-scaling-stroke distorts normalized dashes on a scaled map.
    strokeDasharray: progress < 1 ? '1 1' : undefined,
    strokeDashoffset: 1 - progress,
  };

  return (
    <g opacity={progress > 0 ? 1 : 0}>
      <path
        {...line}
        stroke="#d4d4d4"
        strokeWidth={primary ? 2.4 : 1.8}
        opacity={0.12 + tracing * 0.36}
        filter={`url(#${glowId})`}
      />
      <path {...line} stroke={primary ? '#d4d4d4' : '#929292'} strokeWidth={primary ? 0.65 : 0.5} />
      <path
        {...line}
        stroke="#ffffff"
        strokeWidth={primary ? 1.1 : 0.9}
        strokeDasharray="0.055 1"
        strokeDashoffset={0.055 - progress}
        opacity={ramp(progress, 0, 0.06) * tracing}
      />
    </g>
  );
}

/**
 * SVG text does not wrap, so a detail line is folded here. `budget` is the widest line the layout
 * can take, in characters; 0 leaves the line whole. Two callouts share the foot of a phone frame
 * and there is only room for both if each of them folds.
 */
const isHangul = (character: string) => /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(character);
const textUnits = (text: string) => Array.from(text).reduce((width, character) => width + (isHangul(character) ? 1.9 : 1), 0);
const detailLines = (t: string, budget: number) => {
  if (!budget || textUnits(t) <= budget) return [t];
  const out: string[] = [];
  let line = '';
  for (const word of t.split(' ')) {
    if (line && textUnits(line + ' ' + word) > budget) {
      out.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) out.push(line);
  return out;
};

/**
 * A part of the aircraft: the name centred, a hairline under it, and what the part is below
 * that. No panel behind it - the four callouts sit clear of the aircraft, so the type carries on
 * the frame's own ground and a box only added weight.
 *
 * SVG has no layout, so the card is measured from the text: an advance-width estimate per
 * character at each size. It only has to be close - the padding absorbs the error - but it does
 * have to track the font sizes, so those live here beside it.
 */
const NAME_SIZE = 9;
const NAME_TRACK = 0.8;
const DETAIL_SIZE = 8;
const LINE_STEP = 11;
const PAD_X = 13;
const PAD_Y = 8.5;
const RULE_GAP = 6;
const MIN_W = 82;

function PartLabel({
  x,
  y,
  anchor,
  part,
  to,
  opacity,
  fold,
}: {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  part: { name: string; detail: string };
  /** The fitting this label points at, already in the scene's coordinates. */
  to: { x: number; y: number };
  opacity: number;
  /** Widest line this layout can take, in characters; 0 leaves the detail whole. */
  fold: number;
}) {
  const lines = detailLines(part.detail, fold);
  const nameW = Array.from(part.name).reduce((width, character) => width + NAME_SIZE * (isHangul(character) ? 1 : 0.62) + NAME_TRACK, 0);
  const detailW = Math.max(...lines.map(textUnits)) * (DETAIL_SIZE * 0.52);
  const textW = Math.max(nameW, detailW, MIN_W);
  const boxW = textW + PAD_X * 2;
  // the card hangs off the slot the same way the text used to, so the four stay where they were
  const boxX = anchor === 'start' ? x - PAD_X : anchor === 'end' ? x - textW - PAD_X : x - boxW / 2;
  const boxY = y - NAME_SIZE - PAD_Y + 1.5;

  const nameY = boxY + PAD_Y + NAME_SIZE - 1.5;
  const ruleY = nameY + RULE_GAP;
  const firstDetailY = ruleY + RULE_GAP + DETAIL_SIZE - 1.5;
  const boxH = firstDetailY + (lines.length - 1) * LINE_STEP + 2 + PAD_Y - boxY;
  const mid = boxX + boxW / 2;

  // the leader leaves the edge of the card that faces the fitting, from the point nearest to it
  const below = to.y > y;
  const leaderY = below ? boxY + boxH - PAD_Y + 3 : boxY + PAD_Y - 3;
  const leaderX = Math.min(Math.max(to.x, mid - textW / 2), mid + textW / 2);

  return (
    <g opacity={opacity}>
      <path
        d={`M${leaderX.toFixed(1)} ${leaderY.toFixed(1)} L${to.x.toFixed(1)} ${to.y.toFixed(1)}`}
        stroke={ICE}
        strokeOpacity=".6"
        strokeWidth="0.9"
        fill="none"
      />
      <text x={mid} y={nameY} textAnchor="middle" fontSize={NAME_SIZE} fontWeight="700" letterSpacing={NAME_TRACK} fill="#b9dcff">
        {part.name.toUpperCase()}
      </text>
      <path
        d={`M${(mid - textW / 2).toFixed(1)} ${ruleY.toFixed(1)} H${(mid + textW / 2).toFixed(1)}`}
        stroke={ICE}
        strokeOpacity=".45"
        strokeWidth="0.7"
      />
      {lines.map((line, i) => (
        <text key={line} x={mid} y={firstDetailY + i * LINE_STEP} textAnchor="middle" fontSize={DETAIL_SIZE} fontWeight="500" fill={MIST}>
          {line}
        </text>
      ))}
    </g>
  );
}

/**
 * ANIM B - wireframe 8c of the design project, "기체 해부 → 한반도 커버리지". **One airframe
 * carries two scenes.** Scene 1 is a three-quarter cutaway with five parts named in turn; the
 * labels then go, and the same object rotates to a plan view, shrinks and turns its nose north
 * while the peninsula draws underneath it; scene 2 expands the 100 km coverage footprints
 * and the airframe comes to rest at the middle-left station. `progress` freezes one frame.
 */
export function EnduranceScrollSection(props: EnduranceScrollSectionProps) {
  const { language } = useLanguage();
  const copy = content[language].endurance;
  const {
    id = 'endurance',
    eyebrow,
    title = copy.title,
    description = copy.description,
    parts = copy.parts,
    map = { north: copy.north, south: copy.south, radius: `${COVERAGE_RADIUS_KM}km`, radiusLabel: copy.radiusLabel },
    airframeSrc = images.airframe,
    progress,
    trackHeight = '340vh',
    className,
  } = props;
  const { ref, progress: p } = useScrollProgress({ frozen: progress });
  const L = useWideLayout() ? WIDE : NARROW;
  const coastGlowId = useId();

  // scene 1  (0.00-0.32)  the cutaway, five labels arriving in turn
  // bridge   (0.32-0.78)  the labels go, the peninsula draws in underneath, and the airframe
  //                       turns its nose north, shrinks and settles onto its station - all one
  //                       continuous move, so the ground it is arriving on is already there
  // scene 2  (0.72-0.98)  the footprints expand in turn; all reach full radius before 100%
  // close    (0.86-1.00)  they fill and the original airframe occupies the middle-left station
  const labelsIn = parts.map((_, i) => ramp(p, 0.05 + i * 0.045, 0.14 + i * 0.045));
  const labelsOut = ramp(p, 0.32, 0.42);
  const mapIn = ramp(p, 0.36, 0.46);
  const northCoastline = ramp(p, 0.38, 0.64);
  const southCoastline = ramp(p, 0.44, 0.7);
  const flyRaw = ramp(p, 0.42, 0.78);
  const fly = easeInOut(flyRaw);
  // heading and camera finish before the descent does, so the end of the move is a straight
  // settle onto the station rather than a turn and a shrink still fighting each other
  const turn = easeInOut(Math.min(1, flyRaw / 0.72));
  const fill = ramp(p, 0.86, 0.95);
  const closing = ramp(p, 0.9, 0.98);

  // The aircraft itself makes the turn - it swings its nose north while it is still the
  // photograph - and only once it is round and nearly map-sized does it thin out into the mark.
  const heading = easeInOut(ramp(fly, 0.42, 0.8));
  const markIn = ramp(fly, 0.84, 0.98);
  const yaw = 1 - Math.sin(heading * Math.PI) * 0.34;
  const ship = {
    x: lerp(L.w / 2, toStageX(L, ARRIVAL_STATION.cx), fly),
    y: lerp(L.shipY, toStageY(L, ARRIVAL_STATION.cy), fly),
    s: zoom(L.shipS, shipEndScale(L), fly),
    r: lerp(0, HEADING_NORTH, heading),
    yaw,
  };

  const scene = (
    <div className={containerClass}>
      {/* the heading introduces the scene, so it sits above the frame rather than beside it */}
      <div className="max-w-6xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        {description ? <p className="mt-4 text-lg md:text-xl text-mist leading-relaxed tracking-[-0.015em] xl:whitespace-nowrap">{description}</p> : null}
      </div>

      {/* The frame the scene plays inside. Its height is viewport-relative so heading plus frame
          always fit the sticky h-screen box, which clips whatever overflows. */}
      <div
        className="ds-endurance-frame mt-8 md:mt-10 relative w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-space-950 overflow-hidden h-[58vh] min-h-[400px] md:h-[68vh] md:min-h-[520px] md:max-h-[760px] shadow-2xl"
        style={{ '--closing': closing } as CSSProperties}
      >
        <div className="ds-stars absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(70% 62% at 50% 44%, rgba(28,63,125,.34), transparent 72%)' }}
        />
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07)' }} />

        {/* The labels live in the viewBox too: their leader lines have to stay attached to parts
            of the airframe, and the frame letterboxes the drawing, so a percentage in HTML would
            not land on the same place at two window sizes. */}
        <svg className="ds-endurance-diagram absolute inset-0 w-full" viewBox={`0 0 ${L.w} ${VB_H}`} aria-hidden="true">
          <defs>
            <filter id={coastGlowId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="1.15" />
            </filter>
            <linearGradient id="ds-af-hull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="22%" stopColor="#f4f8fd" />
              <stop offset="52%" stopColor="#dae5f2" />
              <stop offset="82%" stopColor="#95abc6" />
              <stop offset="100%" stopColor="#b5cce6" />
            </linearGradient>
            <linearGradient id="ds-af-panel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0e14" />
              <stop offset="55%" stopColor="#151d29" />
              <stop offset="100%" stopColor="#24384f" />
            </linearGradient>
            <linearGradient id="ds-af-crown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
              <stop offset="60%" stopColor="#f2f7fd" stopOpacity=".85" />
              <stop offset="100%" stopColor="#dae5f2" stopOpacity=".55" />
            </linearGradient>
            <radialGradient id="ds-af-gloss">
              <stop offset="0%" stopColor="#ffffff" stopOpacity=".8" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity=".28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ds-af-halo">
              <stop offset="55%" stopColor={ICE} stopOpacity=".2" />
              <stop offset="100%" stopColor={ICE} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* SCENE 2: the peninsula, then the footprints, in the wireframe's own map space */}
          <g transform={`translate(${mapTx(L)} ${mapTy(L)}) scale(${L.mapS})`} opacity={mapIn}>
            <path
              d={PENINSULA_PATH}
              fill="#171717"
              fillOpacity={0.25 + ramp(northCoastline, 0.35, 1) * 0.75}
            />
            <path
              d={ROK_PATH}
              fill="#292929"
              fillOpacity={0.25 + ramp(southCoastline, 0.35, 1) * 0.75}
            />
            <CoastlineTrace d={PENINSULA_PATH} progress={northCoastline} glowId={coastGlowId} />
            <CoastlineTrace d={ROK_PATH} progress={southCoastline} glowId={coastGlowId} primary />
            <path
              d={PENINSULA_ISLANDS_PATH}
              fill="#171717"
              stroke="#929292"
              strokeWidth=".28"
              strokeLinejoin="round"
              opacity={ramp(northCoastline, 0.55, 1)}
            />
            <path
              d={ROK_ISLANDS_PATH}
              fill="#292929"
              stroke="#d4d4d4"
              strokeWidth=".28"
              strokeLinejoin="round"
              opacity={ramp(southCoastline, 0.55, 1)}
            />

            {COVERAGE_SEQUENCE.map((c, i) => {
              // the footprints expand one after another, the airframe's own first
              const order = i / Math.max(1, COVERAGE_SEQUENCE.length - 1);
              const grow = easeOut(ramp(p, 0.72 + order * 0.16, 0.84 + order * 0.14));
              return (
                <g key={c.id} transform={`translate(${c.cx} ${c.cy}) scale(${grow}) translate(${-c.cx} ${-c.cy})`}>
                  <path
                    d={c.d}
                    fill={ICE}
                    fillOpacity={fill * 0.09}
                    stroke={ICE}
                    strokeOpacity=".7"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={fill > 0.5 ? undefined : '4 3'}
                  />
                </g>
              );
            })}

            {/* The middle-left station is occupied only by the aircraft that comes out of scene 1. */}
            {OTHER_STATIONS.map((c, i) => (
              <g key={c.id} opacity={ramp(p, 0.74 + i * 0.035, 0.8 + i * 0.035)}>
                <MapAirframe cx={c.cx} cy={c.cy} len={MAP_LEN} />
              </g>
            ))}
          </g>

          {/* THE AIRFRAME - one object, both scenes */}
          <g transform={`translate(${ship.x} ${ship.y}) rotate(${ship.r}) scale(${(ship.s * ship.yaw).toFixed(4)} ${ship.s.toFixed(4)})`}>
            <Airframe src={airframeSrc} mark={markIn} />
          </g>

          {/* SCENE 1: the five parts, arriving in turn and leaving together */}
          <g opacity={1 - labelsOut}>
            {PART_LAYOUT.map((slot, i) => {
              const at = slot.at(L);
              const to = partAt(L, slot.part[0], slot.part[1]);
              return (
                <PartLabel
                  key={parts[i].name}
                  x={at.x}
                  y={at.y}
                  anchor={slot.anchor}
                  part={parts[i]}
                  to={to}
                  opacity={labelsIn[i]}
                  fold={L.w < 300 ? 22 : 0}
                />
              );
            })}
          </g>

          {/* SCENE 2's own labels */}
          <g opacity={mapIn}>
            <text x={toStageX(L, 26)} y={toStageY(L, 46)} fontSize="6.8" letterSpacing="1" fill="#909090">
              {map.north}
            </text>
            <text x={toStageX(L, 16)} y={toStageY(L, 172)} fontSize="7.4" fontWeight="600" letterSpacing="1" fill="#cecece">
              {map.south}
            </text>
          </g>
          <g className="hidden md:block" opacity={closing}>
            <path
              d={`M90 ${toStageY(L, ARRIVAL_STATION.cy) + 3} L${toStageX(L, ARRIVAL_STATION.westX).toFixed(1)} ${toStageY(L, ARRIVAL_STATION.westY).toFixed(1)}`}
              stroke={ICE}
              strokeOpacity=".45"
              strokeWidth="0.9"
              fill="none"
              strokeDasharray="3 2"
            />
            <text x={18} y={toStageY(L, ARRIVAL_STATION.cy) - 5} fontSize="6.4" fontWeight="600" letterSpacing=".9" fill={ICE}>
              {(map.radiusLabel ?? copy.radiusLabel).toUpperCase()}
            </text>
            <text x={18} y={toStageY(L, ARRIVAL_STATION.cy) + 11} fontSize="12" fontWeight="700" fill="#d5efff">
              {map.radius}
            </text>
          </g>
        </svg>

        <div
          className="absolute left-4 top-4 md:hidden text-ice"
          style={{ opacity: closing, visibility: closing > 0 ? 'visible' : 'hidden' }}
          aria-hidden={closing === 0}
        >
          <p className="text-[9px] font-semibold tracking-widest uppercase">{map.radiusLabel ?? copy.radiusLabel}</p>
          <p className="mt-1 text-lg font-bold text-ice-100">{map.radius}</p>
        </div>

        {/* Shares the radius callout's progress, so the complete close also reverses on scroll. */}
        <div
          className="ds-endurance-capabilities"
          style={{ opacity: closing, visibility: closing > 0 ? 'visible' : 'hidden' }}
          aria-hidden={closing === 0}
        >
          <div className="ds-endurance-capability">
            <h3>{copy.capabilities.relay}</h3>
            <ul className="ds-endurance-metrics">
              {[copy.capabilities.cost, copy.capabilities.speed].map((metric) => (
                <li key={metric.emphasis}>
                  <strong>{metric.emphasis}</strong>{' '}
                  <span>{metric.comparison}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-endurance-capability">
            <h3>{copy.capabilities.observation}</h3>
            <p className="ds-endurance-realtime">{copy.capabilities.realtime}</p>
            <ul className="ds-endurance-applications">
              {copy.capabilities.applications.map((application) => <li key={application}>{application}</li>)}
            </ul>
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
