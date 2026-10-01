// Static Assets may return the entire MP4 for Range requests. Stream a bounded
// slice for Safari/seeking without buffering the video or moving it into R2.
export async function serveVideo(request, assets, assetSize) {
  const headers = new Headers(request.headers);
  const requestedRange = headers.get('Range');
  headers.delete('Range'); headers.delete('If-Range');
  const response = await assets.fetch(new Request(request, { headers }));
  const resultHeaders = new Headers(response.headers);
  resultHeaders.set('Accept-Ranges', 'bytes');
  if (request.method !== 'GET' || !requestedRange || response.status !== 200 || !response.body) {
    return new Response(response.body, { status: response.status, headers: resultHeaders });
  }
  // ASSETS binding can omit Content-Length internally, even though the HTTP
  // response later has it. Use the exact size generated with this deployment.
  const size = assetSize ?? Number(response.headers.get('Content-Length'));
  const match = /^bytes=(\d*)-(\d*)$/.exec(requestedRange);
  const ifRange = request.headers.get('If-Range');
  if (!Number.isSafeInteger(size) || size <= 0 || !match || (!match[1] && !match[2])
    || (ifRange && ifRange !== response.headers.get('ETag'))) return new Response(response.body, { headers: resultHeaders });
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] ? (match[2] ? Math.min(size - 1, Number(match[2])) : size - 1) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) {
    await response.body.cancel(); resultHeaders.set('Content-Range', `bytes */${size}`); resultHeaders.delete('Content-Length');
    return new Response(null, { status: 416, headers: resultHeaders });
  }
  const reader = response.body.getReader(); let offset = 0;
  const stream = new ReadableStream({
    async pull(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) { controller.close(); return; }
        const from = Math.max(0, start - offset), to = Math.min(value.length, end + 1 - offset);
        offset += value.length;
        if (to > from) controller.enqueue(value.subarray(from, to));
        if (offset > end) { await reader.cancel(); controller.close(); return; }
        if (to > from) return;
      }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  resultHeaders.set('Content-Range', `bytes ${start}-${end}/${size}`);
  resultHeaders.set('Content-Length', String(end - start + 1));
  return new Response(stream, { status: 206, headers: resultHeaders });
}
