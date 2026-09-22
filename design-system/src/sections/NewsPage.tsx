import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/language';
import { newsArticles, newsContent, type NewsArticle, type NewsFilter } from '../i18n/news';
import { containerClass } from '../primitives/container';

function Arrow() {
  return <svg className="ds-news-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function NewsEntry({ article }: { article: NewsArticle }) {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const entry = article.content[language];
  return (
    <li className="ds-news-row">
      <a className="ds-news-entry-link" href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
        aria-label={`${entry.title} (${language === 'en' ? `${copy.sourceLanguage}, ` : ''}${copy.newWindow})`}>
        <time dateTime={article.date}>{article.date.replace(/-/g, '.')}</time>
        <h2>{entry.title}</h2>
        <span className="ds-news-category">{copy.categories[article.category]}</span>
        <Arrow />
      </a>
    </li>
  );
}

/** Bilingual newsroom with real company updates and original publication links. */
export function NewsPage() {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const [filter, setFilter] = useState<NewsFilter>('all');
  const filtered = newsArticles.filter(article => filter === 'all' || article.category === filter);

  useEffect(() => {
    document.title = copy.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.metadata.description);
  }, [copy.metadata]);

  return (
    <main className="ds-news" lang={language}>
      <header className={`${containerClass} ds-news-hero`}>
        <h1>{copy.heading}<span aria-hidden="true">.</span></h1>
      </header>

      <section className={`${containerClass} ds-news-archive`} aria-label={copy.filters.all}>
        <div className="ds-news-toolbar">
          <div className="ds-news-filters" role="group" aria-label={copy.filtersLabel}>
            {(['all', 'company', 'media'] as const).map(category => (
              <button type="button" key={category} aria-pressed={filter === category} aria-controls="news-results"
                onClick={() => setFilter(category)}>
                {copy.filters[category]}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{copy.results(filtered.length)}</p>
        </div>
        <ul id="news-results" className="ds-news-list">
          {filtered.map(article => <NewsEntry key={article.id} article={article} />)}
        </ul>
        <div className="ds-news-press">
          <a href="/contact/" className="ds-news-contact">{copy.press.label}<Arrow /></a>
        </div>
      </section>
    </main>
  );
}
