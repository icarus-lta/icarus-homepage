// KV stores immutable PDF attempts; D1 coordinates state and quotas.
export function fileStorage(kv) {
  return {
    async put(key, stream, { size, expires }) {
      await kv.put(key, stream, { expiration: expires, metadata: { size } });
    },
    async head(key) {
      const { value, metadata } = await kv.getWithMetadata(key, { type: 'stream' });
      if (!value) return null;
      await value.cancel(); return { size: metadata?.size };
    },
    async get(key, options = {}) {
      const { value, metadata } = await kv.getWithMetadata(key, { type: 'stream' });
      if (!value) return null;
      if (!options.range) return { body: value, size: metadata?.size, arrayBuffer: () => new Response(value).arrayBuffer() };
      // PDF validation reads only its header, then cancels the native stream.
      const { offset, length } = options.range;
      if (offset !== 0 || length > 8) { await value.cancel(); throw new Error('Unsupported PDF header range'); }
      const bytes = new Uint8Array(length), reader = value.getReader(); let copied = 0;
      try {
        while (copied < length) {
          const chunk = await reader.read(); if (chunk.done) break;
          const take = Math.min(chunk.value.length, length - copied);
          bytes.set(chunk.value.subarray(0, take), copied); copied += take;
        }
      } finally { await reader.cancel(); }
      return { size: metadata?.size, arrayBuffer: async () => bytes.buffer.slice(0, copied) };
    },
    async delete(keys) { await Promise.all((Array.isArray(keys) ? keys : [keys]).map(key => kv.delete(key))); },
  };
}
