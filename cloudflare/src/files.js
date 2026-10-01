import { FormError, requireThat } from './core.js';
export const objectKey = (id, slot, nonce) => `sessions/${id}/${slot}/${nonce}`;
export const mimeType = () => 'application/pdf';
export async function validateStoredFile(bucket, key, file) {
  requireThat(file.extension === 'pdf', 'invalid_file');
  const head = await bucket.head(key);
  requireThat(head, 'upload_pending', 503);
  requireThat(head.size === file.size, 'invalid_file');
  const object = await bucket.get(key, { range: { offset: 0, length: Math.min(5, file.size) } });
  requireThat(object, 'upload_pending', 503);
  requireThat(new TextDecoder().decode(await object.arrayBuffer()) === '%PDF-', 'invalid_file');
}
export async function streamUpload(request, bucket, key, file, expires) {
  requireThat(request.body && request.headers.get('Content-Type') === 'application/octet-stream', 'invalid_content_type', 415);
  const size = request.headers.get('Content-Length');
  requireThat(size === null || (/^\d+$/.test(size) && Number(size) === file.size), 'file_too_large', 413);
  // Never read a new key before writing: KV caches missing reads, too.
  // Native byte streams avoid buffering or Base64-encoding a 10 MiB PDF in JS.
  const fixed = new FixedLengthStream(file.size);
  const transfer = request.body.pipeTo(fixed.writable);
  const put = bucket.put(key, fixed.readable, { size: file.size, expires });
  try { await Promise.all([transfer, put]); }
  catch { throw new FormError('upload_failed', 502); }
}
