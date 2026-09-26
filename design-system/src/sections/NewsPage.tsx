import { useEffect, useState } from 'react';
import { images } from '../assets';
import { useLanguage, type Language } from '../i18n/language';
import { newsArticles, newsContent, type NewsArticle, type NewsFilter } from '../i18n/news';
import { containerClass } from '../primitives/container';

const FILTERS: readonly NewsFilter[] = ['all', 'company', 'media'];

function Arrow() {
  return <svg className="ds-news-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

/** Every story opens its original article in a new tab; the label says so, and names Korean sources in English. */
function sourceLink(article: NewsArticle, language: Language) {
  const copy = newsContent[language];
  return {
    href: article.sourceUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `${article.content[language].title} (${language === 'en' ? `${copy.sourceLanguage}, ` : ''}${copy.newWindow})`,
  };
}

const date = (article: NewsArticle) => <time dateTime={article.date}>{article.date.replace(/-/g, '.')}</time>;

/** One consistent row for every story, including a category with only one result. */
function StoryItem({ article, first }: { article: NewsArticle; first: boolean }) {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const entry = article.content[language];
  return (
    <a className="ds-news-entry-link" {...sourceLink(article, language)}>
      <span className="ds-news-photo ds-news-entry-photo">
        <img src={images[article.image]} alt="" loading={first ? 'eager' : 'lazy'} decoding="async" />
      </span>
      <div className="ds-news-entry-text">
        <p className="ds-news-meta">{date(article)}<span aria-hidden="true">·</span><span>{copy.categories[article.category]}</span></p>
        <h2>{entry.title}</h2>
        <p className="ds-news-summary">{entry.summary}</p>
        <p className="ds-news-source">{entry.sourceLabel}</p>
      </div>
      <span className="ds-news-read"><span>{article.medium === 'video' ? copy.video : copy.article}</span><Arrow /></span>
    </a>
  );
}

/**
 * Bilingual newsroom with a chronological photo list. Photographs are the published colour
 * images; every row links to its original publisher.
 */
export function NewsPage() {
  const { language } = useLanguage();
  const copy = newsContent[language];
  const [filter, setFilter] = useState<NewsFilter>('all');
  const matching = (key: NewsFilter) => newsArticles.filter(article => key === 'all' || article.category === key);
  const stories = matching(filter);

  useEffect(() => {
    document.title = copy.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', copy.metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', copy.metadata.description);
  }, [copy.metadata]);

  return (
    <main className="ds-news" lang={language}>
      <div className={`${containerClass} ds-news-inner`}>
        <header className="ds-news-head">
          <div>
            <h1 lang="en">{copy.heading}</h1>
            <p className="ds-news-intro">{copy.introduction}</p>
          </div>
          <div className="ds-news-filters" role="group" aria-label={copy.filtersLabel}>
            {FILTERS.map(key => (
              <button type="button" key={key} aria-pressed={filter === key} aria-controls="news-results" onClick={() => setFilter(key)}>
                {copy.filters[key]}<span className="ds-news-count">{matching(key).length}</span>
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">{copy.results(stories.length)}</p>
        </header>

        {/* Keyed by category so a new selection fades in rather than swapping abruptly. */}
        <ol id="news-results" key={filter} className="ds-news-results ds-news-list" role="list">
          {stories.map((article, index) => <li key={article.id}><StoryItem article={article} first={index === 0} /></li>)}
        </ol>
      </div>

      <div className={`${containerClass} ds-news-strip`}>
        <p>{copy.press.description}</p>
        <a href="/contact/" className="ds-news-strip-link">{copy.press.label}<span aria-hidden="true">↗</span></a>
      </div>
    </main>
  );
}
