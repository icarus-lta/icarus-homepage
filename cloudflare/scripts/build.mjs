import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(directory, '..');
execFileSync('npm', ['run', 'build', '--prefix', 'design-system'], { cwd: root, stdio: 'inherit' });
execFileSync(process.execPath, ['.design-sync/build-preview.mjs'], { cwd: root, stdio: 'inherit' });
const output = join(directory, 'public');
// Fixed generated directory only, never source files.
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
// Publish only actual website routes/assets, excluding local layout experiments.
for (const name of ['index.html', '_ds_bundle.js', 'styles.css', 'fonts', 'media', 'about', 'news', 'career', 'contact']) {
  cpSync(join(root, '.design-sync/.cache/preview', name), join(output, name), { recursive: true });
}
const home = join(output, 'index.html');
writeFileSync(home, readFileSync(home, 'utf8').replace('ICARUS — homepage preview', 'ICARUS LTA | 이카루스'));
mkdirSync(join(directory, 'generated'), { recursive: true });
cpSync(join(root, '.design-sync/.cache/career-roles.json'), join(directory, 'generated/roles.json'));
writeFileSync(join(directory, 'generated/media.json'), JSON.stringify(Object.fromEntries(
  readdirSync(join(output, 'media')).filter(name => name.endsWith('.mp4')).map(name => [`/media/${name}`, statSync(join(output, 'media', name)).size]),
)));
writeFileSync(join(output, '404.html'), '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>페이지를 찾을 수 없습니다 — ICARUS</title><body><h1>페이지를 찾을 수 없습니다.</h1><p>Page not found.</p><a href="/">ICARUS 홈으로</a></body></html>');
writeFileSync(join(output, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Cache-Control: public, max-age=0, must-revalidate\n');
const files = [];
function scan(path) {
  for (const name of readdirSync(path)) {
    const file = join(path, name);
    if (statSync(file).isDirectory()) scan(file);
    else {
      if (name.startsWith('.') || /\.(?:py|sql|env|pem|key)$/.test(name)) throw new Error(`Private file in public output: ${name}`);
      if (statSync(file).size > 25 * 1024 * 1024) throw new Error(`Asset exceeds Cloudflare's 25 MiB limit: ${name}`);
      files.push(file);
    }
  }
}
scan(output);
if (files.length > 20000) throw new Error('Asset count exceeds the free plan.');
console.log(`Cloudflare build: ${files.length} public assets, all <=25 MiB. Private files excluded.`);
