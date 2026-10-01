import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

test('real Wrangler HTTP server serves production routes, private 404s, and exact MP4 ranges', { timeout: 45000 }, async () => {
  const directory = fileURLToPath(new URL('..', import.meta.url));
  const server = createServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const port = server.address().port; await new Promise(resolve => server.close(resolve));
  const child = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev', '--local', '--ip', '127.0.0.1', '--port', String(port), '--var', 'TURNSTILE_SITE_KEY:SET_AFTER_SIGNUP'], {
    cwd: directory, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = ''; child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100 && child.exitCode === null; i++) {
      try { const response = await fetch(base + '/api/config'); await response.body.cancel(); ready = true; break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(ready, logs);
    for (const path of ['/', '/about/', '/news/', '/career/', '/career/apply/', '/contact/', '/_ds_bundle.js', '/styles.css']) {
      const response = await fetch(base + path); assert.equal(response.status, 200, path); await response.body.cancel();
    }
    for (const path of ['/.env', '/.dev.vars', '/backend/app.py', '/wrangler.jsonc', '/src/worker.js', '/career-layouts/', '/anim.html']) {
      const response = await fetch(base + path); assert.equal(response.status, 404, path); await response.body.cancel();
    }
    const video = readFileSync(new URL('../public/media/about-control.mp4', import.meta.url));
    for (const [range, expected] of [['bytes=0-1023', video.subarray(0, 1024)], ['bytes=-1024', video.subarray(-1024)], [`bytes=${video.length - 1024}-`, video.subarray(-1024)]]) {
      const response = await fetch(base + '/media/about-control.mp4', { headers: { Range: range } });
      assert.equal(response.status, 206, range); assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected);
    }
    const config = await (await fetch(base + '/api/config')).json();
    assert.equal(config.available, false);
    const missing = await fetch(base + '/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(missing.status, 503); assert.equal((await missing.json()).ok, false);
  } finally {
    const closed = once(child, 'close');
    if (child.exitCode === null) {
      if (process.platform === 'win32') child.kill('SIGTERM');
      else process.kill(-child.pid, 'SIGTERM');
    }
    await closed;
  }
});
