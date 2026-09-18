// Knocks the white studio background out of a product shot and trims it, so the subject can sit
// on the dark page. A flood fill from the border rather than a colour key: the airship's polished
// skin is full of near-white highlights, and keying on brightness alone punches holes through it.
//   node .design-sync/cutout.mjs <in.png> <out.png>
import { createRequire } from 'node:module';
const require = createRequire('/root/icarus-homepage/design-system/');
const sharp = require('sharp');

const [inPath, outPath] = process.argv.slice(2);
const img = sharp(inPath).ensureAlpha();
const { width: W, height: H } = await img.metadata();
const buf = await img.raw().toBuffer();

const LIT = 232; // anything this bright and this neutral is background, if it reaches the border
const isBg = (i) => {
  const r = buf[i];
  const g = buf[i + 1];
  const b = buf[i + 2];
  return r > LIT && g > LIT && b > LIT && Math.max(r, g, b) - Math.min(r, g, b) < 14;
};

const seen = new Uint8Array(W * H);
const q = [];
for (let x = 0; x < W; x += 1) {
  q.push(x, (H - 1) * W + x);
}
for (let y = 0; y < H; y += 1) {
  q.push(y * W, y * W + W - 1);
}
while (q.length) {
  const p = q.pop();
  if (seen[p] || !isBg(p * 4)) continue;
  seen[p] = 1;
  const x = p % W;
  const y = (p / W) | 0;
  if (x > 0) q.push(p - 1);
  if (x < W - 1) q.push(p + 1);
  if (y > 0) q.push(p - W);
  if (y < H - 1) q.push(p + W);
}

// hard cut first, then one pass of feathering so the edge is not a staircase
for (let p = 0; p < W * H; p += 1) buf[p * 4 + 3] = seen[p] ? 0 : 255;
const soft = Uint8Array.from({ length: W * H }, (_, p) => {
  if (buf[p * 4 + 3] === 0) return 0;
  const x = p % W;
  const y = (p / W) | 0;
  let open = 0;
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    if (buf[(ny * W + nx) * 4 + 3] === 0) open += 1;
  }
  return open ? 255 - open * 52 : 255;
});
for (let p = 0; p < W * H; p += 1) buf[p * 4 + 3] = soft[p];

await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .trim({ threshold: 1 })
  .toFile(outPath);
const out = await sharp(outPath).metadata();
console.log(`${W}x${H} -> ${out.width}x${out.height}`, outPath);
