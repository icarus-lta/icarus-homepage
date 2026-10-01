import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lines = readFileSync(resolve(directory, '.dev.vars'), 'utf8').split(/\r?\n/);
const values = new Map(lines.filter(line => /^[A-Z_]+=/.test(line)).map(line => {
  const separator = line.indexOf('=');
  return [line.slice(0, separator), line.slice(separator + 1)];
}));

for (const key of ['RESEND_API_KEY', 'SIGNING_SECRET', 'TURNSTILE_SECRET_KEY']) {
  const value = values.get(key);
  if (!value) throw new Error(`Missing ${key} in cloudflare/.dev.vars`);
  const result = spawnSync(resolve(directory, 'node_modules/.bin/wrangler'),
    ['pages', 'secret', 'put', key, '--project-name', 'icarus-site'],
    { cwd: resolve(directory, 'pages'), input: value, encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'] });
  if (result.status !== 0) throw new Error(`Could not set Pages secret ${key}`);
}
