import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import vm from 'node:vm';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { MAX_FILE_BYTES, validateForm } from '../src/core.js';
import { fileStorage } from '../src/storage.js';

const origin = 'https://www.icarus-airship.com';
let mf, db, bucket, kv, captures, deliveryStatus, humanOK, humanHost, humanAction, clientScript;
const roles = JSON.parse(readFileSync(new URL('../generated/roles.json', import.meta.url)));
const position = Object.keys(roles)[0];
const contact = () => ({ name: '테스트 이름', email: 'applicant@example.com', language: 'ko', website: '', subject: '문의 테스트', message: '테스트 문의입니다.' });
const application = (files = { resume: { name: 'resume.pdf', size: 16 } }) => ({ name: '지원자 테스트', email: 'applicant@example.com', language: 'ko', website: '',
  position, positionTitle: 'untrusted title', phone: '010-0000-0000', consent: 'on', portfolioUrl: 'https://example.com/portfolio', message: '지원 테스트', files });
const headers = extra => ({ Origin: origin, 'X-Icarus-Form': '1', 'CF-Connecting-IP': '192.0.2.1', ...extra });
async function call(path, init = {}) {
  const response = await mf.dispatchFetch(origin + path, init);
  return { status: response.status, body: await response.json(), response };
}
const start = (kind, form, id = randomUUID(), extra = {}) => call(`/api/${kind}`, {
  method: 'POST', headers: headers({ 'Content-Type': 'application/json', ...extra }),
  body: JSON.stringify({ id, form, turnstileToken: 'test-token' }),
});
const upload = async (session, slot, bytes, extra = {}) => {
  const sent = await call(`/api/uploads/${session.id}/${slot}`, {
    method: 'PUT', headers: headers({ 'Content-Type': 'application/octet-stream', 'Content-Length': String(bytes.length), 'X-Upload-Token': session.token, ...extra }), body: bytes,
  });
  if (sent.status !== 200) return sent;
  return call(`/api/uploads/${session.id}/${slot}/verify`, { method: 'POST', headers: headers({ 'X-Upload-Token': session.token, ...extra }) });
};
const finish = session => call(`/api/submissions/${session.id}/complete`, { method: 'POST', headers: headers({ 'X-Upload-Token': session.token }) });
function pdf(size) { const bytes = Buffer.alloc(size, 65); bytes.write('%PDF-1.7\n'); bytes.write('\n%%EOF\n', size - 7); return bytes; }
before(async () => {
  clientScript = (await build({ entryPoints: [new URL('../../design-system/src/utils/submitForm.ts', import.meta.url).pathname], bundle: true, format: 'cjs', platform: 'browser', write: false })).outputFiles[0].text;
  const script = (await build({ entryPoints: [new URL('../src/worker.js', import.meta.url).pathname], bundle: true, format: 'esm', platform: 'browser', write: false })).outputFiles[0].text;
  const outboundService = async request => {
    if (request.url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') return Response.json({ success: humanOK, hostname: humanHost, action: humanAction });
    if (request.url === 'https://api.resend.com/emails') {
      captures.push({ body: await request.json(), headers: Object.fromEntries(request.headers) });
      return Response.json(deliveryStatus === 200 ? { id: 'mock-email-id' } : { message: 'mock-failure' }, { status: deliveryStatus });
    }
    throw new Error(`Unexpected external request: ${new URL(request.url).origin}`);
  };
  mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script, compatibilityDate: '2026-09-29', outboundService,
    d1Databases: ['DB'], kvNamespaces: ['UPLOADS'],
    bindings: { SITE_ORIGIN: origin, MAIL_FROM: 'ICARUS <website@notify.icarus-airship.com>', TURNSTILE_SITE_KEY: 'test-site-key', TURNSTILE_SECRET_KEY: 'test-secret',
      SIGNING_SECRET: 'test-signing-secret-longer-than-thirty-two-characters', RESEND_API_KEY: 'mock-resend-key' },
  }));
  db = await mf.getD1Database('DB'); kv = await mf.getKVNamespace('UPLOADS'); bucket = fileStorage(kv);
  bucket.list = async () => ({ objects: (await kv.list()).keys.map(item => ({ ...item, key: item.name })) });
  const schema = readFileSync(new URL('../migrations/0001_forms.sql', import.meta.url), 'utf8');
  // D1 exec accepts multiline SQL and trigger bodies via its prepare API.
  const statements = schema.split(/;\s*(?=CREATE|-- Atomic)/).map(sql => sql.trim()).filter(Boolean);
  for (const sql of statements) await db.prepare(sql).run();
});
beforeEach(async () => {
  captures = []; deliveryStatus = 200; humanOK = true; humanHost = 'www.icarus-airship.com'; humanAction = 'icarus_form';
  await db.batch([db.prepare('DELETE FROM uploads'), db.prepare('DELETE FROM submissions')]);
  const items = await bucket.list(); if (items.objects.length) await bucket.delete(items.objects.map(item => item.key));
});
after(async () => { await mf?.dispose(); });

test('contact validates, delivers to the fixed inbox, uses Reply-To and deduplicates completion', async () => {
  const init = await start('contact', contact()); assert.equal(init.status, 200);
  assert.equal((await finish(init.body)).status, 200);
  assert.equal((await finish(init.body)).status, 200); assert.equal(captures.length, 1);
  assert.deepEqual(captures[0].body.to, ['contact@icarus-airship.com']);
  assert.equal(captures[0].body.reply_to, 'applicant@example.com');
  assert.match(captures[0].body.text, /테스트 이름/);
});
test('full 10 MiB resume + 10 MiB portfolio stream through KV and arrive unchanged through signed URLs', async () => {
  const bytes = pdf(MAX_FILE_BYTES);
  const init = await start('applications', application({ resume: { name: '이력서.pdf', size: bytes.length }, portfolio: { name: 'portfolio.pdf', size: bytes.length } }));
  assert.equal(init.status, 200);
  for (const slot of ['resume', 'portfolio']) assert.equal((await upload(init.body, slot, bytes)).status, 200);
  assert.equal((await finish(init.body)).status, 200); assert.equal(captures.length, 1);
  assert.ok(JSON.stringify(captures[0].body).length < 5000, 'mail API request must contain URLs, never 20 MiB of Base64');
  assert.match(captures[0].body.subject, new RegExp(roles[position].ko));
  for (const attachment of captures[0].body.attachments) {
    const response = await mf.dispatchFetch(attachment.path);
    assert.equal(response.status, 200); assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    const downloaded = Buffer.from(await response.arrayBuffer());
    assert.equal(downloaded.length, MAX_FILE_BYTES);
    assert.equal(createHash('sha256').update(downloaded).digest('hex'), createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal((await finish(init.body)).status, 200); assert.equal(captures.length, 1);
});
test('Word files are rejected before creating a submission, even with a PDF-looking filename payload', async () => {
  for (const extension of ['doc', 'docx']) {
    const result = await start('applications', application({ resume: { name: `resume.${extension}`, size: MAX_FILE_BYTES } }));
    assert.equal(result.status, 400); assert.equal(result.body.error, 'invalid_file');
  }
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM submissions').first()).n, 0);
});

test('one byte over 10 MiB, missing consent, unknown role and forged recipient are rejected before storage', async () => {
  assert.equal((await start('applications', application({ resume: { name: 'resume.pdf', size: MAX_FILE_BYTES + 1 } }))).status, 413);
  for (const form of [{ ...application(), consent: '' }, { ...application(), position: 'not-a-role' }, { ...contact(), to: 'attacker@example.com' }]) {
    assert.equal((await start(form.files ? 'applications' : 'contact', form)).status, 400);
  }
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM submissions').first()).n, 0);
});
test('invalid signatures, disguised file types and upload-size mismatches cannot be submitted', async () => {
  const init = await start('applications', application());
  assert.equal((await upload(init.body, 'resume', pdf(16), { 'X-Upload-Token': 'bad' })).status, 403);
  assert.equal((await upload(init.body, 'resume', Buffer.alloc(16))).status, 400);
  assert.equal((await upload(init.body, 'resume', pdf(17))).status, 413);
  assert.equal((await finish(init.body)).status, 400); assert.equal(captures.length, 0);
  assert.equal((await bucket.list()).objects.length, 0);
});
test('a Word document renamed as PDF is rejected by its content signature', async () => {
  for (const bytes of [Buffer.from([208,207,17,224,161,177,26,225]), Buffer.from('PK\x03\x04zipdata')]) {
    const init = await start('applications', application({ resume: { name: 'resume.pdf', size: bytes.length } }));
    const response = await upload(init.body, 'resume', bytes);
    assert.equal(response.status, 400); assert.equal(response.body.error, 'invalid_file');
  }
});

test('rejects cross-origin requests and failed, wrong-host or wrong-action human verification', async () => {
  assert.equal((await start('contact', contact(), randomUUID(), { Origin: 'https://attacker.example' })).status, 403);
  humanOK = false; assert.equal((await start('contact', contact())).status, 403);
  humanOK = true; humanHost = 'attacker.example'; assert.equal((await start('contact', contact())).status, 403);
  humanHost = 'www.icarus-airship.com'; humanAction = 'another_form'; assert.equal((await start('contact', contact())).status, 403);
});
test('same submission id cannot change contents; missing upload cannot send; signed URLs cannot be forged', async () => {
  const id = randomUUID(); const init = await start('applications', application(), id);
  assert.equal((await start('applications', { ...application(), name: 'Changed' }, id)).status, 409);
  assert.equal((await finish(init.body)).status, 400);
  assert.equal((await upload(init.body, 'resume', pdf(16))).status, 200);
  assert.equal((await finish(init.body)).status, 200);
  const url = new URL(captures[0].body.attachments[0].path); url.searchParams.set('token', '0'.repeat(64));
  assert.equal((await mf.dispatchFetch(url)).status, 404);
  assert.equal((await mf.dispatchFetch(`${origin}/api/attachments/${id}/resume`)).status, 404);
});
test('provider failure is not reported as success and retry uses identical body + idempotency key', async () => {
  const init = await start('contact', contact()); deliveryStatus = 503;
  const failed = await finish(init.body); assert.equal(failed.status, 502); assert.equal(failed.body.ok, false);
  deliveryStatus = 200; assert.equal((await finish(init.body)).status, 200);
  assert.deepEqual(captures[0], captures[1]);
});
test('IP limit counts abandoned attempts and is enforced atomically across simultaneous submissions', async () => {
  const results = await Promise.all(Array.from({ length: 8 }, () => start('contact', contact())));
  assert.equal(results.filter(result => result.status === 200).length, 5);
  assert.equal(results.filter(result => result.status === 429).length, 3);
});
test('UTC daily mail and 200 MiB storage reservations fail closed before uploads', async () => {
  const now = Math.floor(Date.now()/1000);
  const insert = db.prepare("INSERT INTO submissions(id,fingerprint,ip_hash,created,expires,kind,payload,files,reserved_bytes) VALUES(?,?,?,?,?,'contact','{}','{}',?)");
  for (let i = 0; i < 90; i++) await insert.bind(randomUUID(), 'test', `ip-${i}`, now, now + 86400, 0).run();
  assert.equal((await start('contact', contact())).body.error, 'capacity_reached');
  await db.prepare('DELETE FROM submissions').run();
  await insert.bind(randomUUID(), 'test', 'seed', now, now + 86400, 209715200).run();
  assert.equal((await start('applications', application())).body.error, 'capacity_reached');
});
test('KV expiration matches the session deadline; cron clears PII and releases expired reservations', async () => {
  const init = await start('applications', application()); await upload(init.body, 'resume', pdf(16));
  const deadline = (await db.prepare('SELECT expires FROM submissions WHERE id=?').bind(init.body.id).first()).expires;
  assert.equal((await kv.list()).keys[0].expiration, deadline);
  await db.prepare('UPDATE submissions SET expires=? WHERE id=?').bind(Math.floor(Date.now()/1000) - 1, init.body.id).run();
  const worker = await mf.getWorker(); await worker.scheduled({ cron: '17 * * * *' });
  const row = await db.prepare('SELECT * FROM submissions WHERE id=?').bind(init.body.id).first();
  assert.equal(row.payload, null); assert.equal(row.files, null); assert.equal(row.reserved_bytes, 0);
  await db.prepare('UPDATE submissions SET created=? WHERE id=?').bind(Math.floor(Date.now()/1000) - 3700, init.body.id).run();
  assert.equal((await start('applications', application(), init.body.id)).status, 410);
});

test('interrupted upload recovers the existing immutable object after its lease expires', async () => {
  const init = await start('applications', application());
  await bucket.put(`sessions/${init.body.id}/resume/old`, pdf(16), { size: 16, expires: Math.floor(Date.now()/1000) + 86400 });
  await db.prepare("INSERT INTO uploads(submission_id,slot,state,attempts,lease,nonce) VALUES(?,'resume','uploading',1,0,'old')").bind(init.body.id).run();
  assert.equal((await upload(init.body, 'resume', pdf(16))).status, 200);
  assert.equal((await finish(init.body)).status, 200);
});

test('KV propagation delay preserves the upload and retry validates without writing it again', async () => {
  const init = await start('applications', application());
  await db.prepare("INSERT INTO uploads(submission_id,slot,state,attempts,nonce) VALUES(?,'resume','stored',1,'pending')").bind(init.body.id).run();
  const pending = await upload(init.body, 'resume', pdf(16));
  assert.equal(pending.status, 503); assert.equal(pending.body.error, 'upload_pending');
  assert.equal((await db.prepare('SELECT state FROM uploads WHERE submission_id=?').bind(init.body.id).first()).state, 'stored');
  const row = await db.prepare('SELECT expires FROM submissions WHERE id=?').bind(init.body.id).first();
  const key = `sessions/${init.body.id}/resume/pending`;
  await bucket.put(key, pdf(16), { size: 16, expires: row.expires });
  assert.equal((await upload(init.body, 'resume', Buffer.alloc(0))).status, 200);
  assert.equal((await db.prepare('SELECT attempts FROM uploads WHERE submission_id=?').bind(init.body.id).first()).attempts, 1);
  assert.equal((await kv.list()).keys.find(item => item.name === key).expiration, row.expires);
});

test('late writes from an expired attempt cannot replace the accepted attachment', async () => {
  const init = await start('applications', application());
  await db.prepare("INSERT INTO uploads(submission_id,slot,state,attempts,lease,nonce) VALUES(?,'resume','uploading',1,0,'old')").bind(init.body.id).run();
  assert.equal((await upload(init.body, 'resume', pdf(16))).status, 200);
  await bucket.put(`sessions/${init.body.id}/resume/old`, Buffer.alloc(16), { size: 16, expires: Math.floor(Date.now()/1000) + 86400 });
  assert.equal((await finish(init.body)).status, 200);
  const response = await mf.dispatchFetch(captures[0].body.attachments[0].path);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), pdf(16));
});

test('monthly cap blocks even imported historical submissions; token replay cannot replace a completed file', async () => {
  // Seed imported history without the insert trigger, then restore production constraints.
  const triggers = (await db.prepare("SELECT name, sql FROM sqlite_master WHERE type='trigger'").all()).results;
  for (const trigger of triggers) await db.prepare(`DROP TRIGGER ${trigger.name}`).run();
  const now = Math.floor(Date.now()/1000);
  await db.prepare("WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x<2800) INSERT INTO submissions(id,fingerprint,ip_hash,created,expires,kind,payload,files) SELECT 'seed-'||x,'f','ip-'||x,?,?,'contact',NULL,NULL FROM n").bind(now, now + 86400).run();
  for (const trigger of triggers) await db.prepare(trigger.sql).run();
  // At the start of a month the daily cap would fire first. Isolate the
  // calendar-month constraint here, then restore the daily trigger.
  const dailyTrigger = triggers.find(trigger => trigger.name === 'submission_daily_limit');
  assert.ok(dailyTrigger);
  await db.prepare(`DROP TRIGGER ${dailyTrigger.name}`).run();
  try {
    assert.equal((await start('contact', contact())).body.error, 'capacity_reached');
  } finally {
    await db.prepare(dailyTrigger.sql).run();
  }
  await db.prepare('DELETE FROM submissions').run();
  const init = await start('applications', application());
  await upload(init.body, 'resume', pdf(16));
  assert.equal((await upload(init.body, 'resume', Buffer.alloc(16))).status, 200);
  const stored = await db.prepare('SELECT nonce FROM uploads WHERE submission_id=?').bind(init.body.id).first();
  assert.equal(Buffer.from(await (await bucket.get(`sessions/${init.body.id}/resume/${stored.nonce}`)).arrayBuffer()).toString(), pdf(16).toString());
});

function client(fetcher) {
  const exports = {};
  const context = vm.createContext({ module: { exports }, exports, fetch: fetcher, URL, crypto, AbortController, FormData, File, Uint8Array, console,
    window: { location: { href: origin + '/career/apply/', origin }, setTimeout, clearTimeout,
      turnstile: { render: (element, options) => { queueMicrotask(() => options.callback('test-token')); return 'widget'; }, remove() {} } },
  });
  vm.runInContext(clientScript, context);
  return context.module.exports;
}
test('actual browser submission helper completes 20 MiB workflow using raw File requests', async () => {
  const requests = [];
  const api = client(async (url, init = {}) => {
    requests.push({ path: new URL(url, origin).pathname, method: init.method, body: init.body });
    return mf.dispatchFetch(new URL(url, origin), { ...init, headers: headers(init.headers) });
  });
  const body = new FormData(); const fields = application(); delete fields.files;
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  for (const slot of ['resume', 'portfolio']) body.set(slot, new File([pdf(MAX_FILE_BYTES)], `${slot}.pdf`, { type: 'application/pdf' }));
  await api.submitForm('/api/applications', body, randomUUID(), new AbortController().signal, {});
  assert.deepEqual(requests.map(item => item.method || 'GET'), ['GET', 'POST', 'PUT', 'POST', 'PUT', 'POST', 'POST']);
  assert.ok(requests[2].body instanceof File); assert.ok(requests[4].body instanceof File);
  assert.equal(captures.length, 1); assert.equal(captures[0].body.attachments.length, 2);
});
test('browser helper preserves the Python multipart path and rejects delivery failure without false success', async () => {
  const body = new FormData(); Object.entries(contact()).forEach(([key, value]) => body.set(key, value));
  const requests = [];
  const legacy = client(async (url, init = {}) => {
    requests.push({ url, init });
    return Response.json(url === '/api/config' ? { ok: true, transport: 'multipart' } : { ok: true });
  });
  await legacy.submitForm('/api/contact', body, randomUUID(), new AbortController().signal);
  assert.strictEqual(requests[1].init.body, body);
  const api = client((url, init = {}) => mf.dispatchFetch(new URL(url, origin), { ...init, headers: headers(init.headers) }));
  deliveryStatus = 503;
  await assert.rejects(api.submitForm('/api/contact', body, randomUUID(), new AbortController().signal, {}), error => error.code === 'delivery_failed');
});
test('validation rejects header injection, unexpected fields, malformed links, and preserves English role labels', () => {
  for (const input of [{ ...contact(), name: 'x\r\nBcc:evil' }, { ...contact(), email: 'x\n@example.com' }, { ...contact(), website: 'spam' }]) assert.throws(() => validateForm('contact', input, roles));
  assert.throws(() => validateForm('applications', { ...application(), portfolioUrl: 'javascript:alert(1)' }, roles));
  assert.equal(validateForm('applications', { ...application(), language: 'en' }, roles).data.positionTitle, roles[position].en);
});
