import { FormError, MAX_JSON_BYTES, requireThat } from './core.js';
const encoder = new TextEncoder();
const hex = value => Array.from(new Uint8Array(value), byte => byte.toString(16).padStart(2, '0')).join('');
export const digest = async value => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
export async function signature(secret, text) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(text)));
}
export async function verifySignature(secret, text, value) {
  if (!/^[0-9a-f]{64}$/.test(value || '')) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('HMAC', key, Uint8Array.from(value.match(/../g), x => parseInt(x, 16)), encoder.encode(text));
}
export function sameOrigin(request, env) {
  const url = new URL(request.url);
  requireThat(url.origin === env.SITE_ORIGIN, 'invalid_origin', 403);
  requireThat(request.headers.get('Origin') === env.SITE_ORIGIN && request.headers.get('X-Icarus-Form') === '1', 'invalid_origin', 403);
  requireThat(request.headers.get('Sec-Fetch-Site') !== 'cross-site', 'invalid_origin', 403);
}
export async function readJson(request) {
  requireThat(request.headers.get('Content-Type')?.split(';')[0] === 'application/json', 'invalid_content_type', 415);
  const declared = Number(request.headers.get('Content-Length'));
  requireThat(!declared || declared <= MAX_JSON_BYTES, 'request_too_large', 413);
  const reader = request.body?.getReader();
  requireThat(reader);
  const chunks = []; let length = 0;
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > MAX_JSON_BYTES) { await reader.cancel(); throw new FormError('request_too_large', 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new FormError('invalid_request'); }
}
export function configured(env) {
  return !!(env.DB && env.UPLOADS && env.RESEND_API_KEY && env.SIGNING_SECRET?.length >= 32
    && env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SITE_KEY !== 'SET_AFTER_SIGNUP'
    && /^https?:\/\//.test(env.SITE_ORIGIN || '') && env.MAIL_FROM && !/[\r\n]/.test(env.MAIL_FROM));
}
export async function verifyHuman(token, request, env) {
  requireThat(typeof token === 'string' && token.length > 0 && token.length <= 2048, 'verification_failed', 403);
  let response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') || undefined }),
    });
  } catch { throw new FormError('service_unavailable', 503); }
  requireThat(response.ok, 'service_unavailable', 503);
  const result = await response.json();
  requireThat(result.success === true && result.hostname === new URL(env.SITE_ORIGIN).hostname
    && result.action === 'icarus_form', 'verification_failed', 403);
}
