// ICARUS airframe, built as real geometry rather than drawn as flat shapes.
//
// Every earlier attempt was hand-authored 2D paths with guessed gradients, and it kept reading as
// a cartoon, because a gradient cannot know where the surface is facing. Here the hull is an
// actual body of revolution: it is meshed, put through a camera, shaded per quad from surface
// normals, and emitted as SVG polygons. The metal comes from an environment ramp sampled by each
// quad's reflected view ray, which is what puts a hard horizon line around a polished body and
// makes it wrap correctly over the curvature.
//
//   node .design-sync/airframe3d.mjs
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire('/root/icarus-homepage/.ds-sync/');
const { chromium } = require('playwright');

const REPO = '/root/icarus-homepage';
const OUT = `${REPO}/.design-sync/airframe`;
mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------- vector maths
const v3 = (x, y, z) => ({ x, y, z });
const sub = (a, b) => v3(a.x - b.x, a.y - b.y, a.z - b.z);
const cross = (a, b) => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const norm = (a) => {
  const l = Math.hypot(a.x, a.y, a.z) || 1;
  return v3(a.x / l, a.y / l, a.z / l);
};
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const lerp = (a, b, t) => a + (b - a) * t;

// ---------------------------------------------------------------- the hull
// Proportions from the HAPS references: a broad lenticular body near 2.9:1, widest forward of
// centre, blunt nose, and girth held most of the way aft before it rounds off.
const HALF_L = 112;
const R_MAX = 38;
const radius = (s) => {
  if (s <= 0.36) {
    const t = s / 0.36;
    return Math.pow(Math.max(0, 1 - (1 - t) ** 2), 0.42);
  }
  const t = (s - 0.36) / 0.64;
  return Math.pow(Math.max(0, 1 - t ** 3), 0.5);
};
const axisX = (s) => -HALF_L + 2 * HALF_L * s;

// Solar arrays on the crown: bands in s, within a wedge either side of the top.
const PANELS = [
  { s0: 0.22, s1: 0.34, a0: -0.52, a1: -0.07 },
  { s0: 0.36, s1: 0.48, a0: -0.58, a1: -0.07 },
  { s0: 0.5, s1: 0.6, a0: -0.5, a1: -0.07 },
  { s0: 0.22, s1: 0.34, a0: 0.07, a1: 0.52 },
  { s0: 0.36, s1: 0.48, a0: 0.07, a1: 0.58 },
  { s0: 0.5, s1: 0.6, a0: 0.07, a1: 0.5 },
];
const onPanel = (s, a) => PANELS.some((p) => s >= p.s0 && s <= p.s1 && a >= p.a0 && a <= p.a1);

const NS = 64;
const NA = 76;
/** Surface point. `a` is the angle from the top, running around the body. */
const hullPoint = (s, a) => {
  const r = radius(s) * R_MAX;
  return v3(axisX(s), r * Math.cos(a), r * Math.sin(a));
};

// ---------------------------------------------------------------- camera
const rotY = (p, c, sn) => v3(p.x * c + p.z * sn, p.y, -p.x * sn + p.z * c);
const rotX = (p, c, sn) => v3(p.x, p.y * c - p.z * sn, p.y * sn + p.z * c);
const makeCamera = (azDeg, elDeg) => {
  const az = (azDeg * Math.PI) / 180;
  const el = (elDeg * Math.PI) / 180;
  const ca = Math.cos(az);
  const sa = Math.sin(az);
  const ce = Math.cos(el);
  const se = Math.sin(el);
  return (p) => rotX(rotY(p, ca, sa), ce, se);
};

// ---------------------------------------------------------------- shading
const hex = (c) => {
  const n = Math.max(0, Math.min(255, Math.round(c)));
  return n.toString(16).padStart(2, '0');
};
const rgb = (c) => `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
const parse = (h) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
});
const mix = (a, b, t) => ({ r: a.r + (b.r - a.r) * t, g: a.g + (b.g - a.g) * t, b: a.b + (b.b - a.b) * t });
/** Sample a stop list at t in [0,1]; stops are [position, hex] sorted ascending. */
const ramp = (stops, t) => {
  const x = clamp01(t);
  for (let i = 1; i < stops.length; i += 1) {
    if (x <= stops[i][0]) {
      const [p0, c0] = stops[i - 1];
      const [p1, c1] = stops[i];
      return mix(parse(c0), parse(c1), (x - p0) / (p1 - p0 || 1));
    }
  }
  return parse(stops[stops.length - 1][1]);
};

const LIGHT = norm(v3(-0.45, 0.72, 0.52));
const VIEW = v3(0, 0, 1);

const FINISHES = {
  // A polished skin: almost all of what you see is the world reflected in it. The hard step in
  // this ramp at t≈0.5 is the horizon, and it is the single thing that says "metal".
  mirror: {
    // Sceye's hull is a mirror: the lower half carries streaked bands of reflected cloud deck,
    // the upper half the dark stratospheric sky, and a hard line between them. The bands are what
    // stop it reading as a gradient.
    env: [
      [0.0, '#cdd9e6'],
      [0.09, '#eef3f9'],
      [0.19, '#8fa3b9'],
      [0.27, '#dae5f0'],
      [0.35, '#6a7e94'],
      [0.42, '#aec0d3'],
      [0.475, '#222e3c'],
      [0.52, '#f4f9ff'],
      [0.6, '#8ca2ba'],
      [0.72, '#4b627d'],
      [0.86, '#2a3e57'],
      [1.0, '#16273c'],
    ],
    envMix: 0.88,
    diffuse: '#c8d6e6',
    spec: 0.85,
    specPow: 46,
    rim: 0.3,
  },
  // The same body, but the reflection is blurred out into a soft satin sheen.
  satin: {
    env: [
      [0.0, '#8ea0b4'],
      [0.3, '#93a6bb'],
      [0.48, '#6e8397'],
      [0.56, '#d6e4f2'],
      [0.8, '#eaf2fa'],
      [1.0, '#96aabf'],
    ],
    envMix: 0.6,
    diffuse: '#dbe6f2',
    spec: 0.4,
    specPow: 22,
    rim: 0.34,
  },
  // Matte aerospace skin: form read from light alone, no reflection.
  matte: {
    env: [
      [0.0, '#9fb0c2'],
      [0.5, '#cbd7e4'],
      [1.0, '#f2f7fc'],
    ],
    envMix: 0.22,
    diffuse: '#eef4fa',
    spec: 0.14,
    specPow: 12,
    rim: 0.26,
  },
  // Near-black against the page, read by the rim alone.
  rim: {
    env: [
      [0.0, '#16273a'],
      [0.46, '#0b1522'],
      [0.54, '#31536f'],
      [1.0, '#12263c'],
    ],
    envMix: 0.75,
    diffuse: '#1d3349',
    spec: 0.5,
    specPow: 40,
    rim: 1.0,
  },
};

const PANEL_INK = { r: 14, g: 19, b: 27 };

const shade = (n, f, isPanel) => {
  const nv = clamp01(n.z);
  // the view ray reflected off this facet, used to look up the environment
  const rv = v3(2 * n.z * n.x, 2 * n.z * n.y, 2 * n.z * n.z - 1);
  const env = ramp(f.env, (rv.y + 1) / 2);
  const dif = clamp01(dot(n, LIGHT));

  if (isPanel) {
    // arrays are dark and only mildly glossy, so they hold their value across the curvature
    const base = mix(PANEL_INK, { r: 54, g: 74, b: 102 }, dif * 0.55);
    const l = norm(v3(2 * dot(n, LIGHT) * n.x - LIGHT.x, 2 * dot(n, LIGHT) * n.y - LIGHT.y, 2 * dot(n, LIGHT) * n.z - LIGHT.z));
    const sp = Math.pow(clamp01(dot(l, VIEW)), 30) * 0.5;
    return rgb(mix(base, { r: 226, g: 240, b: 255 }, sp));
  }

  const body = mix(parse(f.diffuse), { r: 255, g: 255, b: 255 }, dif * 0.35);
  let c = mix(body, env, f.envMix);
  const l = norm(v3(2 * dif * n.x - LIGHT.x, 2 * dif * n.y - LIGHT.y, 2 * dif * n.z - LIGHT.z));
  const sp = Math.pow(clamp01(dot(l, VIEW)), f.specPow) * f.spec;
  c = mix(c, { r: 255, g: 255, b: 255 }, sp);
  const fres = Math.pow(1 - nv, 3) * f.rim;
  c = mix(c, parse('#8fd8ff'), fres * 0.55);
  return rgb(c);
};

// ---------------------------------------------------------------- build one view
const buildHull = (cam, f) => {
  const faces = [];
  const backing = [];
  for (let i = 0; i < NS; i += 1) {
    const s0 = i / NS;
    const s1 = (i + 1) / NS;
    for (let j = 0; j < NA; j += 1) {
      const a0 = (j / NA) * Math.PI * 2 - Math.PI;
      const a1 = ((j + 1) / NA) * Math.PI * 2 - Math.PI;
      const p = [hullPoint(s0, a0), hullPoint(s1, a0), hullPoint(s1, a1), hullPoint(s0, a1)].map(cam);
      const n = norm(cross(sub(p[3], p[0]), sub(p[1], p[0])));
      if (n.z <= 0) {
        backing.push(`M${p.map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`);
        continue;
      }
      const sm = (s0 + s1) / 2;
      const am = (a0 + a1) / 2;
      const z = (p[0].z + p[1].z + p[2].z + p[3].z) / 4;
      faces.push({
        z,
        fill: shade(n, f, onPanel(sm, am)),
        d: `M${p.map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`,
      });
    }
  }
  return { faces, backing: backing.join('') };
};

/** The envelope's panel seams - gores down the length, rings across it - drawn only where the
 * skin faces the camera. Sceye's hull shows these as the faintest grid over the reflection. */
const buildSeams = (cam) => {
  const out = [];
  const facing = (sv, av) => {
    const e = 0.004;
    const q = [hullPoint(sv, av), hullPoint(sv + e, av), hullPoint(sv, av + e)].map(cam);
    return norm(cross(sub(q[2], q[0]), sub(q[1], q[0]))).z > 0.06;
  };
  for (let g = 0; g < 18; g += 1) {
    const a = (g / 18) * Math.PI * 2 - Math.PI;
    let run = [];
    for (let i = 0; i <= 80; i += 1) {
      const sv = i / 80;
      if (facing(sv, a)) {
        const q = cam(hullPoint(sv, a));
        run.push(`${q.x.toFixed(1)} ${(-q.y).toFixed(1)}`);
      } else if (run.length > 1) {
        out.push(`M${run.join('L')}`);
        run = [];
      } else run = [];
    }
    if (run.length > 1) out.push(`M${run.join('L')}`);
  }
  for (let r = 1; r < 13; r += 1) {
    const sv = r / 13;
    let run = [];
    for (let j = 0; j <= 72; j += 1) {
      const a = (j / 72) * Math.PI * 2 - Math.PI;
      if (facing(sv, a)) {
        const q = cam(hullPoint(sv, a));
        run.push(`${q.x.toFixed(1)} ${(-q.y).toFixed(1)}`);
      } else if (run.length > 1) {
        out.push(`M${run.join('L')}`);
        run = [];
      } else run = [];
    }
    if (run.length > 1) out.push(`M${run.join('L')}`);
  }
  return out.join('');
};

// Tail surfaces, sized like Sceye's rather than the big X-plates of the reference renders: flat
// panels on the tail cone, reaching about 40% of the hull radius past the skin.
const FIN_S0 = 0.7;
const FIN_S1 = 0.94;
const FIN_OUT = 17;
const FIN_ANGLES = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
const buildFins = (cam, f) => {
  const out = [];
  for (const a of FIN_ANGLES) {
    const root0 = hullPoint(FIN_S0, a);
    const root1 = hullPoint(FIN_S1, a);
    const dir = v3(0, Math.cos(a), Math.sin(a));
    const tip0 = v3(root0.x + 16, root0.y + dir.y * FIN_OUT, root0.z + dir.z * FIN_OUT);
    const tip1 = v3(root1.x + 6, root1.y + dir.y * (FIN_OUT * 0.55), root1.z + dir.z * (FIN_OUT * 0.55));
    const quad = [root0, tip0, tip1, root1].map(cam);
    const n = norm(cross(sub(quad[3], quad[0]), sub(quad[1], quad[0])));
    const facing = n.z >= 0;
    const nf = facing ? n : v3(-n.x, -n.y, -n.z);
    const lit = parse(shade(nf, f, false));
    // a fin edge-on to the camera is a sliver, and one on the far side is in its own shade
    const grazing = 1 - Math.abs(n.z);
    const c = mix(lit, parse(f.diffuse === '#1d3349' ? '#0c1726' : '#63768d'), facing ? grazing * 0.55 : 0.62);
    const z = (quad[0].z + quad[1].z + quad[2].z + quad[3].z) / 4;
    // the inboard third is a ribbed control section; the rest is a plain plate
    const ribs = [];
    for (let k = 1; k < 9; k += 1) {
      const t = k / 9;
      const r0 = v3(lerp(root0.x, root1.x, t), lerp(root0.y, root1.y, t), lerp(root0.z, root1.z, t));
      const t1 = v3(lerp(tip0.x, tip1.x, t), lerp(tip0.y, tip1.y, t), lerp(tip0.z, tip1.z, t));
      const m = v3(lerp(r0.x, t1.x, 0.55), lerp(r0.y, t1.y, 0.55), lerp(r0.z, t1.z, 0.55));
      const a2 = cam(r0);
      const b2 = cam(m);
      ribs.push(`M${a2.x.toFixed(1)} ${(-a2.y).toFixed(1)}L${b2.x.toFixed(1)} ${(-b2.y).toFixed(1)}`);
    }
    out.push({
      z,
      fill: rgb(c),
      stroke: facing ? 'rgba(20,32,48,.45)' : 'rgba(143,216,255,.16)',
      ribs: facing ? ribs.join('') : '',
      d: `M${quad.map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`,
    });
  }
  return out;
};

// Two small three-blade tractor props on stub pylons, the scale the references show.
// One unit only - the rear one is gone - carried on an open truss mast rather than a nacelle,
// which is the thing that most identifies Sceye's platform.
const PROPS = [{ s: 0.4, a: 1.32, r: 19, len: 36 }];
const buildProps = (cam) => {
  const out = [];
  for (const { s, a, r } of PROPS) {
    const len = 36;
    const root = hullPoint(s, a);
    const dir = v3(0, Math.cos(a), Math.sin(a));
    const out3 = (t, dx) => v3(root.x + dx, root.y + dir.y * len * t, root.z + dir.z * len * t);
    const hub = out3(1, -6);
    const c = cam(hub);
    // two rails and a zigzag between them, open the whole way - a mast, not a pod
    const rail = (dx) =>
      `M${[0, 1].map((t) => { const q = cam(out3(t, dx)); return `${q.x.toFixed(1)} ${(-q.y).toFixed(1)}`; }).join('L')}`;
    const zig = [];
    for (let k = 0; k < 5; k += 1) {
      const q0 = cam(out3(k / 5, k % 2 ? 7 : -7));
      const q1 = cam(out3((k + 1) / 5, k % 2 ? -7 : 7));
      zig.push(`M${q0.x.toFixed(1)} ${(-q0.y).toFixed(1)}L${q1.x.toFixed(1)} ${(-q1.y).toFixed(1)}`);
    }
    const mast = `${rail(-7)}${rail(7)}${zig.join('')}`;
    // the disc lies across the axis, so project a ring of points and let it become an ellipse
    const ring = (k) =>
      Array.from({ length: 33 }, (_, i) => {
        const t = (i / 32) * Math.PI * 2;
        return cam(v3(hub.x, hub.y + Math.cos(t) * r * k, hub.z + Math.sin(t) * r * k));
      });
    const blades = [0, 120, 240].map((deg) => {
      const t0 = ((deg + 12) * Math.PI) / 180;
      const pts = [];
      for (const [kr, wo] of [[0.12, 0.05], [0.55, 0.075], [0.9, 0.05], [1.0, 0.0], [0.9, -0.045], [0.55, -0.06], [0.12, -0.04]]) {
        const ang = t0 + wo;
        pts.push(cam(v3(hub.x - kr * 1.2, hub.y + Math.cos(ang) * r * kr, hub.z + Math.sin(ang) * r * kr)));
      }
      return `M${pts.map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`;
    });
    out.push({
      z: c.z + 40,
      mast,
      disc: `M${ring(1).map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`,
      blades,
      hub: cam(hub),
    });
  }
  return out;
};

// A shallow bay faired into the underside - no passenger gondola - with the payload looking down.
const buildBay = (cam) => {
  const s0 = 0.3;
  const s1 = 0.58;
  const ring = [];
  for (let i = 0; i <= 24; i += 1) {
    const s = s0 + ((s1 - s0) * i) / 24;
    ring.push(hullPoint(s, Math.PI));
  }
  const low = ring
    .slice()
    .reverse()
    .map((p, i, arr) => {
      const t = i / (arr.length - 1);
      const drop = Math.sin(Math.PI * t) * 17;
      return v3(p.x, p.y - drop, p.z);
    });
  const pts = [...ring, ...low].map(cam);
  const mid = cam(v3(axisX((s0 + s1) / 2), -radius((s0 + s1) / 2) * R_MAX - 9, 0));
  return {
    z: mid.z + 60,
    d: `M${pts.map((q) => `${q.x.toFixed(2)} ${(-q.y).toFixed(2)}`).join('L')}Z`,
    port: { x: mid.x, y: -mid.y },
  };
};

const renderSVG = (finishName, azDeg, elDeg, size = 520) => {
  const f = FINISHES[finishName];
  const cam = makeCamera(azDeg, elDeg);
  const hull = buildHull(cam, f);
  const faces = [...hull.faces, ...buildFins(cam, f)].sort((a, b) => a.z - b.z);
  const props = buildProps(cam);
  const bay = buildBay(cam);

  const ink = finishName === 'rim' ? '#8fd8ff' : '#2b3644';
  const skin = finishName === 'matte' ? '#e4ecf5' : finishName === 'rim' ? '#16283c' : '#aebdd0';

  const seams = `<path d="${buildSeams(cam)}" fill="none" stroke="#0f1a27" stroke-opacity=".16" stroke-width="0.45"/>`;
  const body = `<path d="${hull.backing}" fill="${finishName === 'rim' ? '#0a1421' : '#55687f'}"/>` + faces
    .map(
      (q) =>
        `<path d="${q.d}" fill="${q.fill}" stroke="${q.stroke ?? q.fill}" stroke-width="${q.stroke ? 0.5 : 0.35}"/>` +
        (q.ribs ? `<path d="${q.ribs}" fill="none" stroke="rgba(28,44,64,.5)" stroke-width="0.7"/>` : ''),
    )
    .join('');
  const under = `<path d="${bay.d}" fill="${finishName === 'rim' ? '#12233a' : '#8093a9'}" fill-opacity=".95"/>
    <rect x="${(bay.port.x - 19).toFixed(1)}" y="${(bay.port.y - 2).toFixed(1)}" width="15" height="5.6" rx="1.4" fill="#151d27"/>
    <rect x="${(bay.port.x - 1).toFixed(1)}" y="${(bay.port.y - 1.4).toFixed(1)}" width="12" height="4.6" rx="1.2" fill="#151d27"/>
    <rect x="${(bay.port.x - 17).toFixed(1)}" y="${(bay.port.y - 0.4).toFixed(1)}" width="11" height="1.5" rx="0.7" fill="#8fd8ff" fill-opacity=".45"/>`;
  const rotors = props
    .map(
      (p) => `<path d="${p.mast}" fill="none" stroke="#e8f0f9" stroke-opacity=".85" stroke-width="1.5" stroke-linecap="round"/>
      <path d="${p.disc}" fill="none" stroke="${ink}" stroke-opacity=".16" stroke-width="0.6"/>
      ${p.blades.map((b) => `<path d="${b}" fill="${ink}" fill-opacity=".92"/>`).join('')}
      <circle cx="${p.hub.x.toFixed(2)}" cy="${(-p.hub.y).toFixed(2)}" r="2.4" fill="${ink}"/>`,
    )
    .join('');

  const half = size / 2;
  return `<svg viewBox="${-half} ${-half * 0.62} ${size} ${size * 0.62}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="halo"><stop offset="52%" stop-color="#8fd8ff" stop-opacity=".16"/><stop offset="100%" stop-color="#8fd8ff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="0" cy="0" rx="${half * 0.82}" ry="${half * 0.4}" fill="url(#halo)"/>
    ${body}${seams}${under}${rotors}</svg>`;
};

// ---------------------------------------------------------------- page + PNGs
const VARIANTS = [
  ['mirror', 'Polished skin', 'Almost everything you see is the world reflected in the hull. The hard step across the flank is the horizon — the one thing that reads as metal rather than paint.'],
  ['satin', 'Satin metal', 'The same body with the reflection blurred out: still metal, but calmer, and it holds its shape against a dark page.'],
  ['matte', 'Matte aerospace', 'No reflection at all. The form is read from the light alone, the way a painted airframe reads.'],
  ['rim', 'Rim-lit', 'Near-black against the page, drawn by the ice rim along its edges and the lit payload bay.'],
];

const page = `<!doctype html><html><head><meta charset="utf-8"><title>ICARUS airframe</title>
<style>
 @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
 body{margin:0;background:#02030a;font-family:Pretendard,system-ui,sans-serif;color:#b9c9e2}
 .wrap{max-width:1180px;margin:0 auto;padding:40px 24px 64px}
 h1{font:700 26px/1.2 Pretendard;color:#fff;margin:0 0 6px}
 .sub{font-size:14px;color:#8095b5;margin:0 0 28px;max-width:74ch;line-height:1.6}
 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(500px,1fr));gap:22px}
 .tile{border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;background:#02030a}
 .art{background:radial-gradient(70% 62% at 50% 48%, rgba(28,63,125,.3), transparent 72%)}
 .art svg{display:block;width:100%;height:auto}
 .cap{padding:14px 18px 18px;border-top:1px solid rgba(255,255,255,.08)}
 .id{font:600 10px Pretendard;letter-spacing:.24em;color:#8fd8ff;text-transform:uppercase}
 .nm{font:600 17px Pretendard;color:#fff;margin:4px 0 5px}
 .ds{font-size:12.5px;line-height:1.55;color:#8095b5}
 .angles{margin:34px 0 10px;font:600 11px Pretendard;letter-spacing:.24em;color:#8fd8ff;text-transform:uppercase}
 .row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
 .row .art{border:1px solid rgba(255,255,255,.08);border-radius:12px}
 a{color:#8fd8ff}
</style></head><body><div class="wrap">
<h1>ICARUS airframe — rebuilt as geometry</h1>
<p class="sub">Not drawn: meshed. The hull is a body of revolution with the reference proportions (a broad
~2.9:1 lenticular body, widest forward of centre), put through a camera and shaded per facet from its own
surface normals. The metal comes from an environment ramp sampled by each facet's reflected view ray, which is
why the horizon line wraps around the body instead of lying across it. Same geometry, four finishes.
<a href="/anim.html">← scroll frames</a></p>
<div class="grid">
${VARIANTS.map(
  ([k, name, desc]) => `<div class="tile" id="v-${k}">
  <div class="art">${renderSVG(k, 27, 34)}</div>
  <div class="cap"><div class="id">${k}</div><div class="nm">${name}</div><div class="ds">${desc}</div></div>
</div>`,
).join('')}
</div>
<div class="angles">Same finish, other camera angles</div>
<div class="row">
  ${[[27, 34], [16, 24], [38, 46], [62, 18]].map(([a, e]) => `<div class="art">${renderSVG('mirror', a, e, 420)}</div>`).join('')}
</div>
</div></body></html>`;

writeFileSync(join(OUT, 'index.html'), page);
for (const [k] of VARIANTS) writeFileSync(join(OUT, `${k}.svg`), renderSVG(k, 27, 34));

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 1230, height: 1000 }, deviceScaleFactor: 2 });
const errs = [];
pg.on('pageerror', (e) => errs.push(String(e)));
await pg.setContent(page, { waitUntil: 'networkidle' });
await pg.waitForTimeout(400);
for (const [k] of VARIANTS) await pg.locator(`#v-${k}`).screenshot({ path: join(OUT, `${k}.png`) });
await pg.screenshot({ path: join(OUT, 'all.png'), fullPage: true });
console.log(errs.length ? `errors: ${errs.join(' | ')}` : 'ok', '->', OUT);
await browser.close();

// serve it next to the rest of the preview, or the link in the page 404s
const served = `${REPO}/.design-sync/.cache/preview/airframe`;
if (existsSync(`${REPO}/.design-sync/.cache/preview`)) {
  cpSync(OUT, served, { recursive: true });
  console.log('served at /airframe/');
} else {
  console.log('preview not built yet - run build-preview.mjs first');
}
