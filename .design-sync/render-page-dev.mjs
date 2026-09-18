// Same page skeleton as render-page.mjs, but bundled straight from design-system/dist into a
// scratch dir, so the composition can be checked without re-running the converter (which wipes
// ds-bundle/_screenshots). usage: node .design-sync/render-page-dev.mjs <WxH> <out.png> [scrollY]
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

const [sizeArg = '1920x1080', outArg = `${REPO}/.design-sync/.cache/page.png`, scrollArg = '0'] = process.argv.slice(2);
const [width, height] = sizeArg.split('x').map(Number);

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
const page = h('div', { className: 'overflow-x-clip' },
  h(D.SiteHeader), h(D.Hero),
  h(D.AltitudeScrollSection), h(D.EnduranceScrollSection),
  h(D.RoadmapTimeline), h(D.ContactCTA), h(D.SiteFooter));
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
if (Number(scrollArg)) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollArg));
  await page.waitForTimeout(500);
}
await page.screenshot({ path: outArg });
console.log(errors.length ? `page errors: ${errors.join('\n')}` : 'no page errors', '->', outArg);
await browser.close();
server.close();
