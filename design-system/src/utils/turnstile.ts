type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<void> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => window.turnstile ? resolve() : reject(new Error('verification_failed'));
    script.onerror = () => { script.remove(); reject(new Error('verification_failed')); };
    document.head.append(script);
  }).catch(error => { loading = undefined; throw error; });
  return loading;
}
export async function challengeToken(sitekey: string, element: HTMLElement | null, signal: AbortSignal, language: string) {
  if (!element) throw new Error('verification_failed');
  element.hidden = false;
  return new Promise<string>((resolve, reject) => {
    let widget: string | undefined;
    let settled = false;
    const finish = (token?: string) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener('abort', abort);
      if (widget) window.turnstile?.remove(widget);
      element.hidden = true;
      token ? resolve(token) : reject(new Error('verification_failed'));
    };
    const abort = () => finish();
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { finish(); return; }
    load().then(() => {
      if (settled) return;
      widget = window.turnstile!.render(element, {
        sitekey, action: 'icarus_form', theme: 'auto', language,
        appearance: 'interaction-only', size: 'flexible',
        callback: (token: string) => finish(token),
        'error-callback': () => finish(), 'expired-callback': () => finish(), 'timeout-callback': () => finish(),
      });
    }).catch(() => finish());
  });
}
