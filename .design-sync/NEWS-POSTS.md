# News posts

The newsroom uses internal posts at `/news/?article=<id>&lang=ko` (or `en`).
The optional `page` query keeps the return link on the originating list page.
The list sorts newest first, with older posts on later pages, and shows four posts per page.
The eleven posts span October 2024 through September 2026 (three pages: 4 / 4 / 3).

## Adding a post

Add an entry to `newsArticles` in `design-system/src/i18n/news.ts`:

- `id`: a unique, stable URL identifier.
- `date`: `YYYY-MM` for month-only company updates, or `YYYY-MM-DD` when a
  source publication date is known. Never invent a day for a month-only event.
- `category`: `company` or `media`, displayed as a post label.
- `image`: optional image key defined in `design-system/src/assets.ts`. Omit it
  for text-only list updates. The DK Emtech post uses its supplied meeting photo
  in the list and detail view.
- `companyVisual`: use `ansys` for ANSYS SPACE KOREA posts, `tips` for the TIPS
  selection post, or `dk-emtech` for the MOU photo. Other company posts show
  the supplied ICARUS logo above the body.
- `content.ko` and `content.en`: `title`, a short `summary`, and `body`.
  Include `imageAlt` when a photo is supplied.
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

## Company updates added from the user's chronology

The seven new bilingual posts are provisional editorial copy based on the
user-supplied milestones. The seed investment post names the two investors
specified by the user. The posts do not assert investment amounts,
grant amounts, project deliverables, or detailed MOU terms. Dates in this list
take precedence over older About-page timeline dates for these Newsroom posts.

| Month | Post ID | Subject |
| --- | --- | --- |
| 2024-10 | `didimdol-rd` | 디딤돌 R&D |
| 2025-02 | `industry-academia-rd` | 산학연 콜라보 R&D |
| 2025-04 | `dk-emtech-mou` | DK엠텍 MOU |
| 2025-05 | `ansys-space-korea-2025` | ANSYS SPACE KOREA 선정 |
| 2026-05 | `seed-investment-2026` | 시드 투자 유치 (본문에 투자기관 명시) |
| 2026-05 | `ansys-space-korea-2026` | ANSYS SPACE KOREA 후속 선정 |
| 2026-09 | `tips-selection-2026` | TIPS 선정 |

The user wrote a question mark after 디딤돌 R&D; its title currently omits
"선정" pending clarification. The four existing source-backed posts retain
their article/video links and original photos and are labeled as media coverage.

## Company post artwork

- `static/news/icarus-logo.png`: the ICARUS CI image supplied for these posts.
- `static/news/dk-emtech-mou.jpg`: the supplied photograph for the DK Emtech MOU.
- `static/news/ansys-part-of-synopsys-logo.svg`: the Ansys part of Synopsys
  mark from [Synopsys's official trademark page](https://www.synopsys.com/company/legal/trademarks-brands.html),
  used beside the ICARUS mark with a × separator for both ANSYS SPACE KOREA posts.
- `static/news/tips-logo.png`: TIPS KOREA mark from the [official TIPS website](https://jointips.or.kr/),
  used beside the ICARUS mark in the TIPS selection post.

The build trims whitespace around the logos and produces optimized WebP assets.
Company article bodies describe the stated milestones and technical direction;
they do not invent program terms, investment amounts, or MOU deliverables.
