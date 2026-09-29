// Builds a self-contained static preview of the live design system into
// .design-sync/.cache/preview/, ready for any static server. Bundles straight from
// design-system/dist (never touches ds-bundle/_screenshots).
//   /          the real homepage skeleton, scroll-driven
//   /about/    the bilingual company story, with the supplied flight film
//   /news/     bilingual company news with original-source links
//   /career/   bilingual recruitment posts and role introductions
//   /contact/  bilingual inquiry form and direct email
//   /anim.html either scroll section on a progress slider, for checking single frames
import { mkdirSync, copyFileSync, writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(join(REPO, 'design-system/package.json'));
const { build } = require('esbuild');
const OUT = `${REPO}/.design-sync/.cache/preview`;
// Public form endpoint only. Private delivery credentials never belong in the browser bundle.
const contactSubmitUrl = process.env.ICARUS_CONTACT_FORM_URL?.trim() || '/api/contact';
if (contactSubmitUrl && !/^https:\/\//.test(contactSubmitUrl) && !/^\/(?!\/)/.test(contactSubmitUrl)) {
  throw new Error('ICARUS_CONTACT_FORM_URL must be an HTTPS URL or a same-origin path.');
}
const contactProps = JSON.stringify(contactSubmitUrl ? { submitUrl: contactSubmitUrl } : {}).replace(/</g, '\\u003c');
mkdirSync(OUT, { recursive: true });

// The server validates against exactly the roles used by the current frontend.
const rolesModule = await build({
  entryPoints: [join(REPO, 'design-system/src/i18n/career.ts')],
  bundle: true, platform: 'node', format: 'esm', write: false,
});
const { careerRoles } = await import(`data:text/javascript;base64,${Buffer.from(rolesModule.outputFiles[0].text).toString('base64')}`);
writeFileSync(join(OUT, '..', 'career-roles.json'), JSON.stringify(Object.fromEntries(
  careerRoles.map(role => [role.id, { ko: role.ko.title, en: role.en.title }]),
), null, 2));

// One runtime from the lockfile, with no dependency on local design-tool caches.
// These globals also support the existing standalone review pages.
await build({
  stdin: {
    contents: `import * as React from 'react';
      import * as ReactDOM from 'react-dom';
      import * as ReactDOMClient from 'react-dom/client';
      import * as IcarusDS from './dist/index.js';
      window.React = React;
      window.ReactDOM = { ...ReactDOM, ...ReactDOMClient };
      window.IcarusDS = IcarusDS;`,
    resolveDir: join(REPO, 'design-system'),
    sourcefile: 'site-entry.js',
  },
  outfile: join(OUT, '_ds_bundle.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
});

// A slow external @import blocks the classic scripts and can leave a phone on a blank page.
// Keep all preview assets on the same server and let text render while local fonts load.
mkdirSync(join(OUT, 'fonts'), { recursive: true });
for (const f of readdirSync(join(REPO, 'static/fonts'))) {
  copyFileSync(join(REPO, 'static/fonts', f), join(OUT, 'fonts', f));
}
const previewStyles = readFileSync(`${REPO}/design-system/dist/styles.css`, 'utf8')
  .replace(/^@import url\("https:\/\/[^"\n]+"\);\s*$/gm, '');
writeFileSync(join(OUT, 'styles.css'), readFileSync(join(REPO, 'static/fonts/preview-fonts.css'), 'utf8') + '\n' + previewStyles);
copyFileSync(join(REPO, '.design-sync/connection-check.html'), join(OUT, 'connection-check.html'));
mkdirSync(join(OUT, 'media'), { recursive: true });
for (const f of ['about-flight.mp4', 'about-flight-poster.jpg', 'about-flight-team.jpg', 'about-field-team-source.png', 'about-cfd.mp4', 'about-cfd-poster.webp', 'about-cfd-dark.mp4', 'about-cfd-dark-poster.webp', 'about-cfd-clean.mp4', 'about-cfd-clean-poster.webp', 'about-control.mp4', 'about-control-poster.webp']) {
  copyFileSync(join(REPO, 'static', 'about', f), join(OUT, 'media', f));
}

const loadingRoot = (id = 'root') => `<div id="${id}"><div id="preview-status" role="status" style="padding:100px 24px;font:16px/1.8 system-ui,sans-serif">ICARUS LTA<br>페이지를 불러오는 중입니다… / Loading…</div></div>`;
const assetVersion = createHash('sha256').update(readFileSync(join(OUT, '_ds_bundle.js'))).update(readFileSync(join(OUT, 'styles.css'))).digest('hex').slice(0, 12);
const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;background:#02030a;color:#b9c9e2}</style>
<link rel="stylesheet" href="/styles.css?v=${assetVersion}">
<script defer src="/_ds_bundle.js?v=${assetVersion}"></script>
<script>window.addEventListener('DOMContentLoaded',function(){
  var language=new URLSearchParams(window.location.search).get('lang');
  if((language==='en'||language==='ko')&&window.IcarusDS) window.IcarusDS.setLanguage(language);
});</script>
<script>window.addEventListener('error',function(event){
  var status=document.getElementById('preview-status');
  if(status && (event.error || event.target.tagName==='SCRIPT')) status.textContent='페이지를 불러오지 못했습니다. 새로고침해 주세요. / Please reload the page.';
},true);</script>`;

// The page skeleton conventions.md defines - the five homepage sections, nothing else.
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><html lang="en"><head>${head}<title>ICARUS — homepage preview</title>
<style>a.jump{position:fixed;z-index:60;right:16px;bottom:16px;padding:8px 14px;border-radius:999px;
background:#8fd8ff;color:#02030a;font:600 13px system-ui;text-decoration:none}
@media(max-width:767px){a.jump{display:none}}</style></head>
<body>${loadingRoot()}<a class="jump" href="/anim.html">Scroll frames &rarr;</a><script>
window.addEventListener('DOMContentLoaded', () => {
const D = window.IcarusDS, h = React.createElement;
ReactDOM.createRoot(document.getElementById('root')).render(
  h('div', { className: 'overflow-x-clip' },
    h(D.SiteHeader, { activeHref: '/#hero' }), h(D.Hero),
    h(D.AltitudeScrollSection), h(D.EnduranceScrollSection),
    h(D.RoadmapTimeline), h(D.ContactCTA), h(D.SiteFooter)));
});
</script></body></html>`,
);

mkdirSync(join(OUT, 'about'), { recursive: true });
writeFileSync(
  join(OUT, 'about', 'index.html'),
  `<!doctype html><html lang="en"><head>${head}
<title>About ICARUS LTA — The making of ICARUS</title>
<meta name="description" content="The story of ICARUS: an overlooked possibility, a study of what came before, and a foundation in flight-control research.">
<meta property="og:title" content="About ICARUS LTA — The making of ICARUS">
<meta property="og:description" content="A question. An investigation. The decision to build. Discover the story behind ICARUS.">
<meta property="og:image" content="/media/about-flight-poster.jpg">
<meta property="og:type" content="website">
</head><body>${loadingRoot()}<script>
window.addEventListener('DOMContentLoaded', () => {
const D = window.IcarusDS, h = React.createElement;
ReactDOM.createRoot(document.getElementById('root')).render(
  h('div', { className: 'overflow-x-clip' },
    h(D.SiteHeader, { activeHref: '/about' }), h(D.AboutPage), h(D.SiteFooter, { credit: null })));
});
</script></body></html>`,
);

// Real subpages share the existing header, footer, and persisted language selection.
for (const page of [
  { path:'career', component:'CareerPage', title:'Careers — ICARUS LTA', description:'Explore engineering roles at ICARUS LTA.' },
  { path:'career/apply', component:'CareerApplicationPage', title:'Apply — ICARUS LTA', description:'Apply for an engineering role at ICARUS LTA.' },
  { path:'news', component:'NewsPage', title:'Newsroom — ICARUS LTA', description:'Company news, development updates and media coverage from ICARUS LTA.' },
  { path:'contact', component:'ContactPage', title:'Contact — ICARUS LTA', description:'Get in touch with ICARUS. Send us your email, subject, and inquiry.' },
]) {
  mkdirSync(join(OUT, page.path), { recursive:true });
  writeFileSync(join(OUT, page.path, 'index.html'), `<!doctype html><html lang="en"><head>${head}
<title>${page.title}</title>
<meta name="description" content="${page.description}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.description}">
<meta property="og:type" content="website">
</head><body>${loadingRoot()}<script>
window.addEventListener('DOMContentLoaded', () => {
const D = window.IcarusDS, h = React.createElement;
ReactDOM.createRoot(document.getElementById('root')).render(
  h('div', { className:'overflow-x-clip' },
    h(D.SiteHeader, { activeHref:'/${page.path.startsWith('career') ? 'career' : page.path}' }), h(D.${page.component}, ${page.path === 'contact' ? contactProps : '{}'}), h(D.SiteFooter, { credit:null })));
});
</script></body></html>`);
}

// Keep the previously shared design-review URL pointing to the current recruitment page.
mkdirSync(join(OUT, 'career-proposals'), { recursive:true });
writeFileSync(join(OUT, 'career-proposals', 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Careers — ICARUS LTA</title>
<script>var lang=new URLSearchParams(location.search).get('lang');location.replace('/career/'+(lang==='ko'||lang==='en'?'?lang='+lang:''));</script>
</head><body><a href="/career/">Careers / 채용 공고</a></body></html>`);

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
<body>${loadingRoot('stage')}
<div class="bar">
  <a href="/">&larr; page</a>
  <select id="scene"><option value="A">ANIM A</option><option value="B">ANIM B</option></select>
  <input id="p" type="range" min="0" max="1" step="0.01" value="0">
  <b id="v">0.00</b>
  <span id="steps"></span>
</div><script>
window.addEventListener('DOMContentLoaded', () => {
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
});
</script></body></html>`,
);

await import('./build-career-layouts.mjs');
await import('./build-career-intro.mjs');
await import('./build-career-process.mjs');
console.log('preview ->', OUT);
// Older design studies are optional local artifacts, absent from fresh clones.
if (['about-story.html', 'about-story.css', 'about-story-notes.html'].every(file => existsSync(join(REPO, 'output', file)))) {
  await import('./build-about-story-preview.mjs');
}
