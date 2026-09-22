import { Fragment, useEffect, useRef, useState } from 'react';
import { images } from '../assets';
import { aboutContent } from '../i18n/about';
import { useLanguage } from '../i18n/language';
import { containerClass } from '../primitives/container';
import { AboutLocationsMap } from './AboutLocationsMap';

export interface AboutPageProps {
  /** Public URLs; serve the supplied film separately from the component bundle. */
  videoSrc?: string;
  posterSrc?: string;
  /** Replace the provisional development photograph with an early company photograph. */
  controlImageSrc?: string;
}

function Lines({ text }: { text: string }) {
  return <>{text.split('\n').map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}</>;
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

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '↘'}</span>;
}

/** ICARUS in four chapters: what we do, why us, when we started, and where we are. */
export function AboutPage({
  videoSrc = '/media/about-flight.mp4',
  posterSrc = '/media/about-flight-poster.jpg',
  controlImageSrc = '/media/about-field-team-source.png',
}: AboutPageProps) {
  const { language } = useLanguage();
  const copy = aboutContent[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const cfdRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = cfdRef.current;
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden && !reduced.matches) {
        void video.play().catch(() => {});
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
        <img className="ds-about-hero-media" src={posterSrc} alt="" fetchPriority="high" />
        <video
          ref={videoRef}
          className="ds-about-hero-media"
          src={videoSrc}
          poster={posterSrc}
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
          --why / --where modifiers are tuned to the MEDIA each chapter carries, and each
          medium is tuned to one side, so the media follow the alternation rather than the
          copy: ground-team photograph (right), CFD video (left), photograph (right), map (left). */}

      <section id="what-we-do" className="ds-about-chapter ds-about-chapter--how is-reversed" aria-labelledby="what-title">
        <div className={`${containerClass} ds-about-chapter-inner`}>
          <ChapterHeading number="01" title={copy.what.title} id="what-title" />
          <div className="ds-about-chapter-body">
            <figure className="ds-about-chapter-visual">
              <img src={controlImageSrc} alt={copy.what.imageAlt} loading="lazy" />
              <figcaption>{copy.what.imageCaption}</figcaption>
            </figure>
            <div className="ds-about-chapter-copy">
              <p className="ds-about-chapter-lead ds-about-chapter-claims">
                {copy.what.claims.map(claim => (
                  <span key={claim.text} className="ds-about-chapter-claim"><strong>{claim.only}</strong> {claim.text}</span>
                ))}
              </p>
              <p className="ds-about-chapter-description">{copy.what.description}</p>
              <div className="ds-about-chapter-facts">
                {copy.what.points.map(point => (
                  <article key={point.title} className="ds-about-chapter-fact">
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
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
            <figure className="ds-about-chapter-visual">
              <div className="ds-about-cfd-viewport">
                <video ref={cfdRef} src="/media/about-cfd-dark.mp4" poster="/media/about-cfd-dark-poster.webp"
                  muted loop playsInline preload="none" width="800" height="450"
                  aria-label={language === 'ko' ? '비행선 주변 유동을 보여주는 CFD 시뮬레이션' : 'CFD simulation of airflow around the airship'} />
              </div>
              <figcaption>{copy.why.imageCaption}</figcaption>
            </figure>
            <div className="ds-about-chapter-copy">
              <p className="ds-about-chapter-lead">{copy.why.lead.replace(/\s+/g, ' ')}</p>
              <p className="ds-about-chapter-description">{copy.why.description}</p>
              <div className="ds-about-chapter-facts">
                {copy.why.points.map(point => (
                  <article key={point.title} className="ds-about-chapter-fact">
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </article>
                ))}
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
              <p className="ds-about-chapter-lead">{copy.when.lead.replace(/\s+/g, ' ')}</p>
              <p className="ds-about-chapter-description">{copy.when.description}</p>
              <ol className="ds-about-history">
                {copy.when.history.map(year => (
                  <li key={year.year} className="ds-about-history-year">
                    <h3>{year.year}</h3>
                    <ul>
                      {year.entries.map(entry => (
                        <li key={entry.text}>
                          {entry.date && <span className="ds-about-history-date">{entry.date}</span>}
                          <span className="ds-about-history-text">{entry.text}</span>
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
              <AboutLocationsMap labels={copy.where.places.map(place => place.name)} note={copy.where.mapNote} />
            </div>
            <div className="ds-about-chapter-copy">
              <p className="ds-about-chapter-description">{copy.where.description}</p>
              <div className="ds-about-chapter-places">
                {copy.where.places.map((place, index) => (
                  <article key={place.english} className="ds-about-chapter-place">
                    <div className="ds-about-chapter-place-heading">
                      <h3>{place.name}</h3>
                      <span className={`ds-about-chapter-status${index === 2 ? ' is-planned' : ''}`}>{place.status}</span>
                    </div>
                    <p className="ds-about-chapter-place-role">{place.role}</p>
                    <p className="ds-about-chapter-place-description">{place.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`${containerClass} ds-about-contact-strip`}>
        <p>{copy.where.contactDescription}</p>
        <a href="/contact" className="ds-about-contact-link">{copy.where.contact}<Arrow diagonal /></a>
      </div>
    </main>
  );
}
