// Portable validation / message composition: no Cloudflare imports or bindings.
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_JSON_BYTES = 24 * 1024;
export const RECIPIENT = 'contact@icarus-airship.com';
export const SESSION_SECONDS = 3600;
export const RETENTION_SECONDS = 86400;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}$/;
export class FormError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
export function requireThat(condition, code = 'invalid_request', status = 400) {
  if (!condition) throw new FormError(code, status);
}
export function validateForm(kind, input, roles) {
  requireThat(input && typeof input === 'object' && !Array.isArray(input));
  const application = kind === 'applications';
  const allowed = ['name', 'email', 'language', 'website', ...(application
    ? ['phone', 'position', 'positionTitle', 'portfolioUrl', 'message', 'consent', 'files']
    : ['subject', 'message'])];
  requireThat(Object.keys(input).every(key => allowed.includes(key)), 'invalid_fields');
  const field = (key, max, required = true, multiline = false) => {
    requireThat(input[key] === undefined || typeof input[key] === 'string', 'invalid_field');
    const value = (input[key] || '').trim();
    requireThat(value.length <= max && (!required || value.length > 0)
      && !(multiline ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value), 'invalid_field');
    return value;
  };
  const data = { name: field('name', 100), email: field('email', 254), language: field('language', 2) };
  requireThat(EMAIL.test(data.email), 'invalid_email');
  requireThat(['ko', 'en'].includes(data.language), 'invalid_field');
  requireThat(!field('website', 200, false));
  data.message = field('message', 5000, !application, true);
  const files = {};
  if (application) {
    data.position = field('position', 100);
    requireThat(Object.hasOwn(roles, data.position), 'invalid_position');
    data.positionTitle = roles[data.position][data.language];
    data.phone = field('phone', 30);
    requireThat(/^[+\d\s().-]+$/.test(data.phone) && /^\d{7,15}$/.test(data.phone.replace(/\D/g, '')), 'invalid_phone');
    requireThat(['on', 'true'].includes(field('consent', 8)), 'consent_required');
    data.portfolioUrl = field('portfolioUrl', 2000, false);
    if (data.portfolioUrl) {
      let link; try { link = new URL(data.portfolioUrl); } catch { throw new FormError('invalid_link'); }
      requireThat(['http:', 'https:'].includes(link.protocol) && !!link.hostname, 'invalid_link');
    }
    requireThat(input.files && typeof input.files === 'object' && !Array.isArray(input.files), 'required_file');
    requireThat(Object.keys(input.files).every(slot => ['resume', 'portfolio'].includes(slot)), 'invalid_files');
    requireThat(!!input.files.resume, 'required_file');
    for (const slot of ['resume', 'portfolio']) {
      const file = input.files[slot];
      if (!file) continue;
      requireThat(typeof file.name === 'string' && file.name.length > 0 && file.name.length <= 180
        && !/[\x00-\x1f\x7f/\\]/.test(file.name), 'invalid_file');
      const extension = file.name.split('.').pop().toLowerCase();
      requireThat(extension === 'pdf', 'invalid_file');
      requireThat(Number.isSafeInteger(file.size) && file.size > 0, 'required_file');
      requireThat(file.size <= MAX_FILE_BYTES, 'file_too_large', 413);
      files[slot] = { name: file.name, size: file.size, extension };
    }
  } else data.subject = field('subject', 160);
  return { data, files };
}
export function composeMail(kind, data, id, attachments, from) {
  const application = kind === 'applications';
  const lines = [`이름 / Name: ${data.name}`, `이메일 / Email: ${data.email}`, `언어 / Language: ${data.language}`];
  if (application) lines.push(`연락처 / Phone: ${data.phone}`, `지원 직무 / Position: ${data.positionTitle} (${data.position})`,
    '개인정보 수집·이용 동의 / Privacy consent: 동의 / Agreed', `포트폴리오 링크 / Portfolio URL: ${data.portfolioUrl || '-'}`);
  else lines.push(`제목 / Subject: ${data.subject}`);
  lines.push('', '내용 / Message:', data.message || '-', '', `접수 번호 / Submission: ${id}`);
  return {
    from, to: [RECIPIENT], reply_to: data.email,
    subject: application ? `[ICARUS 채용 지원] ${data.positionTitle} — ${data.name}` : `[ICARUS 문의] ${data.subject}`,
    text: lines.join('\n'), ...(attachments.length ? { attachments } : {}),
  };
}
