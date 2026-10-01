import { challengeToken } from './turnstile';

export class SubmissionError extends Error {
  constructor(public code: string) { super(code); }
}

export function newSubmissionId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function submitForm(url: string, body: FormData, id: string, signal: AbortSignal, verificationElement: HTMLElement | null = null) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal.aborted) abort();
  signal.addEventListener('abort', abort, { once: true });
  const timeout = window.setTimeout(abort, 300000);
  try {
    const endpoint = new URL(url, window.location.href);
    let cloudflare = false;
    let sitekey = '';
    // Only probe our own origin. Preserve custom endpoints and the existing Python server.
    if (endpoint.origin === window.location.origin) {
      const response = await fetch('/api/config', { signal: controller.signal, cache: 'no-store' });
      if (response.status !== 404) {
        const config = await response.json().catch(() => null);
        if (!response.ok || config?.ok !== true) throw new SubmissionError('service_unavailable');
        cloudflare = config.transport === 'cloudflare';
        if (cloudflare && !config.available) throw new SubmissionError('service_unavailable');
        sitekey = config.turnstileSiteKey || '';
      }
    }
    if (cloudflare) {
      const form: Record<string, unknown> = {};
      const files: Record<string, File> = {};
      for (const [name, value] of body.entries()) {
        if (typeof value === 'string') form[name] = value;
        else if (value.size || value.name) files[name] = value;
      }
      if (endpoint.pathname === '/api/applications') form.files = Object.fromEntries(
        Object.entries(files).map(([slot, file]) => [slot, { name: file.name, size: file.size }]),
      );
      let turnstileToken: string;
      try { turnstileToken = await challengeToken(sitekey, verificationElement, controller.signal, String(form.language || 'ko')); }
      catch { throw new SubmissionError('verification_failed'); }
      const session = await requestJSON(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Icarus-Form': '1' },
        body: JSON.stringify({ id, form, turnstileToken }), signal: controller.signal,
      });
      if (session.sent) return;
      if (session.id !== id || typeof session.token !== 'string' || !Array.isArray(session.uploads)
        || !session.uploads.every((slot: unknown) => typeof slot === 'string' && ['resume', 'portfolio'].includes(slot) && files[slot])) {
        throw new SubmissionError('delivery_failed');
      }
      const headers = { 'X-Icarus-Form': '1', 'X-Upload-Token': session.token };
      // Sequential raw uploads: browsers stream File bodies, no Base64 copies on either side.
      for (const slot of session.uploads) {
        await requestJSON(`/api/uploads/${id}/${slot}`, {
          method: 'PUT', headers: { ...headers, 'Content-Type': 'application/octet-stream' }, body: files[slot], signal: controller.signal,
        });
        // Verify in a separate request to keep each invocation within Free CPU limits.
        for (let retry = 0; ; retry++) {
          try {
            await requestJSON(`/api/uploads/${id}/${slot}/verify`, { method: 'POST', headers, signal: controller.signal });
            break;
          } catch (error) {
            if (!(error instanceof SubmissionError) || error.code !== 'upload_pending' || retry >= 5) throw error;
            await delay(15000, controller.signal);
          }
        }
      }
      await requestJSON(`/api/submissions/${id}/complete`, { method: 'POST', headers, signal: controller.signal });
      return;
    }
    await requestJSON(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'X-Icarus-Form': '1', 'X-Submission-ID': id },
      body, signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener('abort', abort);
  }
}

function delay(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const abort = () => { window.clearTimeout(timer); reject(signal.reason); };
    const timer = window.setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
  });
}

async function requestJSON(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw new SubmissionError(result?.error || 'delivery_failed');
  return result;
}
