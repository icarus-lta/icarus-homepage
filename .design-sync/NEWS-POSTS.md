# News posts

The newsroom uses internal posts at `/news/?article=<id>&lang=ko` (or `en`).
The optional `page` query keeps the return link on the originating list page.
The list sorts by publication date and shows four posts per page.

## Adding a post

Add an entry to `newsArticles` in `design-system/src/i18n/news.ts`:

- `id`: a unique, stable URL identifier.
- `date`: publication date in `YYYY-MM-DD` format.
- `category`: `company` or `media`, displayed as a post label.
- `image`: an image key defined in `design-system/src/assets.ts`.
- `content.ko` and `content.en`: `title`, a short `summary`, `imageAlt`, and `body`.
- `body`: an array of paragraphs, in reading order. Text is rendered as text,
  not executable HTML.
- `sourceUrl`, `medium`, and `content.*.sourceLabel`: optional original-source
  attribution. Omit these for company-authored updates without external coverage.

Run `./build.sh` after editing. Posts, adjacent-post links, and pagination update
from this data. This is the static frontend content workflow, not an admin editor.

## Initial source summaries

Reviewed 2026-09-29. The four initial posts contain brief original paraphrases in
Korean and English; full articles and transcripts are not reproduced. Existing
site images are retained. Source links appear in each post's related-coverage box.

- [ET News, 2025-12-03](https://www.etnews.com/20251203000330): envelope materials
  collaboration and functional layers; omits ambiguous cost and endurance figures.
- [Unicorn Factory, 2025-10-17](https://www.unicornfactory.co.kr/article/2025101715015176267):
  student startup Excellence Award and maritime-monitoring direction. The body
  identifies the student award; the conflicting photo caption is not repeated.
- [YTN, 2025-06-26](https://www.ytn.co.kr/_ln/0115_202506262059094515): exhibition
  demonstration, monitoring applications, and long-duration flight development.
- [Media Youth, 2024-11-17](https://www.mediayouth.kr/news/806190): ICARUS's Grand
  Prize at the jointly hosted regional student competition. The event took place
  on November 14; the retained November 17 date is the source's publication date.
