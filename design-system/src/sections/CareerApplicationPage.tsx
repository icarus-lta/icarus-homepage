import { useEffect, useRef, useState, type FormEvent } from 'react';
import { careerRoles } from '../i18n/career';
import { careerApplicationContent } from '../i18n/careerApplication';
import { useLanguage } from '../i18n/language';
import { containerClass } from '../primitives/container';
import { newSubmissionId, submitForm } from '../utils/submitForm';
import { submissionMessage } from '../i18n/submission';

export interface CareerApplicationPageProps {
  /** Same-origin endpoint; empty string enables a design preview. */
  submitUrl?: string;
  /** Optional replacement for the built-in API integration. */
  onSubmitApplication?: (application: FormData) => Promise<void>;
}

type Field = 'name' | 'email' | 'phone' | 'resume' | 'portfolio' | 'portfolioUrl' | 'consent';
type Errors = Partial<Record<Field, string>>;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function CareerApplicationPage({ onSubmitApplication, submitUrl = '/api/applications' }: CareerApplicationPageProps) {
  const { language } = useLanguage();
  const copy = careerApplicationContent[language];
  const position = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('position');
  const role = careerRoles.find(item => item.id === position);
  const entry = role?.[language];
  const [errors, setErrors] = useState<Errors>({});
  const [files, setFiles] = useState<Partial<Record<'resume' | 'portfolio', File>>>({});
  const [status, setStatus] = useState<'idle' | 'preview' | 'sending' | 'sent' | 'failed'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const pendingRequest = useRef<AbortController | null>(null);
  const submissionId = useRef<string | null>(null);
  const [failureMessage, setFailureMessage] = useState('');
  const backHref = role ? `/career/?position=${role.id}&lang=${language}` : `/career/?lang=${language}`;

  useEffect(() => {
    document.title = `${copy.title}${entry ? ` · ${entry.title}` : ''} — ICARUS LTA`;
  }, [copy.title, entry]);

  useEffect(() => {
    if (status === 'preview' || status === 'sent' || status === 'failed') resultRef.current?.focus();
  }, [status]);
  useEffect(() => () => pendingRequest.current?.abort(), []);
  useEffect(() => { submissionId.current = null; }, [language]);

  function markEdited() {
    submissionId.current = null;
    setStatus('idle');
  }

  function fileError(file: File | undefined, field: 'resume' | 'portfolio') {
    if (!file || file.size === 0) return field === 'resume' ? copy.missingResume : undefined;
    if (file.size > MAX_FILE_SIZE) return copy.tooLarge;
    const allowed = field === 'resume' ? /\.(pdf|doc|docx)$/i : /\.pdf$/i;
    if (!allowed.test(file.name)) return field === 'resume' ? copy.invalidResume : copy.invalidPortfolio;
    return undefined;
  }

  function changeFile(field: 'resume' | 'portfolio', file?: File) {
    setFiles(previous => ({ ...previous, [field]: file }));
    setErrors(previous => ({ ...previous, [field]: file ? fileError(file, field) : undefined }));
    markEdited();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role || pending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (field: string) => String(data.get(field) ?? '').trim();
    const nextErrors: Errors = {};
    if (!value('name')) nextErrors.name = copy.missing;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) nextErrors.email = copy.invalidEmail;
    const digits = value('phone').replace(/\D/g, '');
    if (!/^[+\d\s().-]+$/.test(value('phone')) || digits.length < 7 || digits.length > 15) nextErrors.phone = copy.invalidPhone;
    nextErrors.resume = fileError(files.resume, 'resume');
    nextErrors.portfolio = fileError(files.portfolio, 'portfolio');
    if (value('portfolioUrl')) {
      try {
        const url = new URL(value('portfolioUrl'));
        if (!['https:', 'http:'].includes(url.protocol)) nextErrors.portfolioUrl = copy.invalidLink;
      } catch { nextErrors.portfolioUrl = copy.invalidLink; }
    }
    if (!data.has('consent')) nextErrors.consent = copy.consentRequired;
    setErrors(nextErrors);
    const firstError = (Object.keys(nextErrors) as Field[]).find(field => nextErrors[field]);
    if (firstError) {
      setStatus('idle');
      form.querySelector<HTMLInputElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    if (!onSubmitApplication && !submitUrl) {
      setStatus('preview');
      return;
    }
    data.set('position', role.id);
    data.set('positionTitle', entry!.title);
    data.set('language', language);
    for (const field of ['name', 'email', 'phone', 'portfolioUrl', 'message']) data.set(field, value(field));
    pending.current = true;
    const controller = new AbortController();
    pendingRequest.current = controller;
    setStatus('sending');
    try {
      submissionId.current ??= newSubmissionId();
      if (onSubmitApplication) await onSubmitApplication(data);
      else await submitForm(submitUrl, data, submissionId.current, controller.signal);
      setStatus('sent');
      setFiles({});
      submissionId.current = null;
    } catch (error) {
      setFailureMessage(submissionMessage(error, language, copy.failed));
      setStatus('failed');
    } finally {
      pending.current = false;
      pendingRequest.current = null;
    }
  }

  const error = (field: Field) => errors[field] ? <p id={`application-${field}-error`} className="ds-application-error">{errors[field]}</p> : null;
  const fieldProps = (field: Field) => ({
    id: `application-${field}`, name: field,
    'aria-invalid': errors[field] ? true as const : undefined,
    'aria-describedby': errors[field] ? `application-${field}-error` : undefined,
    onChange: () => {
      setErrors(previous => ({ ...previous, [field]: undefined }));
      markEdited();
    },
  });

  const upload = (field: 'resume' | 'portfolio') => <div className="ds-application-field">
    <label htmlFor={`application-${field}`}>{copy[field]}{field === 'resume' ? <span aria-hidden="true"> *</span> : <small>{copy.optional}</small>}</label>
    <p id={`application-${field}-help`} className="ds-application-help">{field === 'resume' ? copy.resumeHelp : copy.portfolioHelp}</p>
    <div className={`ds-application-upload${errors[field] ? ' has-error' : ''}`}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <input id={`application-${field}`} name={field} type="file" accept={field === 'resume' ? '.pdf,.doc,.docx' : '.pdf'} required={field === 'resume'}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={`application-${field}-help${errors[field] ? ` application-${field}-error` : ''}`}
        onChange={event => changeFile(field, event.target.files?.[0])} />
      {files[field] && <button type="button" className="ds-application-remove" aria-label={`${copy[field]} ${copy.remove}`} onClick={() => {
        const input = formRef.current?.elements.namedItem(field) as HTMLInputElement | null;
        if (input) input.value = '';
        changeFile(field);
      }}>{copy.remove}</button>}
    </div>
    {error(field)}
  </div>;

  return <main className="ds-career ds-application" lang={language}>
    <div className={`${containerClass} ds-career-inner ds-application-inner`}>
      <a className="ds-career-back" href={backHref}><span aria-hidden="true">‹</span>{entry ? copy.back : copy.browse}</a>
      {!entry ? <h1>{copy.unavailable}</h1> : <>
        <header className="ds-application-head">
          <p className="ds-application-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="ds-application-intro">{copy.intro}</p>
          <div className="ds-application-role"><span>{copy.role}</span><h2>{entry.title}</h2></div>
        </header>
        {status === 'sent' ? <div ref={resultRef} tabIndex={-1} className="ds-application-result" role="status">
          <h2>{copy.successTitle}</h2><p>{copy.success}</p><a className="ds-career-action" href={`/career/?lang=${language}`}>{copy.browse}</a>
        </div> : <form ref={formRef} onSubmit={submit} noValidate className="ds-application-form" aria-busy={status === 'sending'}>
          <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <p className="ds-application-required"><span aria-hidden="true">*</span> {copy.required}</p>
          <fieldset disabled={status === 'sending'}>
            <legend><span aria-hidden="true">01</span>{copy.basic}</legend>
            <div className="ds-application-fields">
              <div className="ds-application-field ds-application-name"><label htmlFor="application-name">{copy.name}<span aria-hidden="true"> *</span></label><input {...fieldProps('name')} autoComplete="name" required maxLength={100} placeholder={copy.namePlaceholder} />{error('name')}</div>
              <div className="ds-application-field"><label htmlFor="application-email">{copy.email}<span aria-hidden="true"> *</span></label><input {...fieldProps('email')} type="email" autoComplete="email" required maxLength={254} placeholder={copy.emailPlaceholder} />{error('email')}</div>
              <div className="ds-application-field"><label htmlFor="application-phone">{copy.phone}<span aria-hidden="true"> *</span></label><input {...fieldProps('phone')} type="tel" autoComplete="tel" required maxLength={30} placeholder={copy.phonePlaceholder} />{error('phone')}</div>
            </div>
          </fieldset>
          <fieldset disabled={status === 'sending'}>
            <legend><span aria-hidden="true">02</span>{copy.documents}</legend>
            {upload('resume')}{upload('portfolio')}
            <div className="ds-application-field"><label htmlFor="application-portfolioUrl">{copy.link}<small>{copy.optional}</small></label><input {...fieldProps('portfolioUrl')} type="url" maxLength={2000} placeholder={copy.linkPlaceholder} />{error('portfolioUrl')}</div>
            <div className="ds-application-field"><label htmlFor="application-message">{copy.message}<small>{copy.optional}</small></label><textarea id="application-message" name="message" rows={5} maxLength={5000} placeholder={copy.messagePlaceholder} onChange={markEdited} /></div>
          </fieldset>
          <fieldset disabled={status === 'sending'}>
            <legend><span aria-hidden="true">03</span>{copy.privacy}</legend>
            <div className="ds-application-privacy"><p>{copy.privacyDetail}</p><label htmlFor="application-consent"><input {...fieldProps('consent')} type="checkbox" required /><span>{copy.consent}<span aria-hidden="true"> *</span></span></label></div>
            {error('consent')}
          </fieldset>
          <div className="ds-application-submit-row"><p>{copy.review}</p><button className="ds-career-action ds-career-apply" type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy.sending : copy.submit}<span aria-hidden="true">→</span></button></div>
          {(status === 'preview' || status === 'failed') && <div ref={resultRef} tabIndex={-1} className="ds-application-result" role={status === 'failed' ? 'alert' : 'status'}>{status === 'preview' ? <><h2>{copy.previewTitle}</h2><p>{copy.preview}</p></> : <p>{failureMessage}</p>}</div>}
        </form>}
      </>}
    </div>
  </main>;
}
