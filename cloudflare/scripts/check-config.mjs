import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const directory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(readFileSync(resolve(directory, 'wrangler.jsonc'), 'utf8'));
if (config.d1_databases[0].database_id.startsWith('00000000') || config.vars.TURNSTILE_SITE_KEY === 'SET_AFTER_SIGNUP') {
  throw new Error('Complete the account setup in cloudflare/README.md before deploying.');
}
if (config.vars.TURNSTILE_SITE_KEY.startsWith('1x000000') || !config.vars.SITE_ORIGIN.startsWith('https://')) {
  throw new Error('Production requires HTTPS and a real Turnstile site key.');
}
