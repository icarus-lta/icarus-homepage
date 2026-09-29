import { useEffect } from 'react';
import { images } from '../assets';
import { useLanguage, type Language } from '../i18n/language';
import { newsArticles, newsContent, type NewsArticle } from '../i18n/news';
import { containerClass } from '../primitives/container';

const PAGE_SIZE = 4;

function PageArrow({ back = false }: { back?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={back ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Arrow({ external = false }: { external?: boolean }) {
  return <svg className={`ds-news-arrow${external ? ' is-external' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={external ? 'M6.5 17.5 17.5 6.5M8.5 6.5h9v9' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function articleHref(article: NewsArticle, language: Language, page: number) {
  return `/news/?article=${encodeURIComponent(article.id)}&page=${page}&lang=${language}`;
}

const date = (article: NewsArticle) => <time dateTime={article.date}>{article.date.replace(/-/g, '.')}</time>;

/** One consistent row for every story. */
function StoryItem({ article, first, page }: { article: NewsArticle; first: boolean; page: number }) {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const entry = article.content[language];
  return (
    <a className="ds-news-entry-link" href={articleHref(article, language, page)}>
      <span className="ds-news-photo ds-news-entry-photo">
        <img src={images[article.image]} alt="" loading={first ? 'eager' : 'lazy'} decoding="async" />
      </span>
      <div className="ds-news-entry-text">
        <p className="ds-news-meta">{date(article)}<span aria-hidden="true">·</span><span>{copy.categories[article.category]}</span></p>
        <h2>{entry.title}</h2>
        <p className="ds-news-summary">{entry.summary}</p>
        <p className="ds-news-source">ICARUS LTA</p>
      </div>
      <span className="ds-news-read"><span>{copy.article}</span><Arrow /></span>
    </a>
  );
}

/**
 * Bilingual company posts with a paginated list and static-host-friendly detail URLs.
 */
export function NewsPage() {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const articleId = params.get('article');
  const ordered = [...newsArticles].sort((a, b) => b.date.localeCompare(a.date));
  const articleIndex = ordered.findIndex(article => article.id === articleId);
  const article = articleIndex >= 0 ? ordered[articleIndex] : undefined;
  const entry = article?.content[language];
  const pageCount = Math.max(1, Math.ceil(newsArticles.length / PAGE_SIZE));
  const requestedPage = Number(params.get('page') ?? (article ? Math.floor(articleIndex / PAGE_SIZE) + 1 : 1));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1;
  const stories = ordered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Ordinary links preserve refresh, browser history, and sharing on static hosting.
  const pageHref = (number: number) => `/news/?page=${number}&lang=${language}`;
  const title = entry ? `${entry.title} — ICARUS LTA` : articleId !== null ? `${copy.notFound} — ICARUS LTA` : copy.metadata.title;
  const description = entry?.summary ?? (articleId !== null ? copy.notFoundDescription : copy.metadata.description);

  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', article ? 'article' : 'website');
  }, [title, description, article]);

  if (articleId !== null) {
    return <main className="ds-news" lang={language}>
      <div className={`${containerClass} ds-news-inner ds-news-detail`}>
        <a className="ds-news-back" href={pageHref(page)}><PageArrow back />{copy.back}</a>
        {article && entry ? <>
          <article className="ds-news-article">
            <header className="ds-news-article-head">
              <p className="ds-news-meta">{date(article)}<span aria-hidden="true">·</span><span>{copy.categories[article.category]}</span></p>
              <h1>{entry.title}</h1>
            </header>
            <figure className="ds-news-article-image"><img src={images[article.image]} alt={entry.imageAlt} decoding="async" /></figure>
            <div className="ds-news-article-body">{entry.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            {article.sourceUrl && <aside className="ds-news-article-source" aria-label={copy.source}>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${article.medium === 'video' ? copy.originalVideo : copy.originalArticle} (${copy.newWindow})`}>
                {article.medium === 'video' ? copy.originalVideo : copy.originalArticle}<Arrow external />
              </a>
            </aside>}
          </article>
          <nav className="ds-news-article-nav" aria-label={copy.articleNavigation}>
            {[{ item: ordered[articleIndex + 1], label: copy.previousArticle }, { item: ordered[articleIndex - 1], label: copy.nextArticle }].map(({ item, label }) => item && <a key={item.id} href={articleHref(item, language, Math.floor(ordered.indexOf(item) / PAGE_SIZE) + 1)}>
              <span>{label}</span><strong>{item.content[language].title}</strong><PageArrow />
            </a>)}
          </nav>
          <div className="ds-news-article-bottom"><a className="ds-news-list-button" href={pageHref(page)}>{copy.back}</a></div>
        </> : <div className="ds-news-not-found"><h1>{copy.notFound}</h1><p>{copy.notFoundDescription}</p></div>}
      </div>
    </main>;
  }

  return (
    <main className="ds-news" lang={language}>
      <div className={`${containerClass} ds-news-inner`}>
        <header className="ds-news-head">
          <div>
            <h1 lang="en">{copy.heading}</h1>
            <p className="ds-news-intro">{copy.introduction}</p>
          </div>
          <p className="sr-only">{copy.pagination.results(page, pageCount, stories.length)}</p>
        </header>

        <ol id="news-results" key={page} className="ds-news-results ds-news-list" role="list">
          {stories.map((article, index) => <li key={article.id}><StoryItem article={article} first={index === 0} page={page} /></li>)}
        </ol>

        <nav className="ds-news-pagination" aria-label={copy.pagination.label}>
          {page > 1
            ? <a className="ds-news-page" href={pageHref(page - 1)} aria-label={copy.pagination.previous} rel="prev"><PageArrow back /></a>
            : <button className="ds-news-page" type="button" disabled aria-label={copy.pagination.previous}><PageArrow back /></button>}
          <ol className="ds-news-pages" role="list">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(number => <li key={number}>
              <a className="ds-news-page" href={pageHref(number)} aria-label={copy.pagination.page(number)} aria-current={page === number ? 'page' : undefined}>{number}</a>
            </li>)}
          </ol>
          {page < pageCount
            ? <a className="ds-news-page" href={pageHref(page + 1)} aria-label={copy.pagination.next} rel="next"><PageArrow /></a>
            : <button className="ds-news-page" type="button" disabled aria-label={copy.pagination.next}><PageArrow /></button>}
        </nav>
      </div>

      <div className={`${containerClass} ds-news-strip`}>
        <p>{copy.press.description}</p>
        <a href="/contact/" className="ds-news-strip-link">{copy.press.label}<span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
