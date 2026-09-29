// Prepare a presentation copy of the supplied CFD animation; the source GIF is unchanged.
// Requires ffmpeg. Run from any directory: node .design-sync/build-cfd-clean.mjs
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const media = join(root, 'static/about');
const film = join(media, 'about-cfd-clean.mp4');

// The legend ends before x=200; the airship starts beyond x=230 throughout this fixed view.
// A stronger white key removes the pale streamlines that became noisy in the old dark copy.
// Open and soften only the alpha plane, leaving the simulation's RGB colors untouched.
// Move the remaining subject 74px left to center it, without scaling or clipping the airship.
const filters = [
  '[1:v]fps=20,format=rgba,drawbox=x=0:y=0:w=200:h=ih:color=white:t=fill',
  'colorkey=0xFFFFFF:0.30:0.08,format=gbrap',
  'erosion=threshold0=0:threshold1=0:threshold2=0',
  'dilation=threshold0=0:threshold1=0:threshold2=0',
  'gblur=sigma=0.5:planes=8[foreground]',
].join(',') + ';[0:v][foreground]overlay=x=-74:y=0:shortest=1:format=auto,format=yuv420p[out]';

execFileSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 'lavfi', '-i', 'color=c=0x060a10:s=800x450:r=20:d=15',
  '-i', join(media, 'about-cfd.gif'),
  '-filter_complex_threads', '2', '-filter_complex', filters,
  '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
  '-movflags', '+faststart', film,
], { stdio: 'inherit' });

execFileSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', film,
  '-frames:v', '1', '-c:v', 'libwebp', '-quality', '94', join(media, 'about-cfd-clean-poster.webp'),
], { stdio: 'inherit' });
console.log('Prepared full-color CFD film with no legend and cleaner flow edges.');
