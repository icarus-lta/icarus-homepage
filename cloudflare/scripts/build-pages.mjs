import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const cloudflareDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [resolve(cloudflareDirectory, 'scripts/build.mjs')], {
  cwd: resolve(cloudflareDirectory, '..'),
  stdio: 'inherit',
});

// Pages advanced mode uses the same API implementation and ASSETS binding as
// the Worker. Keep a single backend, with no public copy of its source files.
await build({
  entryPoints: [resolve(cloudflareDirectory, 'src/worker.js')],
  outfile: resolve(cloudflareDirectory, 'public/_worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
});

// Static files bypass the Function. API calls and video range requests use it.
writeFileSync(resolve(cloudflareDirectory, 'public/_routes.json'), JSON.stringify({
  version: 1,
  include: ['/api/*', '/media/*.mp4'],
  exclude: [],
}));
