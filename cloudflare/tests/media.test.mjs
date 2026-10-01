import assert from 'node:assert/strict';
import { test } from 'node:test';
import { serveVideo } from '../src/media.js';
const bytes = Uint8Array.from({ length: 4096 }, (_, i) => i % 251);
const assets = { fetch: async () => new Response(bytes, { headers: { 'Content-Type': 'video/mp4', 'Content-Length': '4096', ETag: '"video-v1"' } }) };
test('video byte ranges support first/last/suffix/open-ended bytes and invalid ranges', async () => {
  for (const [range, start, end] of [['bytes=0-1023', 0, 1024], ['bytes=4000-', 4000, 4096], ['bytes=-128', 3968, 4096], ['bytes=4095-5000', 4095, 4096]]) {
    const response = await serveVideo(new Request('https://example.com/media/video.mp4', { headers: { Range: range } }), assets);
    assert.equal(response.status, 206); assert.equal(response.headers.get('Content-Length'), String(end - start));
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.subarray(start, end));
  }
  for (const range of ['bytes=5000-', 'bytes=200-100', 'bytes=-0']) {
    const response = await serveVideo(new Request('https://example.com/media/video.mp4', { headers: { Range: range } }), assets);
    assert.equal(response.status, 416); assert.equal(response.headers.get('Content-Range'), 'bytes */4096');
  }
});
test('mismatched If-Range returns the current complete video', async () => {
  const response = await serveVideo(new Request('https://example.com/media/video.mp4', { headers: { Range: 'bytes=0-10', 'If-Range': '"old"' } }), assets);
  assert.equal(response.status, 200); assert.equal((await response.arrayBuffer()).byteLength, 4096);
});
