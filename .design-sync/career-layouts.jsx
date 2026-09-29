import { careerRoles } from '../design-system/src/i18n/career';

const React = window.React;
const D = window.IcarusDS;
const query = new URLSearchParams(location.search);
const design = ['a', 'b', 'c'].includes(query.get('design')) ? query.get('design') : 'a';
const roles = careerRoles.filter(role => ['airship-structural-design', 'airship-electrical-electronics'].includes(role.id));
const selectedRole = roles.find(role => role.id === query.get('position')) ?? roles[0];
const variants = {
  ko: [
    { id: 'a', name: '섹션 카드', note: '주요 업무부터 채용 절차까지, 각 내용을 하나의 상자로 묶어 차분하게 읽는 구성' },
    { id: 'b', name: '정보 보드', note: '업무는 항목별 카드로, 지원 자격과 우대 사항은 나란히 비교하는 구성' },
    { id: 'c', name: '목차형 문서', note: '목차로 필요한 내용을 바로 찾고, 하나의 문서 안에서 이어 읽는 구성' },
  ],
  en: [
    { id: 'a', name: 'Cards', note: 'Each topic has its own generous, clearly defined reading surface.' },
    { id: 'b', name: 'Board', note: 'Individual responsibility cards and side-by-side qualifications.' },
    { id: 'c', name: 'Document', note: 'A persistent index and one continuous reading surface.' },
  ],
};

function previewLink(nextDesign, role, language) {
  return `/career-layouts/?design=${nextDesign}&position=${role}&lang=${language}#jd-content`;
}

function SectionContent({ section }) {
  return <div className="jd-section-content">
    {section.paragraphs?.map(text => <p key={text}>{text}</p>)}
    {section.bullets && <ul className="jd-bullets" role="list">{section.bullets.map((text, index) => <li key={text}>
      {design === 'b' && section.id === 'responsibilities' && <span className="jd-task-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
      <span>{text}</span>
    </li>)}</ul>}
    {section.facts && <dl className="jd-facts">{section.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
    {section.steps && <ol className="jd-steps" role="list">{section.steps.map((step, index) => <li key={step.title}>
      <span className="jd-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><h3>{step.title}</h3><ul className="jd-bullets">{step.bullets.map(text => <li key={text}>{text}</li>)}</ul></div>
    </li>)}</ol>}
  </div>;
}

function JobSection({ section, index }) {
  return <section className={`jd-section jd-section--${section.id}`} id={`jd-${section.id}`} aria-labelledby={`jd-heading-${section.id}`}>
    <div className="jd-section-heading">
      {design !== 'b' && <span className="jd-section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
      <h2 id={`jd-heading-${section.id}`}>{section.heading}</h2>
    </div>
    <SectionContent section={section} />
  </section>;
}

function LayoutReview() {
  const { language } = D.useLanguage();
  const ko = language === 'ko';
  const entry = selectedRole[language];
  const choices = variants[language];
  const [active, setActive] = React.useState(entry.sections[0].id);

  React.useEffect(() => {
    document.title = `${choices.find(item => item.id === design).name} · ${entry.title} — ICARUS`;
    const hash = location.hash;
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
  }, [language]);

  React.useEffect(() => {
    if (design !== 'c') return;
    const sections = [...document.querySelectorAll('.jd-section')];
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = document.querySelector('.jd-review-bar').getBoundingClientRect().bottom + (innerWidth < 900 ? 88 : 48);
        const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= offset) ?? sections[0];
        setActive(current.id.replace('jd-', ''));
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return <div className={`jd-review jd-variant-${design}`} lang={language}>
    <D.SiteHeader activeHref="/career" />
    <div className="jd-review-bar">
      <div className="jd-review-controls">
        <span className="jd-review-label">{ko ? '디자인 비교' : 'Design review'}</span>
        <nav className="jd-designs" aria-label={ko ? '디자인 시안' : 'Design variants'}>
          {choices.map(item => <a key={item.id} href={previewLink(item.id, selectedRole.id, language)} aria-current={design === item.id ? 'page' : undefined}>
            <b>{item.id.toUpperCase()}</b><span>{item.name}</span>
          </a>)}
        </nav>
        <div className="jd-review-actions">
          <select aria-label={ko ? '비교할 채용 공고' : 'Job posting'} value={selectedRole.id} onChange={event => { location.href = previewLink(design, event.target.value, language); }}>
            <option value={roles[0].id}>Mechanical</option><option value={roles[1].id}>Electronics</option>
          </select>
          <a className="jd-current" href={`/career/?position=${selectedRole.id}&lang=${language}`}>{ko ? '현재 적용본' : 'Current page'} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
    <main className="jd-main">
      <header className="jd-post-head">
        <a className="jd-back" href={`/career/?lang=${language}`}>← {ko ? '채용 목록' : 'All positions'}</a>
        <h1>{entry.title}</h1><p className="jd-field">{entry.field}</p>
      </header>
      <section className="jd-overview" aria-labelledby="jd-overview-heading">
        <h2 id="jd-overview-heading">{entry.introductionHeading}</h2>
        {entry.introductionParagraphs.map(text => <p key={text}>{text}</p>)}
      </section>
      <div className="jd-proposal-caption" id="jd-content"><span>{design.toUpperCase()}</span><p>{choices.find(item => item.id === design).note}</p></div>
      <div className="jd-layout">
        {design === 'c' && <nav className="jd-index" aria-label={ko ? '공고 목차' : 'Job contents'}>
          <span className="jd-index-label">{ko ? '공고 살펴보기' : 'On this page'}</span>
          <div>{entry.sections.map((section, index) => <a key={section.id} href={`#jd-${section.id}`} aria-current={active === section.id ? 'location' : undefined} onClick={() => setActive(section.id)}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.heading}
          </a>)}</div>
        </nav>}
        <article className="jd-sections" aria-label={entry.title}>{entry.sections.map((section, index) => <JobSection key={section.id} section={section} index={index} />)}</article>
      </div>
      <a className="jd-return" href="#jd-content">↑ {ko ? '시안 처음으로' : 'Back to layout'}</a>
    </main>
    <D.SiteFooter credit={null} />
  </div>;
}

D.setLanguage(query.get('lang') === 'en' ? 'en' : 'ko');
window.ReactDOM.createRoot(document.getElementById('career-layouts-root')).render(<LayoutReview />);
