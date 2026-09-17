// Renders the real homepage composition (the conventions.md page skeleton) at a real
// browser size and screenshots it, so hero framing and gutters can be judged at 16:9
// and at phone width instead of at preview-card size. Serves ./ds-bundle, so run the
// converter first. Not part of the sync pipeline - a local eyeball check.
// usage: node .design-sync/render-page.mjs 1920x1080 out.png [scrollY]
import { createRequire } from 'node:module';
import { writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const require = createRequire('/root/icarus-homepage/.ds-sync/');
const { chromium } = require('playwright');

const root = '/root/icarus-homepage/ds-bundle';
const [sizeArg = '1920x1080', outArg = '/root/icarus-homepage/.design-sync/.cache/page.png', scrollArg = '0'] =
  process.argv.slice(2);
const [width, height] = sizeArg.split('x').map(Number);

const page_html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/styles.css">
<script src="/_vendor/react.js"></script><script src="/_vendor/react-dom.js"></script>
<script src="/_ds_bundle.js"></script></head>
<body><div id="root"></div><script>
const D = window.IcarusDS, h = React.createElement;
const page = h('div', { className: 'overflow-x-clip' },
  h(D.SiteHeader), h(D.Hero),
  h(D.AltitudeScrollSection), h(D.EnduranceScrollSection),
  h(D.TechCards), h(D.MissionGrid), h(D.RoadmapTimeline), h(D.ContactCTA), h(D.SiteFooter));
ReactDOM.createRoot(document.getElementById('root')).render(page);
</script></body></html>`;

const MIME = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const path = req.url.split('?')[0];
  if (path === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(page_html);
  }
  try {
    const body = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
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
  await page.waitForTimeout(400);
}
await page.screenshot({ path: outArg });
console.log(errors.length ? `page errors: ${errors.join('\n')}` : 'no page errors', '->', outArg);
await browser.close();
server.close();
