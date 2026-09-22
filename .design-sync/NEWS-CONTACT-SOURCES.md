# News and Contact pages — 2026-09-19

The bilingual redesign preview now includes `/news/` and `/contact/`. Both reuse the current homepage header, footer, language preference, dark palette and local fonts. Direct `?lang=en` and `?lang=ko` preview links set the initial language. The live legacy site is unchanged.

## Content and behavior

- `design-system/src/i18n/news.ts` holds news records, bilingual copy, image references, dates and original article links. The initial four records come from the existing homepage's `partials/sections/news.html`. Add new records in descending publication-date order.
- News now uses a compact date/title/category list directly on `/news/`, with one `News.` heading and the existing all/company/media filters. The large featured image, introduction, summaries, repeated reading buttons and inquiry banner were removed. Media inquiries remain as a single Contact link. The newest matching record leads the list; original publisher links, EN/KO switching and an accessible result count remain available. The English links identify the original Korean source language for screen readers.
- `design-system/src/i18n/contact.ts` holds contact copy. The user explicitly confirmed `contact@icarus-airship.com`. A direct email link remains available alongside the new inquiry form.
- Following the user's UNASTELLA reference, Contact now has exactly three required fields: email, subject and message. It uses a compact two-column layout on desktop and stacks on mobile. Labels, validation, pending/error/success messages and metadata support EN/KO. Inquiry categories and the separate location/photo section remain removed.
- The user confirmed no delivery service is available and requested design first. Delivery is deferred. `ContactPage.submitUrl` accepts a future public form endpoint; the preview builder reads `ICARUS_CONTACT_FORM_URL`. For the current design preview, a valid submission shows a neutral notice that nothing was sent and preserves the draft. No false success or mailto substitution occurs. See `CONTACT-FORM.md` for later setup.
- The existing home Contact action, header Contact action and footer Contact link point to the new page.

## Original news sources

Dates below are publication dates, not inferred event dates.

| Date | Record | Publisher |
| --- | --- | --- |
| 2025-12-03 | Envelope material development with KTDI | https://www.etnews.com/20251203000330 |
| 2025-10-17 | K-Deeptech student startup Excellence Award | https://www.unicornfactory.co.kr/article/2025101715015176267 |
| 2025-06-26 | YTN coverage of the Gwangju Future Industry Expo | https://www.ytn.co.kr/_ln/0115_202506262059094515 |
| 2024-11-17 | KEPCO startup competition Grand Prize | https://www.mediayouth.kr/news/806190 |

The KEPCO event took place on November 14. Its replacement accessible source was published November 17; the previous Electimes source returned an access error.

## Contact structure references

- https://www.unastella.com/contact/inquiry — user-supplied inquiry-form reference; adapted to the requested email, subject and message fields only.
- https://www.astroforge.com/contact-us — simple invitation and inquiry topics.
- https://www.stokespace.com/contact-us — direct contact details and locations.
- https://www.k2space.com/ — clear general/media email channels and address.

These were current official pages, not verified founding-era snapshots. ICARUS copy and layout were written for the existing design system.

## Validation

- TypeScript/library build and preview generation passed.
- News filtering, original article links, language persistence and shared navigation passed in the original page checks.
- Latest inquiry form: EN/KO layout checked at 1440, 768, 390 and 320 pixels. Required fields, invalid email, no-service feedback, draft persistence across language changes and failures all passed. Simulated HTTP failure/success verified pending state, request fields, success display and reset. No real email was sent; actual receipt remains unverified until a service is connected.
- Desktop and mobile screenshots inspected; no runtime errors.
- Preview QA scripts and screenshots are local cache artifacts, not public site content.
