// Dev-only: rebuilds an IIFE bundle from design-system/dist straight into a scratch dir
// (never touches ds-bundle/_screenshots) and screenshots AltitudeScrollSection at a list of
// frozen progress values, stacked in one PNG.
// usage: node .design-sync/render-anim.mjs <WxH> <out.png> [p1,p2,...] [Component]
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { bundleToIife } from '../.ds-sync/lib/bundle.mjs';

const require = createRequire('/root/icarus-homepage/.ds-sync/');
const { chromium } = require('playwright');

const REPO = '/root/icarus-homepage';
const OUT = `${REPO}/.design-sync/.cache/dev`;
mkdirSync(OUT, { recursive: true });

const [sizeArg = '1280x760', outArg = '/tmp/anim.png', psArg = '0,0.5,1', comp = 'AltitudeScrollSection'] =
  process.argv.slice(2);
const [width, height] = sizeArg.split('x').map(Number);
const ps = psArg.split(',').map(Number);

await bundleToIife({
  entry: `${REPO}/design-system/dist/index.js`,
  globalName: 'IcarusDS',
  nodePaths: `${REPO}/design-system/node_modules`,
  out: OUT,
  tsconfig: null,
});

const page_html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/styles.css">
<script src="/_vendor/react.js"></script><script src="/_vendor/react-dom.js"></script>
<script src="/_ds_bundle.js"></script></head>
<body><div id="root"></div><script>
const D = window.IcarusDS, h = React.createElement;
const ps = ${JSON.stringify(ps)};
const page = h('div', { className: 'overflow-x-clip' },
  ps.map((p, i) => h('div', { key: i, style: { position: 'relative' } },
    h('div', { style: { position:'absolute', zIndex: 50, left: '8px', top: '8px', font: '700 13px monospace', color: '#8fd8ff', background:'#000', padding:'2px 6px' } }, 'p=' + p),
    h(D['${comp}'], { progress: p }))));
ReactDOM.createRoot(document.getElementById('root')).render(page);
</script></body></html>`;

const ROOTS = [OUT, `${REPO}/design-system/dist`, `${REPO}/ds-bundle`];
const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const path = req.url.split('?')[0];
  if (path === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page_html); }
  for (const r of ROOTS) {
    try {
      const body = await readFile(join(r, path));
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
      return res.end(body);
    } catch { /* next root */ }
  }
  res.writeHead(404).end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.screenshot({ path: outArg, fullPage: true });
console.log(errors.length ? `page errors: ${errors.join('\n')}` : 'no page errors', '->', outArg);
await browser.close();
server.close();
