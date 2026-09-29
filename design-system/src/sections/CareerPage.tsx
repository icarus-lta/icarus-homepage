import { useEffect, useRef, useState } from 'react';
import { careerContent, careerRoles, type CareerSection } from '../i18n/career';
import { useLanguage } from '../i18n/language';
import { containerClass } from '../primitives/container';

function Chevron({ back = false }: { back?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={back ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'} stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function ShareIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" stroke="currentColor" strokeWidth="1.7" /><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" /><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.7" /><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.7" /></svg>;
}

function JobSection({ section }: { section: CareerSection }) {
  const id = `career-${section.id}`;
  return (
    <section className="ds-career-section" aria-labelledby={id}>
      <h2 id={id}>{section.heading}</h2>
      <div className="ds-career-section-content">
        {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.facts && <dl className="ds-career-facts">{section.facts.map(fact => (
          <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}{fact.note && <small className="ds-career-fact-note">{fact.note}</small>}</dd></div>
        ))}</dl>}
        {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
        {section.steps && <ol className="ds-career-steps" role="list">{section.steps.map((step, index, steps) => (
          <li key={step.title}>
            <div className="ds-career-step-node">
              <span className="ds-career-step-number" aria-hidden="true">{index + 1}</span>
              <h3>{step.title}</h3>
            </div>
            {index < steps.length - 1 && <span className="ds-career-step-connector" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m8 4 8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>}
          </li>
        ))}</ol>}
      </div>
    </section>
  );
}

/** Plain linked posts. Query URLs work on static hosting, including refresh and browser history. */
export function CareerPage() {
  const { language } = useLanguage();
  const copy = careerContent[language];
  const position = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('position');
  const role = careerRoles.find(item => item.id === position);
  const entry = role?.[language];
  const title = entry ? `${entry.title} — ICARUS LTA` : copy.metadata.title;
  const description = entry?.introduction ?? copy.metadata.description;
  const introductionParagraphs = entry ? (entry.introductionParagraphs ?? [entry.introduction]) : [];
  const [shareStatus, setShareStatus] = useState('');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const sharePending = useRef(false);
  const topActionsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const applyHref = `/career/apply/?position=${role?.id}&lang=${language}`;

  useEffect(() => {
    if (!shareStatus) return;
    const timeout = window.setTimeout(() => setShareStatus(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  useEffect(() => {
    const topActions = topActionsRef.current;
    setShowStickyBar(false);
    if (!topActions) return;
    const mobile = window.matchMedia('(max-width: 767px)');
    let observer: IntersectionObserver;
    const observeActions = () => {
      observer?.disconnect();
      // The fixed site navigation is 64px on mobile and 80px on desktop.
      const topInset = mobile.matches ? 64 : 80;
      observer = new IntersectionObserver(([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.bottom <= topInset);
      }, { rootMargin: `-${topInset}px 0px 0px 0px`, threshold: 0 });
      observer.observe(topActions);
    };
    observeActions();
    mobile.addEventListener('change', observeActions);
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', observeActions);
    };
  }, [role?.id]);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const previousPadding = document.body.style.paddingBottom;
    const previousScrollPadding = document.documentElement.style.scrollPaddingBottom;
    const reserveSpace = () => {
      const height = `${bar.getBoundingClientRect().height}px`;
      document.body.style.paddingBottom = height;
      document.documentElement.style.scrollPaddingBottom = height;
    };
    reserveSpace();
    const observer = new ResizeObserver(reserveSpace);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = previousPadding;
      document.documentElement.style.scrollPaddingBottom = previousScrollPadding;
    };
  }, [role?.id]);

  async function shareJob() {
    if (!entry || !role || sharePending.current) return;
    sharePending.current = true;
    const url = new URL(`/career/?position=${role.id}&lang=${language}`, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus(copy.copied);
    } catch {
      setShareStatus(copy.copyFailed);
    } finally {
      sharePending.current = false;
    }
  }

  const actions = (top = false) => <div ref={top ? topActionsRef : undefined} className="ds-career-actions">
    <button className="ds-career-action ds-career-share" type="button" onClick={shareJob}><ShareIcon />{copy.share}</button>
    <a className="ds-career-action ds-career-apply" href={applyHref}>{copy.apply}<Chevron /></a>
  </div>;

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [title, description]);

  return (
    <main className="ds-career" lang={language}>
      <div className={`${containerClass} ds-career-inner${entry ? ' ds-career-detail' : ''}`}>
        {entry ? (
          <>
            <a className="ds-career-back" href={`/career/?lang=${language}`}><Chevron back />{copy.back}</a>
            <article>
              <header className="ds-career-post-head">
                <h1>{entry.title}</h1>
                {actions(true)}
              </header>
              <div className={`ds-career-body${entry.sections ? ' ds-career-body--full' : ''}`}>
                <section className="ds-career-overview" aria-labelledby="career-overview">
                  <h2 id="career-overview">{entry.introductionHeading ?? copy.overview}</h2>
                  {entry.introductionMission ? (
                    <>
                      <div className="ds-career-mission">
                        <p className="ds-career-mission-title"><strong>Mission | {entry.introductionMission}</strong></p>
                        <p>{introductionParagraphs[0]}</p>
                      </div>
                      {introductionParagraphs.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    </>
                  ) : introductionParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </section>
                {entry.sections ? entry.sections.map(section => <JobSection key={section.id} section={section} />) : <section aria-labelledby="career-tasks">
                  <h2 id="career-tasks">{copy.tasks}</h2>
                  <ul>{entry.tasks?.map(task => <li key={task}>{task}</li>)}</ul>
                </section>}
                {entry.contact ? (
                  <section className="ds-career-contact" aria-labelledby="career-contact">
                    <h2 id="career-contact">{entry.contact.heading}</h2>
                    <ul>{entry.contact.bullets.map(item => <li key={item}>{item}</li>)}</ul>
                    <p className="ds-career-contact-person">{entry.contact.name}</p>
                    <a href={`mailto:${entry.contact.email}`}>{entry.contact.email}</a>
                  </section>
                ) : !entry.sections ? <p className="ds-career-notice">{copy.notice}</p> : null}
              </div>
            </article>
          </>
        ) : (
          <>
            <header className="ds-career-head">
              <h1>{copy.heading}</h1>
              <p>{copy.introduction}</p>
            </header>
            <div className="ds-career-list-label">{copy.all}<span>{careerRoles.length}</span></div>
            <ul className="ds-career-list" aria-label={copy.heading}>
              {careerRoles.map(item => (
                <li key={item.id}>
                  <a className="ds-career-post" href={`/career/?position=${item.id}&lang=${language}`}>
                    <div>
                      <h2>{item[language].title}</h2>
                    </div>
                    <span className="ds-career-deadline">{copy.deadline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {entry && <div ref={barRef} className={`ds-career-sticky-bar${showStickyBar ? ' is-visible' : ''}`} role="region" aria-label={copy.actions} aria-hidden={!showStickyBar} inert={!showStickyBar}>
        <div className={`${containerClass} ds-career-sticky-inner`}>
          <p className="ds-career-sticky-title">{entry.title}</p>
          {actions()}
        </div>
      </div>}
      <div className={`ds-career-share-status${shareStatus ? ' is-visible' : ''}`} role="status" aria-live="polite">{shareStatus}</div>
    </main>
  );
}
