import { careerRoles } from '../design-system/src/i18n/career';

const React = window.React;
const D = window.IcarusDS;
const params = new URLSearchParams(location.search);
const design = ['a', 'b', 'c'].includes(params.get('design')) ? params.get('design') : 'a';
const roles = careerRoles.filter(role => ['airship-structural-design', 'airship-electrical-electronics'].includes(role.id));
const role = roles.find(item => item.id === params.get('position')) ?? roles[0];
const designs = {
  ko: [{ id: 'a', label: '카드형' }, { id: 'b', label: '미션 강조형' }, { id: 'c', label: '문단 구분형' }],
  en: [{ id: 'a', label: 'Card' }, { id: 'b', label: 'Mission' }, { id: 'c', label: 'Paragraphs' }],
};

function href(nextDesign, nextRole, lang) {
  return `/career-intro/?design=${nextDesign}&position=${nextRole}&lang=${lang}#intro`;
}

// Preserve the supplied sentences, adding a paragraph break before the invitation.
function readingParagraphs(paragraphs, language) {
  if (language !== 'ko' || paragraphs.length !== 2) return paragraphs;
  const sentences = paragraphs[1].split(/(?<=[.!?])\s+/u);
  return sentences.length > 2 ? [paragraphs[0], sentences.slice(0, -1).join(' '), sentences.at(-1)] : paragraphs;
}

function Introduction({ entry, language }) {
  const paragraphs = readingParagraphs(entry.introductionParagraphs, language);
  const [first, ...rest] = paragraphs;
  const sentenceEnd = first.indexOf('. ');
  const lead = sentenceEnd < 0 ? first : first.slice(0, sentenceEnd + 1);
  const detail = sentenceEnd < 0 ? '' : first.slice(sentenceEnd + 2);
  const labels = language === 'ko' ? ['우리의 미션', '개발 방향', '함께할 도전'] : ['Our mission', 'Our approach', 'Build with us'];
  return <section className={`ci-intro ci-intro-${design}`} id="intro" aria-labelledby="ci-intro-title">
    <h2 id="ci-intro-title">{entry.introductionHeading}</h2>
    {design === 'a' && <div className="ci-intro-copy">{paragraphs.map(text => <p key={text}>{text}</p>)}</div>}
    {design === 'b' && <div className="ci-intro-copy">
      <div className="ci-mission-panel"><p className="ci-lead">{lead}</p>{detail && <p>{detail}</p>}</div>
      {rest.map(text => <p key={text}>{text}</p>)}
    </div>}
    {design === 'c' && <div className="ci-intro-copy">{paragraphs.map((text, index) => <div className="ci-paragraph" key={text}>
      <h3>{labels[index] ?? entry.introductionHeading}</h3><p>{text}</p>
    </div>)}</div>}
  </section>;
}

function JobSection({ section }) {
  return <section className="ci-job-section" aria-labelledby={`ci-${section.id}`}>
    <h2 id={`ci-${section.id}`}>{section.heading}</h2>
    {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
    {section.bullets && <ul>{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}
    {section.facts && <dl className="ci-facts">{section.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    {section.steps && <ol className="ci-steps">{section.steps.map(step => <li key={step.title}>
      <h3>{step.title}</h3><ul>{step.bullets.map(text => <li key={text}>{text}</li>)}</ul>
    </li>)}</ol>}
  </section>;
}

function IntroReview() {
  const { language } = D.useLanguage();
  const ko = language === 'ko';
  const entry = role[language];
  React.useEffect(() => {
    document.title = `${entry.title} · ${ko ? '회사 소개 디자인 비교' : 'Company introduction layouts'}`;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled && location.hash === '#intro') document.getElementById('intro')?.scrollIntoView({ behavior: 'instant' });
    });
    return () => { cancelled = true; };
  }, [language]);

  return <div className="ci-review" lang={language}>
    <D.SiteHeader activeHref="/career" />
    <div className="ci-review-bar">
      <div className="ci-controls">
        <span className="ci-review-label">{ko ? '회사 소개 시안' : 'Introduction layouts'}</span>
        <nav aria-label={ko ? '회사 소개 디자인' : 'Introduction designs'}>
          {designs[language].map(item => <a key={item.id} href={href(item.id, role.id, language)} aria-current={design === item.id ? 'page' : undefined}><b>{item.id.toUpperCase()}</b>{item.label}</a>)}
        </nav>
        <select value={role.id} aria-label={ko ? '채용 공고' : 'Job posting'} onChange={event => { location.href = href(design, event.target.value, language); }}>
          <option value={roles[0].id}>Mechanical</option><option value={roles[1].id}>Electronics</option>
        </select>
      </div>
    </div>
    <main className="ci-main">
      <article>
        <header className="ci-post-head">
          <a className="ci-back" href={`/career/?lang=${language}`}>← {ko ? '채용 목록' : 'All positions'}</a>
          <h1>{entry.title}</h1><p>{entry.field}</p>
        </header>
        <Introduction entry={entry} language={language} />
        <div className="ci-job-body">{entry.sections.map(section => <JobSection key={section.id} section={section} />)}</div>
      </article>
      <a className="ci-current" href={`/career/?position=${role.id}&lang=${language}`}>{ko ? '현재 적용본 보기' : 'View current page'} ↗</a>
    </main>
    <D.SiteFooter credit={null} />
  </div>;
}

D.setLanguage(params.get('lang') === 'en' ? 'en' : 'ko');
window.ReactDOM.createRoot(document.getElementById('career-intro-root')).render(<IntroReview />);
