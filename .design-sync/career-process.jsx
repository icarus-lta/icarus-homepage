import { careerRoles } from '../design-system/src/i18n/career';

const React = window.React;
const D = window.IcarusDS;
const params = new URLSearchParams(location.search);
const design = ['a', 'b', 'c'].includes(params.get('design')) ? params.get('design') : 'all';
const roles = careerRoles.filter(role => ['airship-structural-design', 'airship-electrical-electronics'].includes(role.id));
const role = roles.find(item => item.id === params.get('position')) ?? roles[0];
// CareerPage reads the same query, so even the short review URL opens the selected post.
if (params.get('position') !== role.id) {
  params.set('position', role.id);
  history.replaceState(null, '', `${location.pathname}?${params}${location.hash}`);
}

const studies = {
  ko: [
    { id: 'a', label: '원형', title: '작은 원, 또렷한 단계명', description: '숫자만 원 안에 넣고 단계명은 아래에 배치. 가볍고 여유로운 구성.' },
    { id: 'b', label: '카드', title: '단정한 사각 카드', description: '동일한 크기의 카드에 번호와 단계명을 정렬. 본문과 가장 자연스럽게 연결되는 구성.' },
    { id: 'c', label: '연결', title: '하나로 이어지는 절차', description: '하나의 사각형 안에 다섯 단계를 구분. 공간을 간결하게 사용하는 구성.' },
  ],
  en: [
    { id: 'a', label: 'Circles', title: 'Small circles, clear labels', description: 'Numbers sit inside small circles, with stage names below. Light and spacious.' },
    { id: 'b', label: 'Cards', title: 'Simple rectangular cards', description: 'Equal cards align numbers and stage names. A natural fit with the job post.' },
    { id: 'c', label: 'Connected', title: 'One continuous process', description: 'Five stages within one rectangle. A compact overview of the entire process.' },
  ],
};

function href(nextDesign, nextRole, language) {
  return `/career-process/?design=${nextDesign}&position=${nextRole}&lang=${language}${nextDesign === 'all' ? '' : '#career-process'}`;
}

// Match the production flow markup so each study also works on the real CareerPage.
function ProcessFlow({ steps }) {
  return <ol className="ds-career-steps" role="list">{steps.map((step, index) => <li key={step.title}>
    <div className="ds-career-step-node">
      <span className="ds-career-step-number" aria-hidden="true">{index + 1}</span>
      <h3>{step.title}</h3>
    </div>
    {index < steps.length - 1 && <span className="ds-career-step-connector" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m8 4 8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>}
  </li>)}</ol>;
}

function ProcessReview() {
  const { language } = D.useLanguage();
  const ko = language === 'ko';
  const entry = role[language];
  const process = entry.sections.find(section => section.id === 'process');
  React.useEffect(() => {
    let cancelled = false;
    document.documentElement.lang = language;
    document.title = ko ? 'ICARUS · 채용 절차 디자인 시안' : 'ICARUS · Hiring process designs';
    document.fonts.ready.then(() => {
      if (!cancelled && design !== 'all') document.getElementById('career-process')?.closest('section')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    return () => { cancelled = true; };
  }, [language]);

  return <div className={`cp-review cp-design-${design}`} lang={language}>
    <D.SiteHeader activeHref="/career" />
    <div className="cp-toolbar">
      <div className="cp-controls">
        <span className="cp-toolbar-label">{ko ? '채용 절차 시안' : 'Process studies'}</span>
        <nav aria-label={ko ? '채용 절차 디자인 비교' : 'Hiring process design options'}>
          <a href={href('all', role.id, language)} aria-current={design === 'all' ? 'page' : undefined}>{ko ? '전체 비교' : 'Compare'}</a>
          {studies[language].map(item => <a key={item.id} href={href(item.id, role.id, language)} aria-current={design === item.id ? 'page' : undefined}><b>{item.id.toUpperCase()}</b>{item.label}</a>)}
        </nav>
        <select value={role.id} aria-label={ko ? '채용 직무 선택' : 'Choose a role'} onChange={event => { location.href = href(design, event.target.value, language); }}>
          <option value={roles[0].id}>Mechanical</option><option value={roles[1].id}>Electronics</option>
        </select>
      </div>
    </div>
    {design === 'all' ? <main className="cp-comparison">
      <header className="cp-heading">
        <p>ICARUS CAREERS</p>
        <h1>{ko ? '채용 절차, 세 가지 방향' : 'Three ways to show the journey'}</h1>
        <p>{ko ? '원 · 사각형 · 화살표로 정리한 다섯 단계의 채용 절차' : 'Five hiring stages, expressed through circles, rectangles and chevrons.'}</p>
      </header>
      {studies[language].map(item => <article className={`cp-study cp-design-${item.id}`} key={item.id} aria-labelledby={`cp-study-${item.id}`}>
        <header className="cp-study-heading">
          <div>
            <h2 id={`cp-study-${item.id}`}><span>{item.id.toUpperCase()}</span>{item.title}{item.id === 'b' && <small>{ko ? '추천' : 'Recommended'}</small>}</h2>
            <p>{item.description}</p>
          </div>
          <a href={href(item.id, role.id, language)}>{ko ? '공고에서 보기' : 'View in post'}<span aria-hidden="true"> →</span></a>
        </header>
        <div className="ds-career ds-career-body ds-career-body--full cp-demo" lang={language}>
          <section className="ds-career-section" aria-labelledby={`cp-process-${item.id}`}>
            <h2 id={`cp-process-${item.id}`}>{process.heading}</h2>
            <div className="ds-career-section-content"><ProcessFlow steps={process.steps} /></div>
          </section>
        </div>
      </article>)}
      <aside className="cp-references">
        <h2>{ko ? '참고한 실제 채용 페이지' : 'Official hiring references'}</h2>
        <p>{ko ? '토스의 연속된 원형 배치와 카카오의 번호·도형 구성을 확인하고, 이카루스의 색상과 본문 폭에 맞춰 재구성했습니다.' : 'Inspired by Toss’s sequence of circles and Kakao’s numbered geometric layout, adapted to ICARUS’s palette and reading width.'}</p>
        <a href="https://i18n.toss.im/career/joining-guide" target="_blank" rel="noreferrer">{ko ? '토스 합류 여정' : 'Toss joining guide'} ↗</a>
        <a href="https://careers.kakao.com/process" target="_blank" rel="noreferrer">{ko ? '카카오 영입절차' : 'Kakao hiring process'} ↗</a>
      </aside>
    </main> : <div className="cp-in-context"><D.CareerPage /></div>}
    <D.SiteFooter credit={null} />
  </div>;
}

D.setLanguage(params.get('lang') === 'en' ? 'en' : 'ko');
window.ReactDOM.createRoot(document.getElementById('career-process-root')).render(<ProcessReview />);
