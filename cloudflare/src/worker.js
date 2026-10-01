import roles from '../generated/roles.json';
import mediaSizes from '../generated/media.json';
import { FormError, MAX_FILE_BYTES, RETENTION_SECONDS, SESSION_SECONDS, UUID, composeMail, requireThat, validateForm } from './core.js';
import { configured, digest, readJson, sameOrigin, signature, verifyHuman, verifySignature } from './security.js';
import { mimeType, objectKey, streamUpload, validateStoredFile } from './files.js';
import { fileStorage } from './storage.js';
import { serveVideo } from './media.js';

const nowSeconds = () => Math.floor(Date.now() / 1000);
const json = (body, status = 200) => Response.json(body, { status, headers: {
  'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  ...(status === 429 ? { 'Retry-After': '900' } : {}),
} });
const rowFor = (env, id) => env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first();
const tokenText = row => `session:${row.id}:${row.fingerprint}:${row.created}`;
async function authorizedRow(request, env, id) {
  requireThat(UUID.test(id));
  const row = await rowFor(env, id);
  requireThat(row, 'invalid_session', 403);
  requireThat(await verifySignature(env.SIGNING_SECRET, tokenText(row), request.headers.get('X-Upload-Token')), 'invalid_session', 403);
  requireThat(nowSeconds() < row.created + SESSION_SECONDS, 'submission_expired', 410);
  return row;
}
async function start(request, env, kind) {
  const input = await readJson(request);
  requireThat(input && UUID.test(input.id || '') && input.form, 'invalid_request');
  const { data, files } = validateForm(kind, input.form, roles);
  const fingerprint = await digest(JSON.stringify({ kind, data, files }));
  let row = await rowFor(env, input.id);
  if (row) {
    requireThat(row.fingerprint === fingerprint, 'submission_changed', 409);
    requireThat(nowSeconds() < row.created + SESSION_SECONDS, 'submission_expired', 410);
    // A repeated public id must still prove its human challenge before obtaining a session token.
    await verifyHuman(input.turnstileToken, request, env);
  } else {
    await verifyHuman(input.turnstileToken, request, env);
    const created = nowSeconds();
    const ipHash = await signature(env.SIGNING_SECRET, `ip:${request.headers.get('CF-Connecting-IP') || 'unknown'}`);
    try {
      await env.DB.prepare('INSERT INTO submissions(id, fingerprint, ip_hash, created, expires, kind, payload, files, reserved_bytes) VALUES(?,?,?,?,?,?,?,?,?)')
        .bind(input.id, fingerprint, ipHash, created, created + RETENTION_SECONDS, kind, JSON.stringify(data), JSON.stringify(files),
          Object.values(files).reduce((sum, file) => sum + file.size, 0)).run();
    } catch (error) {
      const message = String(error?.message || '') + String(error?.cause?.message || '');
      if (message.includes('ip_quota')) throw new FormError('rate_limited', 429);
      if (/mail_quota|storage_quota/.test(message)) throw new FormError('capacity_reached', 429);
      row = await rowFor(env, input.id);
      if (!row || row.fingerprint !== fingerprint) throw new FormError('submission_changed', 409);
    }
    row = await rowFor(env, input.id);
  }
  if (row.state === 'sent') return json({ ok: true, sent: true });
  const token = await signature(env.SIGNING_SECRET, tokenText(row));
  return json({ ok: true, id: row.id, token, uploads: Object.keys(files), maxFileBytes: MAX_FILE_BYTES });
}
async function validateUpload(env, id, slot, stored, file) {
  const storage = fileStorage(env.UPLOADS), key = objectKey(id, slot, stored.nonce);
  try { await validateStoredFile(storage, key, file); }
  catch (error) {
    // A successful KV write may not yet be visible here. Keep its D1 state and
    // let the client retry validation; never duplicate the upload for that case.
    if (error instanceof FormError && error.code === 'invalid_file') {
      await storage.delete(key);
      await env.DB.prepare("UPDATE uploads SET state='empty', lease=0 WHERE submission_id=? AND slot=? AND nonce=? AND state='stored'").bind(id, slot, stored.nonce).run();
    }
    throw error;
  }
  await env.DB.prepare("UPDATE uploads SET state='done', lease=0 WHERE submission_id=? AND slot=? AND nonce=? AND state='stored'").bind(id, slot, stored.nonce).run();
  const current = await env.DB.prepare('SELECT state, nonce FROM uploads WHERE submission_id=? AND slot=?').bind(id, slot).first();
  requireThat(current?.state === 'done' && current.nonce === stored.nonce, 'submission_in_progress', 409);
  return json({ ok: true });
}
async function upload(request, env, id, slot, verify = false) {
  const row = await authorizedRow(request, env, id);
  requireThat(row.kind === 'applications' && ['resume', 'portfolio'].includes(slot));
  requireThat(row.state === 'pending', 'submission_in_progress', 409);
  const file = JSON.parse(row.files || '{}')[slot]; requireThat(file, 'invalid_file');
  await env.DB.prepare('INSERT OR IGNORE INTO uploads(submission_id, slot) VALUES(?,?)').bind(id, slot).run();
  const stored = await env.DB.prepare('SELECT * FROM uploads WHERE submission_id=? AND slot=?').bind(id, slot).first();
  if (stored.state === 'done') return json({ ok: true });
  if (verify) {
    requireThat(stored.state === 'stored', 'required_file');
    return validateUpload(env, id, slot, stored, file);
  }
  if (stored.state === 'stored') return json({ ok: true });
  const nonce = crypto.randomUUID(), now = nowSeconds(), storage = fileStorage(env.UPLOADS);
  if (stored.state === 'uploading' && stored.lease < now && await storage.head(objectKey(id, slot, stored.nonce))) {
    const recovered = await env.DB.prepare("UPDATE uploads SET state='stored', lease=0 WHERE submission_id=? AND slot=? AND nonce=? AND state='uploading' AND lease<?")
      .bind(id, slot, stored.nonce, now).run();
    requireThat(recovered.meta.changes === 1, 'submission_in_progress', 409);
    return json({ ok: true });
  }
  const result = await env.DB.prepare("UPDATE uploads SET state='uploading', attempts=attempts+1, lease=?, nonce=? WHERE submission_id=? AND slot=? AND (state='empty' OR (state='uploading' AND lease<?)) AND attempts<3")
    .bind(now + 300, nonce, id, slot, now).run();
  requireThat(result.meta.changes === 1, stored.attempts >= 3 ? 'upload_failed' : 'submission_in_progress', 409);
  const key = objectKey(id, slot, nonce);
  try { await streamUpload(request, storage, key, file, row.expires); }
  catch (error) {
    await storage.delete(key);
    await env.DB.prepare("UPDATE uploads SET state='empty', lease=0 WHERE submission_id=? AND slot=? AND nonce=? AND state='uploading'").bind(id, slot, nonce).run();
    throw error;
  }
  const saved = await env.DB.prepare("UPDATE uploads SET state='stored', lease=0 WHERE submission_id=? AND slot=? AND nonce=? AND state='uploading'").bind(id, slot, nonce).run();
  requireThat(saved.meta.changes === 1, 'submission_in_progress', 409);
  return json({ ok: true });
}
async function finish(request, env, id) {
  const row = await authorizedRow(request, env, id);
  if (row.state === 'sent') return json({ ok: true, submissionId: id });
  const files = JSON.parse(row.files || '{}');
  const uploaded = await env.DB.prepare("SELECT slot FROM uploads WHERE submission_id=? AND state='done'").bind(id).all();
  requireThat(Object.keys(files).every(slot => uploaded.results.some(item => item.slot === slot)), 'required_file');
  const now = nowSeconds();
  const claim = await env.DB.prepare("UPDATE submissions SET state='sending', lease=? WHERE id=? AND (state='pending' OR (state='sending' AND lease<?))")
    .bind(now + 120, id, now).run();
  requireThat(claim.meta.changes === 1, 'submission_in_progress', 409);
  const attachments = [];
  for (const [slot, file] of Object.entries(files)) {
    const token = await signature(env.SIGNING_SECRET, `download:${id}:${slot}:${row.expires}`);
    attachments.push({ filename: file.name, path: `${env.SITE_ORIGIN}/api/attachments/${id}/${slot}?expires=${row.expires}&token=${token}` });
  }
  // Stable body + idempotency key: an ambiguous timeout must never send a second email.
  const mail = composeMail(row.kind, JSON.parse(row.payload), id, attachments, env.MAIL_FROM);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `icarus/${id}` },
      body: JSON.stringify(mail), signal: AbortSignal.timeout(45000),
    });
    const result = await response.json().catch(() => null);
    requireThat(response.ok && typeof result?.id === 'string', 'delivery_failed', 502);
    await env.DB.prepare("UPDATE submissions SET state='sent', lease=0 WHERE id=?").bind(id).run();
  } catch (error) {
    await env.DB.prepare("UPDATE submissions SET state='pending', lease=0 WHERE id=? AND state='sending'").bind(id).run();
    throw error instanceof FormError ? error : new FormError('delivery_failed', 502);
  }
  return json({ ok: true, submissionId: id });
}
async function download(request, env, id, slot) {
  requireThat(UUID.test(id) && ['resume', 'portfolio'].includes(slot), 'not_found', 404);
  const url = new URL(request.url), expires = url.searchParams.get('expires');
  requireThat(/^\d{10}$/.test(expires || '') && Number(expires) > nowSeconds(), 'not_found', 404);
  requireThat(await verifySignature(env.SIGNING_SECRET, `download:${id}:${slot}:${expires}`, url.searchParams.get('token')), 'not_found', 404);
  const row = await rowFor(env, id);
  requireThat(row && row.expires === Number(expires) && ['sending', 'sent', 'pending'].includes(row.state), 'not_found', 404);
  const file = JSON.parse(row.files || '{}')[slot]; requireThat(file, 'not_found', 404);
  const uploaded = await env.DB.prepare("SELECT nonce FROM uploads WHERE submission_id=? AND slot=? AND state='done'").bind(id, slot).first();
  requireThat(uploaded, 'not_found', 404);
  const count = await env.DB.prepare('UPDATE submissions SET download_count=download_count+1 WHERE id=? AND download_count<12').bind(id).run();
  requireThat(count.meta.changes === 1, 'not_found', 404);
  const object = await fileStorage(env.UPLOADS).get(objectKey(id, slot, uploaded.nonce)); requireThat(object, 'upload_pending', 503);
  if (request.method === 'HEAD') await object.body.cancel();
  return new Response(request.method === 'HEAD' ? null : object.body, { headers: {
    'Content-Type': mimeType(file.extension), 'Content-Length': String(object.size),
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.name).replace(/'/g, '%27')}`,
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
  } });
}
export async function cleanup(env) {
  const now = nowSeconds();
  // KV expires every attempt at row.expires, including interrupted/orphan writes.
  // Clear PII in one database statement, avoiding per-file work in the 10ms Cron.
  // Keep minimal quota/dedup records through the calendar month.
  await env.DB.batch([
    env.DB.prepare('UPDATE submissions SET payload=NULL, files=NULL, reserved_bytes=0 WHERE id IN (SELECT id FROM submissions WHERE expires<=? AND (payload IS NOT NULL OR reserved_bytes>0) LIMIT 12)').bind(now),
    env.DB.prepare('DELETE FROM uploads WHERE submission_id IN (SELECT id FROM submissions WHERE created<? AND reserved_bytes=0)').bind(now - 35 * 86400),
    env.DB.prepare('DELETE FROM submissions WHERE created<? AND reserved_bytes=0').bind(now - 35 * 86400),
  ]);
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/^\/media\/[^/]+\.mp4$/.test(url.pathname)) return serveVideo(request, env.ASSETS, mediaSizes[url.pathname]);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (url.pathname === '/api/config' && request.method === 'GET') return json({ ok: true, transport: 'cloudflare', available: configured(env), turnstileSiteKey: env.TURNSTILE_SITE_KEY, maxFileBytes: MAX_FILE_BYTES });
      requireThat(configured(env), 'service_unavailable', 503);
      const file = url.pathname.match(/^\/api\/attachments\/([^/]+)\/(resume|portfolio)$/);
      if (file && ['GET', 'HEAD'].includes(request.method)) return await download(request, env, file[1], file[2]);
      sameOrigin(request, env);
      const startRoute = url.pathname.match(/^\/api\/(contact|applications)$/);
      if (startRoute && request.method === 'POST') return await start(request, env, startRoute[1]);
      const uploadRoute = url.pathname.match(/^\/api\/uploads\/([^/]+)\/(resume|portfolio)$/);
      if (uploadRoute && request.method === 'PUT') return await upload(request, env, uploadRoute[1], uploadRoute[2]);
      const verifyRoute = url.pathname.match(/^\/api\/uploads\/([^/]+)\/(resume|portfolio)\/verify$/);
      if (verifyRoute && request.method === 'POST') return await upload(request, env, verifyRoute[1], verifyRoute[2], true);
      const finishRoute = url.pathname.match(/^\/api\/submissions\/([^/]+)\/complete$/);
      if (finishRoute && request.method === 'POST') return await finish(request, env, finishRoute[1]);
      throw new FormError('not_found', 404);
    } catch (error) {
      // Never log request bodies, filenames, email addresses, secrets or download tokens.
      return json({ ok: false, error: error instanceof FormError ? error.code : 'service_unavailable' }, error instanceof FormError ? error.status : 503);
    }
  },
  scheduled(event, env, ctx) { ctx.waitUntil(cleanup(env)); },
};
