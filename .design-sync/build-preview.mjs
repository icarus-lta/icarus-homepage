// Builds a self-contained static preview of the live design system into
// .design-sync/.cache/preview/, ready for any static server. Bundles straight from
// design-system/dist (never touches ds-bundle/_screenshots).
//   /          the real homepage skeleton, scroll-driven
//   /anim.html either scroll section on a progress slider, for checking single frames
import { mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { bundleToIife } from '../.ds-sync/lib/bundle.mjs';

const REPO = '/root/icarus-homepage';
const OUT = `${REPO}/.design-sync/.cache/preview`;
mkdirSync(join(OUT, '_vendor'), { recursive: true });

await bundleToIife({
  entry: `${REPO}/design-system/dist/index.js`,
  globalName: 'IcarusDS',
  nodePaths: `${REPO}/design-system/node_modules`,
  out: OUT,
  tsconfig: null,
});

copyFileSync(`${REPO}/design-system/dist/styles.css`, join(OUT, 'styles.css'));
for (const f of readdirSync(`${REPO}/ds-bundle/_vendor`)) {
  copyFileSync(`${REPO}/ds-bundle/_vendor/${f}`, join(OUT, '_vendor', f));
}

const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/styles.css">
<script src="/_vendor/react.js"></script><script src="/_vendor/react-dom.js"></script>
<script src="/_ds_bundle.js"></script>`;

// The page skeleton conventions.md defines - the five homepage sections, nothing else.
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><html lang="en"><head>${head}<title>ICARUS — homepage preview</title>
<style>a.jump{position:fixed;z-index:60;right:16px;bottom:16px;padding:8px 14px;border-radius:999px;
background:#8fd8ff;color:#02030a;font:600 13px system-ui;text-decoration:none}</style></head>
<body><div id="root"></div><a class="jump" href="/anim.html">Scroll frames &rarr;</a><script>
const D = window.IcarusDS, h = React.createElement;
ReactDOM.createRoot(document.getElementById('root')).render(
  h('div', { className: 'overflow-x-clip' },
    h(D.SiteHeader), h(D.Hero),
    h(D.AltitudeScrollSection), h(D.EnduranceScrollSection),
    h(D.RoadmapTimeline), h(D.ContactCTA), h(D.SiteFooter)));
</script></body></html>`,
);

// A frozen-frame rig: the same component, driven by a slider instead of the scroll.
writeFileSync(
  join(OUT, 'anim.html'),
  `<!doctype html><html lang="en"><head>${head}<title>Scroll frames</title>
<style>body{margin:0;background:#02030a}
.bar{position:fixed;z-index:60;inset:auto 0 0 0;display:flex;flex-wrap:wrap;gap:14px;align-items:center;
padding:12px 18px;background:rgba(2,3,10,.92);border-top:1px solid rgba(255,255,255,.12);
font:13px ui-monospace,monospace;color:#b9c9e2}
.bar input[type=range]{flex:1;min-width:80px;accent-color:#8fd8ff}
.bar b{color:#8fd8ff;min-width:4.5em}
.bar a{color:#8fd8ff}
.bar button,.bar select{background:#0e2a5e;color:#eef6ff;border:1px solid rgba(143,216,255,.4);
border-radius:6px;padding:4px 10px;font:12px ui-monospace,monospace;cursor:pointer}
#steps{display:flex;flex-wrap:wrap;gap:6px}
#stage{padding-bottom:96px}</style></head>
<body><div id="stage"></div>
<div class="bar">
  <a href="/">&larr; page</a>
  <select id="scene"><option value="A">ANIM A</option><option value="B">ANIM B</option></select>
  <input id="p" type="range" min="0" max="1" step="0.01" value="0">
  <b id="v">0.00</b>
  <span id="steps"></span>
</div><script>
const D = window.IcarusDS, h = React.createElement;
const root = ReactDOM.createRoot(document.getElementById('stage'));
const slider = document.getElementById('p'), out = document.getElementById('v');
const steps = document.getElementById('steps');
// The scroll milestones each wireframe calls out, as one-click jumps.
const SCENES = {
  A: {
    comp: 'AltitudeScrollSection',
    marks: [['0% bottleneck', 0], ['50% relay', 0.5], ['100% direct to cell', 1]],
  },
  B: {
    comp: 'EnduranceScrollSection',
    marks: [['anatomy', 0.3], ['turning', 0.55], ['coverage', 0.78], ['fleet', 1]],
  },
};
let scene = 'A';
const draw = () => {
  out.textContent = Number(slider.value).toFixed(2);
  root.render(h(D[SCENES[scene].comp], { progress: Number(slider.value) }));
};
const buildMarks = () => {
  steps.textContent = '';
  for (const [label, v] of SCENES[scene].marks) {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = () => { slider.value = v; draw(); };
    steps.append(b, document.createTextNode(' '));
  }
};
document.getElementById('scene').addEventListener('change', (e) => {
  scene = e.target.value;
  slider.value = 0;
  buildMarks();
  draw();
});
slider.addEventListener('input', draw);
buildMarks();
draw();
</script></body></html>`,
);

console.log('preview ->', OUT);
