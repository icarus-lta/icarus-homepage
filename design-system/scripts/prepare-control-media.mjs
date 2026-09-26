// Usage: node design-system/scripts/prepare-control-media.mjs /path/to/Airship_Station_Keeping_v20.gif
// Requires ffmpeg. Preserve the full animation, timing and dashboard; color treatment lives in CSS.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Pass the source station-keeping GIF path.');
const folder = fileURLToPath(new URL('../../static/about/', import.meta.url));
mkdirSync(folder, { recursive: true });
const video = join(folder, 'about-control.mp4');
const poster = join(folder, 'about-control-poster.webp');
const run = args => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
run(['-i', resolve(source), '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', video]);
run(['-i', video, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '94', poster]);
for (const file of [video, poster]) console.log(`${file}: ${(statSync(file).size / 1024 / 1024).toFixed(2)} MB`);
