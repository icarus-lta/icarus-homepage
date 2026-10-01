import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { aboutContent } from '../i18n/about';
import { useLanguage } from '../i18n/language';
import { containerClass } from '../primitives/container';
import { AboutLocationsMap } from './AboutLocationsMap';

export interface AboutPageProps {
  /** Public URLs; serve the supplied film separately from the component bundle. */
  videoSrc?: string;
  posterSrc?: string;
  /** Flight-control simulation shown by the second Why ICARUS card. */
  controlVideoSrc?: string;
  controlPosterSrc?: string;
  /** Envelope-material footage shown by the third Why ICARUS card. */
  materialVideoSrc?: string;
  materialPosterSrc?: string;
  /** Replace the provisional development photograph with an early company photograph. */
  controlImageSrc?: string;
}

function Lines({ text }: { text: string }) {
  return <>{text.split('\n').map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}</>;
}

function HistoryText({ text }: { text: string }) {
  // Long program names read as supporting information. Keep short qualifiers
  // such as (예비) in the sentence, and preserve the full wording in both cases.
  const program = text.match(/^(.*?)\(([^()]{12,})\)\s*(.*)$/);
  if (!program) return <>{text}</>;
  return <><span className="ds-about-history-summary">{[program[1].trim(), program[3].trim()].filter(Boolean).join(' ')}</span>
    <span className="ds-about-history-detail">({program[2]})</span></>;
}

function ChapterHeading({ number, title, id }: { number: string; title: string; id: string }) {
  const [keyword, ...rest] = title.trim().split(/\s+/);
  return (
    <div className="ds-about-chapter-heading">
      <span className="ds-about-chapter-number" aria-hidden="true">{number}</span>
      <h2 id={id} className="ds-about-chapter-title" lang="en">
        <strong className="ds-about-chapter-keyword">{keyword}</strong>{' '}<span>{rest.join(' ')}</span>
      </h2>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↘</span>;
}

/** ICARUS in four chapters: what we do, why us, when we started, and where we are. */
export function AboutPage({
  videoSrc = '/media/about-flight.mp4',
  posterSrc = '/media/about-flight-poster.jpg',
  controlVideoSrc = '/media/about-control.mp4?v=20',
  controlPosterSrc = '/media/about-control-poster.webp?v=20',
  materialVideoSrc = '/media/about-material-research-landscape.mp4',
  materialPosterSrc = '/media/about-material-research-landscape-poster.webp',
  controlImageSrc = '/media/about-field-team-source.png',
}: AboutPageProps) {
  const { language } = useLanguage();
  const copy = aboutContent[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const whyVisualRef = useRef<HTMLElement>(null);
  const cfdRef = useRef<HTMLVideoElement>(null);
  const controlRef = useRef<HTMLVideoElement>(null);
  const materialRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  /** The Why ICARUS card whose visual is showing. */
  const [strength, setStrength] = useState(0);
  const strengthsRef = useRef<HTMLDivElement>(null);
  const strengthIndicatorRef = useRef<HTMLSpanElement>(null);

  // One capsule follows the selected card, including changes to translated text and viewport size.
  useLayoutEffect(() => {
    const stack = strengthsRef.current;
    const indicator = strengthIndicatorRef.current;
    if (!stack || !indicator) return;
    let disposed = false;
    let frame = 0;
    let readyFrame = 0;
    const measure = () => {
      frame = 0;
      if (disposed) return;
      const active = stack.querySelector<HTMLElement>('.ds-about-strength.is-active');
      if (!active) return;
      // offsetTop ignores the moving card's transform; its final lift is -3px.
      indicator.style.height = `${Math.max(36, active.offsetHeight - 32)}px`;
      indicator.style.transform = `translateY(${active.offsetTop + 13}px)`;
      if (!indicator.dataset.ready && !readyFrame) {
        readyFrame = requestAnimationFrame(() => {
          readyFrame = 0;
          if (!disposed) indicator.dataset.ready = 'true';
        });
      }
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(stack);
    stack.querySelectorAll('.ds-about-strength').forEach(card => observer.observe(card));
    void document.fonts.ready.then(schedule);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(readyFrame);
    };
  }, [strength, language]);

  // Why ICARUS: only the chosen card's film plays, and only while the chapter is on screen.
  useEffect(() => {
    const figure = whyVisualRef.current;
    if (!figure) return;
    const films = [cfdRef.current, controlRef.current, materialRef.current];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncPlayback = () => {
      films.forEach((film, i) => {
        if (!film) return;
        if (i === strength && visible && !document.hidden && !reduced.matches) {
          void film.play().catch(() => {});
        } else {
          film.pause();
        }
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(figure);
    reduced.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      films.forEach(film => film?.pause());
    };
  }, [strength]);

  useEffect(() => {
    document.title = copy.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.metadata.description);
  }, [copy.metadata]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    const syncPlayback = () => {
      if (visible && !document.hidden && !reduced.matches && !manuallyPaused.current) {
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    reduced.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manuallyPaused.current = false;
      void video.play().catch(() => setPlaying(false));
    } else {
      manuallyPaused.current = true;
      video.pause();
    }
  };

  return (
    <main className="ds-about" lang={language}>
      <section className="ds-about-hero" aria-labelledby="about-title">
        <img className="ds-about-hero-media" src={posterSrc} alt="" draggable={false} fetchPriority="high" />
        <video
          ref={videoRef}
          className="ds-about-hero-media"
          src={videoSrc}
          poster={posterSrc}
          draggable={false}
          muted loop playsInline preload="metadata"
          aria-hidden="true"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setVideoFailed(true)}
        />
        <div className="ds-about-hero-shade" />
        <div className={`${containerClass} ds-about-hero-content`}>
          <div className="ds-about-hero-topline">
            <p className="ds-about-kicker">{copy.hero.label}</p>
            <p className="ds-about-location">{copy.hero.location}</p>
          </div>
          <div className="ds-about-hero-copy">
            <h1 id="about-title"><Lines text={copy.hero.title} /></h1>
            <p><strong className="font-semibold"><Lines text={copy.hero.description} /></strong></p>
            <div className="ds-about-film-spacer" aria-hidden="true" />
          </div>
          <div className="ds-about-hero-bottom">
            <a href="#what-we-do" className="ds-about-scroll">{copy.hero.discover} <Arrow /></a>
            <div className="ds-about-video-caption">
              <span>{copy.film.caption}</span>
              <button type="button" onClick={togglePlayback} disabled={videoFailed}
                aria-label={playing ? copy.film.pause : copy.film.play}
                className="ds-about-video-control">
                <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Copy alternates left / right / left / right down the page. The --how / --what /
          --why / --where modifiers are tuned to the media each chapter carries. */}

      <section id="what-we-do" className="ds-about-chapter ds-about-chapter--how is-reversed" aria-labelledby="what-title">
        <div className={`${containerClass} ds-about-chapter-inner`}>
          <ChapterHeading number="01" title={copy.what.title} id="what-title" />
          <div className="ds-about-chapter-body">
            <figure className="ds-about-chapter-visual" onDragStart={event => event.preventDefault()}>
              <img src={controlImageSrc} alt={copy.what.imageAlt} draggable={false} loading="lazy" />
              <figcaption>{copy.what.imageCaption}</figcaption>
            </figure>
            <div className="ds-about-chapter-copy">
              <p className="ds-about-chapter-lead ds-about-chapter-claims">
                {copy.what.claims.map(claim => (
                  <span key={claim.text} className="ds-about-chapter-claim"><strong>{claim.only}</strong> {claim.text}</span>
                ))}
              </p>
              <p className="ds-about-chapter-description">
                {copy.what.description.split('\n').map(part => <span key={part}>{part}</span>)}
              </p>
              <div className="ds-about-capabilities">
                {copy.what.points.map((point, i) => (
                  <article key={point.title} className="ds-about-capability">
                    <span className="ds-about-capability-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{point.title}</h3>
                    <p>{point.description.split('\n').map(line => <span key={line}>{line}</span>)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="ds-about-chapter ds-about-chapter--what" aria-labelledby="why-title">
        <div className={`${containerClass} ds-about-chapter-inner`}>
          <ChapterHeading number="02" title={copy.why.title} id="why-title" />
          <div className="ds-about-chapter-body">
            {/* One film per card; the selected layer fades in while the others pause. */}
            <figure id="why-visual" ref={whyVisualRef} className="ds-about-chapter-visual is-framed-active" onDragStart={event => event.preventDefault()}>
              <div className={`ds-about-why-media ds-about-cfd-viewport ds-about-framed-viewport${strength === 0 ? ' is-active' : ''}`} aria-hidden={strength !== 0}>
                <video ref={cfdRef} src="/media/about-cfd-clean.mp4" poster="/media/about-cfd-clean-poster.webp"
                  muted loop playsInline preload="none" draggable={false} width="800" height="450" aria-label={copy.why.points[0].visual} />
              </div>
              <div className={`ds-about-why-media ds-about-control-viewport ds-about-framed-viewport${strength === 1 ? ' is-active' : ''}`} aria-hidden={strength !== 1}>
                <video ref={controlRef} src={controlVideoSrc} poster={controlPosterSrc}
                  muted loop playsInline preload="none" draggable={false} width="1440" height="810" aria-label={copy.why.points[1].visual} />
              </div>
              <div className={`ds-about-why-media ds-about-material-viewport ds-about-framed-viewport${strength === 2 ? ' is-active' : ''}`} aria-hidden={strength !== 2}>
                <video ref={materialRef} src={materialVideoSrc} poster={materialPosterSrc}
                  muted loop playsInline preload="none" draggable={false} width="1280" height="720" aria-label={copy.why.points[2].visual} />
              </div>
              <figcaption>{copy.why.points[strength].caption}</figcaption>
            </figure>
            <div className="ds-about-chapter-copy">
              <div ref={strengthsRef} className="ds-about-strengths" onKeyDown={event => {
                if (event.defaultPrevented || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
                const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('.ds-about-strength-button'));
                const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
                if (current < 0) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
                  : (current + (event.key === 'ArrowDown' ? 1 : buttons.length - 1)) % buttons.length;
                buttons[next].focus({ preventScroll: true });
                setStrength(next);
              }}>
                {copy.why.points.map((point, i) => (
                  <article key={point.title} className={`ds-about-strength${i === strength ? ' is-active' : ''}`}>
                    <h3>
                      <button type="button" className="ds-about-strength-button" aria-pressed={i === strength}
                        aria-controls="why-visual" onClick={() => setStrength(i)}>
                        <span className="ds-about-strength-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        {point.title}
                      </button>
                    </h3>
                    <p className="ds-about-strength-text">{point.description}</p>
                  </article>
                ))}
                <span className="ds-about-strength-track" aria-hidden="true" />
                <span ref={strengthIndicatorRef} className="ds-about-strength-indicator" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="when-we-start" className="ds-about-chapter ds-about-chapter--when is-reversed" aria-labelledby="when-title">
        <div className={`${containerClass} ds-about-chapter-inner`}>
          <ChapterHeading number="03" title={copy.when.title} id="when-title" />
          <div className="ds-about-chapter-body">
            <div className="ds-about-chapter-copy">
              <ol className="ds-about-history" data-year-count={copy.when.history.length}>
                {copy.when.history.map((year, i, years) => (
                  <li key={year.year} className={`ds-about-history-year${i === years.length - 1 ? ' is-current' : ''}`}
                    aria-current={i === years.length - 1 ? 'date' : undefined}>
                    <span className="ds-about-history-marker" aria-hidden="true" />
                    <h3>{year.year}</h3>
                    <ul>
                      {year.entries.map(entry => (
                        <li key={entry.text}>
                          {entry.date && <span className="ds-about-history-date">{entry.date}</span>}
                          <span className="ds-about-history-text"><HistoryText text={entry.text} /></span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="where-are-we" className="ds-about-chapter ds-about-chapter--where" aria-labelledby="where-title">
        <div className={`${containerClass} ds-about-chapter-inner`}>
          <ChapterHeading number="04" title={copy.where.title} id="where-title" />
          <div className="ds-about-chapter-body">
            <div className="ds-about-chapter-visual ds-about-chapter-map">
              <AboutLocationsMap labels={copy.where.places.map(place => place.name)} />
            </div>
            <div className="ds-about-chapter-copy">
              <div className="ds-about-chapter-places">
                {copy.where.places.map((place, index) => (
                  <article key={place.english} className="ds-about-chapter-place">
                    <div className="ds-about-chapter-place-heading">
                      <h3>{place.name}</h3>
                      <span className={`ds-about-chapter-status${index === 2 ? ' is-planned' : ''}`}><i aria-hidden="true" />{place.status}</span>
                    </div>
                    <div className="ds-about-chapter-place-details">
                      <p className="ds-about-chapter-place-role">{place.role}</p>
                      <p className="ds-about-chapter-place-description">{place.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
