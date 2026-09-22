import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { companyContactEmail, contactContent } from '../i18n/contact';
import { useLanguage } from '../i18n/language';
import { containerClass } from '../primitives/container';

type Fields = { email: string; subject: string; message: string };
type Field = keyof Fields;
type FieldError = 'required' | 'email';
const emptyFields: Fields = { email: '', subject: '', message: '' };

export interface ContactPageProps {
  email?: string;
  /** Public form-service URL accepting email, subject, message and language as FormData. */
  submitUrl?: string;
}

export function ContactPage({ email = companyContactEmail, submitUrl }: ContactPageProps) {
  const { language } = useLanguage();
  const copy = contactContent[language];
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Record<Field, FieldError>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed' | 'preview'>('idle');
  const pendingRequest = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = copy.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.metadata.description);
  }, [copy.metadata]);
  useEffect(() => () => pendingRequest.current?.abort(), []);
  useEffect(() => { if (status === 'sent') resultRef.current?.focus(); }, [status]);

  const updateField = (field: Field, value: string) => {
    setFields(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    if (status === 'failed' || status === 'preview') setStatus('idle');
  };

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pendingRequest.current) return;
    const values = { email: fields.email.trim(), subject: fields.subject.trim(), message: fields.message.trim() };
    const nextErrors: Partial<Record<Field, FieldError>> = {};
    for (const field of ['email', 'subject', 'message'] as const) {
      if (!values[field]) nextErrors[field] = 'required';
    }
    const emailInput = event.currentTarget.elements.namedItem('email') as HTMLInputElement;
    if (values.email && (!emailInput.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))) nextErrors.email = 'email';
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }
    if (!submitUrl) {
      setStatus('preview');
      return;
    }
    const controller = new AbortController();
    pendingRequest.current = controller;
    setStatus('sending');
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(values)) body.append(key, value);
      body.append('language', language);
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Submission not accepted');
      setStatus('sent');
      setFields(emptyFields);
    } catch {
      setStatus('failed');
    } finally {
      window.clearTimeout(timeout);
      pendingRequest.current = null;
    }
  };

  return (
    <main className="ds-contact-page" lang={language}>
      <section className={`${containerClass} ds-contact-intro`} aria-labelledby="contact-title">
        <div className="ds-contact-heading">
          <h1 id="contact-title">{copy.title}</h1>
          <p className="ds-contact-description">{copy.description}</p>
          <a className="ds-contact-email" href={`mailto:${email}`}><span>{email}</span><span aria-hidden="true">↗</span></a>
        </div>
        <div className="ds-contact-form-wrap">
          {status === 'sent' ? (
            <div className="ds-contact-success" role="status" tabIndex={-1} ref={resultRef}>
              <span className="ds-contact-success-mark" aria-hidden="true">✓</span>
              <h2>{copy.successTitle}</h2>
              <p>{copy.successDescription}</p>
              <button type="button" className="ds-contact-submit" onClick={() => setStatus('idle')}>{copy.another}</button>
            </div>
          ) : (
            <form className="ds-contact-form" onSubmit={submitInquiry} noValidate aria-busy={status === 'sending'}>
              <p className="ds-contact-required-note"><span aria-hidden="true">*</span> {copy.requiredNote}</p>
              {(['email', 'subject', 'message'] as const).map(field => {
                const fieldCopy = copy.fields[field];
                const error = errors[field];
                const shared = {
                  id: `contact-${field}`,
                  name: field,
                  required: true,
                  value: fields[field],
                  placeholder: fieldCopy.placeholder,
                  disabled: status === 'sending',
                  'aria-invalid': error ? true : undefined,
                  'aria-describedby': error ? `contact-${field}-error` : undefined,
                  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(field, event.target.value),
                };
                return (
                  <div className="ds-contact-field" key={field}>
                    <label htmlFor={shared.id}>{fieldCopy.label} <span aria-hidden="true">*</span></label>
                    {field === 'message' ? <textarea {...shared} rows={5} maxLength={5000} /> : <input {...shared} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'email' ? 'email' : 'off'} maxLength={field === 'email' ? 254 : 160} />}
                    {error && <p className="ds-contact-field-error" id={`contact-${field}-error`}>{error === 'email' ? copy.invalidEmail : fieldCopy.required}</p>}
                  </div>
                );
              })}
              <div className="ds-contact-form-bottom">
                <p>{copy.replyNote}</p>
                <button className="ds-contact-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy.sending : copy.submit}<span aria-hidden="true">↗</span></button>
              </div>
              {status === 'preview' && <p className="ds-contact-preview-note" role="status">{copy.previewNotice}</p>}
              {status === 'failed' && <p className="ds-contact-submit-error" role="alert">{copy.failure} <a href={`mailto:${email}`}>{email}</a></p>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
