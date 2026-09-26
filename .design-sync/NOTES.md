## About refinements and reproducible sharing build — 2026-09-26
- The actual About page uses the refined horizontal history and aligned location list. Korean location names are 30px on desktop and 28px on smaller screens; city/role and status/description use shared row tracks. Secondary English city captions and the introductory location paragraph are removed from the rendered list.
- Gwangju and Jangseong have two slow expanding rings each. Leader lines remain static; map labels have no extra status dot or operating text. Goheung remains a static future marker. Motion pauses offscreen and when the tab is hidden; reduced-motion preference uses a static ring.
- The station-keeping film and poster now use the supplied v20 source, documented in `static/about/CONTROL-MEDIA.md`.
- `build-preview.mjs` now resolves its root relative to the script and bundles React, ReactDOM and the design system from the locked dependencies. It no longer requires ignored `.ds-sync` or `ds-bundle` files. Optional `output/` studies are excluded from Git and do not block a fresh checkout's build.
- The Cloudflare review tunnel serves the same output as localhost:8801. The repository's existing `main` GitHub Pages site is a separate legacy publication; current React source is on `dev`.

## Why: station-keeping simulation updated to v19 — 2026-09-25
- Replaced the v15 control video and poster with the supplied `Airship_Station_Keeping_v19.gif`, preserving the full 30 seconds, 600 frames and 1440×810 dimensions. Existing framing and color treatment remain. The component's video/poster URLs now include `?v=19` to invalidate cached v15 assets.

## Why: supplied station-keeping simulation — 2026-09-25
- The second Why ICARUS card now shows the user's `Airship_Station_Keeping_v15.gif`, encoded as a 7 MB H.264 MP4 with a WebP poster. The full 1440×810, 30-second, 20 fps animation is preserved. Rebuild assets with `design-system/scripts/prepare-control-media.mjs`; provenance is in `static/about/CONTROL-MEDIA.md`.
- The dashboard is framed to the left of the cards without cropping or the photographic overlay: subtle rounded border/shadow, 72% saturation and 96% brightness. Mobile keeps the full dashboard and uses a compact media area. Both languages now identify it as a flight-control simulation.
- Existing selection, keyboard controls, muted looping, offscreen/inactive pausing and reduced-motion behavior apply to the new film. The hero retains the flight footage. Build and browser verification: `output/check-about-control.mjs`, report `output/about-control-qa.json`.

## Why: mist blue replaces cornflower — 2026-09-25
- At the user's request, the actual About page now uses the earlier mist-blue proposal color #C6DEED for the Why card numbers/titles and matching capsule light/glow. Inactive colors derive from the same mist blue; existing type weight, glass treatment and moving capsule are retained. Sources: `design-system/src/about.css`. Design-system and preview builds pass.

## Why: capsule selection applied to the actual About page — 2026-09-25
- The user selected B (capsule) for the actual `/about/` page. `AboutPage.tsx` and `about.css` now include the bright A tinted glass, darker inactive cards, cornflower #8FB5FF numbers/titles at 600/700 weight, and one 6px rounded capsule on a faint track. No checkmarks or review controls appear on the actual route.
- The shared capsule moves to the selected card over 520ms; ResizeObserver and font/language updates maintain its position. Arrow Up/Down and Home/End select cards, existing media switching remains connected, and reduced motion removes transitions. Proposal overlays hide the production indicator to avoid duplicates.
- Design-system build (including types and CSS), preview build and scoped diff checks pass. Actual page checked in KO/EN at 320/390/768/1024/1440/1920px across all three cards (36 states): selection/media, alignment, exact colors/weights, number/title clearance, and no overflow pass. Keyboard, animation, rapid retargeting, language switching, resize and reduced motion pass. Desktop and phone screenshots visually reviewed; Windows localhost:8801 returns HTTP 200. Report: `output/why-capsule-live-qa.json`.

## Why: cornflower weight and five selection-bar proposals — 2026-09-25
- The user chose cornflower and asked for stronger numbers/titles plus multiple left-bar designs. New review route: `/about-why-bar-proposals.html?bar=pill&lang=ko`. All designs use #8FB5FF, with number weight increased 400→600 and title weight 600→700. A's bright active glass and darker inactive cards remain, without checkmarks.
- Designs: `line` = A long slim line, `pill` = B short central capsule (recommended), `bracket` = C open bracket, `pointer` = D small arrowhead, `double` = E unequal double lines. Each uses the same single 520ms moving indicator and faint track. The short capsule/pointer center on the selected card; the bracket/long bars follow its height. A link compares the preceding type weight.
- Build after the normal preview: `node output/build-about-why-bar-proposals.mjs`. Reuses existing glass, rail and type-color CSS with isolated new bar-proposal CSS/JS; no changes to live About. Direct links preserve `bar` and selected `card`, with keyboard switching and collapse/reopen.
- 180 states (KO/EN × 320/390/768/1024/1440/1920px × five bar designs × three cards) pass exact color/weights, number-title clearance, media/pressed state, rail alignment, no overflow, keyboard and reload. Normal-motion sampling confirms 17 intermediate positions. All five desktop card details and phone capsule visually reviewed. Report: `output/why-bar-proposals-qa.json`; screenshots: `output/why-bar-*.png`.

## Why: number/title blue palette proposals — 2026-09-25
- The user asked for several blue-family colors for the card numbers and titles, differentiated from the Why heading. New comparison page: `/about-why-type-colors.html?blue=steel&lang=ko`, built with `node output/build-about-why-type-colors.mjs`. It composes the latest A glass, moving rail and four type palettes: steel #ABC3DB (recommended), cornflower #8FB5FF, lavender #BEC2F2, mist #C6DEED. `blue=what` compares the Why blue #9FDBFB; `blue=white` restores the previous white type treatment.
- Active numbers/titles use the chosen color; inactive titles/numbers are muted mixtures. Body text stays neutral, and the Why heading, glass, border and moving rail retain their earlier colors. Toolbar supports direct links, keyboard palette selection, collapse/reopen and comparison with the previous rail route. The live About page is unchanged.
- KO/EN, 320/390/768/1440px, all six palettes and all three selected cards (144 states): actual type colors, body/Why colors, one pressed card, media, rail alignment, keyboard/reload and no text/toolbar/page overflow pass. Active type contrast against the brightest neutral glass sample is 5.04:1 or higher for all proposals. All four desktop looks and a phone look were visually reviewed. Report: `output/why-type-colors-qa.json`; screenshots: `output/why-type-{palette}-{width}.png`.

## Why: moving selection bar proposal — 2026-09-25
- The user requested a left selection bar that moves smoothly to the next chosen card. New proposal: `/about-why-rail.html?lang=ko`, built with `node output/build-about-why-rail.mjs`. It reuses the brighter, check-free A glass treatment and adds one shared ice-blue bar on a faint neutral track to the left of the card stack.
- The bar moves and changes height over 520ms with a gentle deceleration, ending 16px inside the selected card's top/bottom. Repeated clicks retarget the existing transition. Card lift/brightness and the existing media selection remain synchronized. Arrow Up/Down and Home/End choose cards; `card=1|2|3` deep-links and reloads preserve selection. Resizing, font loading and language changes update geometry. Reduced motion switches instantly.
- Sources: `output/about-why-rail.css`, `output/about-why-rail.js`, plus shared `output/about-why-glass.css`. Live About unchanged for review. KO/EN at 320/390/768/1024/1440/1920px: 36 states pass rail alignment, media/pressed state, single indicator, no checks or overflow. Actual animation sampling confirms intermediate positions, rapid retargeting and final alignment; resize and language switching checked. Desktop/phone screenshots visually reviewed. Reports: `output/why-rail-qa.json`, `output/why-rail-motion.json`.

## Why: restrained blue tinted-glass depth proposals — 2026-09-25
- A revision: the user asked for a stronger selected state without the right-hand checkmark. A now hides the check and reclaims its text space, brightens the active glass with neutral white light and a 72% ice-blue rim, and darkens the other card surfaces/numbers/type slightly. White selected text, lift and shadow remain. B/C retain their original comparison treatments. Rebuilt the same `?look=a` URL; 18 KO/EN card-selection states at 320/390/1440px pass (hidden marks, brighter active card, correct media/pressed state and no overflow). Desktop/phone screenshots reviewed: `output/why-glass-a-brighter-*.png`.
- The user likes tinted glass and requested clearer selected-card depth, using What We Do's exact #9FDBFB blue without making both backgrounds and text uniformly blue. Three review options are at `/about-why-glass.html?look=a&lang=ko` (`a`, `b`, `c`, and `now` for the current page). This is a proposal route built on the actual About component and its existing card/media selection.
- A (recommended): a thin blue rim, bright upper bevel, shallow lift, dark lower edge and shadow; numbers/headings remain white. B: an offset second glass plane with stronger depth, blue limited to the selected number and short left bevel. C: blue gathered only at the bottom of the glass, with near-white type and top edge. All include a small selected checkmark, quieter neutral unselected cards and the existing accessible pressed state.
- Sources: `output/about-why-glass.css`, `output/about-why-glass.js`; rebuild after the normal preview with `node output/build-about-why-glass.mjs`. The toolbar supports direct links, keyboard arrows, collapse/reopen and current-page comparison. The live About component and stylesheet are unchanged by this proposal task.
- Checked all three designs and all three card selections in KO/EN at 320/390/768/1024/1440/1920px (108 states): correct media, unique selected state, exact What blue, white titles, raised styling, visible check, no text/page overflow or badge overlap. URL reload and keyboard selection pass. Desktop A/B/C and phone A screenshots visually reviewed; `output/why-glass-qa.json` and `output/why-glass-*.png`.

## News: photo list applied — 2026-09-25
- The user chose a list with photographs for the actual `/news/` page. All stories now use the same chronological row: colour thumbnail, date/category, title, summary, publisher and original-article/video link. Filtering to one story keeps that row layout.
- White `Newsroom` heading, right-hand segmented filters, published colour photographs and closing contact strip remain. On phones, the thumbnail sits beside the date/category/title and the summary spans the row underneath, followed by source and reading link.
- Validation: design-system build (including TypeScript and CSS) and preview build pass; the KO/EN News route, shared assets and existing proposal URLs return HTTP 200. Browser visual and interaction checks were not run for this change.

## News page proposals, round 2 — 2026-09-22
- After the magazine layout went live, the user asked for forms other than the right-hand card list, drawn from how overseas tech startups and design-led companies such as Apple present their technology and products. Eight options are at `/news-proposals-2.html?design=a&lang=ko` (`a`–`h`, plus `now` = the live magazine page); the review toolbar names each option's reference. The live `/news/` page is unchanged pending the user's choice.
- Every option keeps what was settled: the white `Newsroom` heading and the segmented category switch on the right (the live `.ds-news-head` / `.ds-news-filters` classes), the published colour photographs, the white closing strip, and no accent blue in the page body.
- A Apple Newsroom (wide lead tile, then equal rounded tiles) · B Apple product-page highlights gallery (rounded cards sliding sideways, dots that fill as progress, 5 s autoplay with pause, no autoplay under reduced motion) · C Apple keynote-recap bento grid (layouts for 1, 2, 3 and 4+ stories) · D Apple keynote (one story per screen, its photograph rising in) · E Linear changelog (the date held on the left) · F SpaceX full-screen sections with an outlined button · G milestone rail after Boom's XB-1 milestones (oldest to newest, a white pulse on the newest) · H product spec sheet after Rocket Lab's Electron specs (date / category / source / format).
- References checked 2026-09-22: linear.app/changelog (dated entries with large screenshots) and rocketlabcorp.com/launch/electron (spec list). Apple Newsroom and spacex.com render client-side, so their structure comes from their known layouts rather than a fetched copy; Boom's XB-1 timeline page now returns 404.
- Press photos with printed captions (YTN's lower third) need a nearly black foot wherever text sits on them (C, F).
- Rebuild after the normal preview build: `node output/build-news-proposals-2.mjs`. Checked KO/EN at 320/390/768/1024/1440/1920px: every option filters 4/3/1 with no page or content overflow (the gallery and rail scroll inside their own tracks) and unclipped switch labels; gallery autoplay, dots and pause, keynote reveal, changelog sticky date, language switching and the `now` tab work; no runtime errors.

## Why ICARUS colour × gradient border: achromatic round — 2026-09-22
- The colour × border page (`/about-why-colors.html`, built from `output/about-why-colors.*` by `node output/build-about-why-colors.mjs` after the normal preview) now offers achromatic colours only. The user liked platinum × B diagonal corners but found platinum too close to the white titles. Its earlier colourful palette (gems, pastels, vivid, earth, two-tone) was replaced. Borders are unchanged.
- A flat light grey can only differ from white by being darker, which dims the chosen title below the others. So the main set is metallic two-tone (`metal: true` → `.wc-metal`): chrome #FFF→#8A94A1 (recommended, default), satin silver, titanium (slightly warm), graphite. The "Why" keyword and the chosen number carry a chrome-like vertical band (`kw`). The chosen title's sheen runs top to bottom, since a left-to-right gradient made its last word look faded. Unchosen numbers stay dim in the metal's darker tone. Flat silver and warm grey are there too, plus platinum and the current page for comparison. Presets: chrome × corners, graphite × corners, titanium × top sheen, satin × all three cards.
- The live Why cards were briefly lavender (tinted glass + accent bar + coloured number/title). That was reverted when the user moved on to this page, because its accent bar and this page's gradient ring both use `.ds-about-strength::before`. The live cards are the large-number silver version this page is built on.

## Why ICARUS colour proposals — 2026-09-22
- The user wants the "Why" keyword and the three Why ICARUS cards in one shared colour that is not blue, and asked for ways of applying it, starting from their idea of a faint tinted border. Review page: `/about-why-proposals.html?color=a&style=1&lang=ko`. It combines colour `now`, `a`–`e` with style `1`–`5`. The live `/about/` page is unchanged pending the user's choice.
- Colours: A aurora mint #8EE6C9 · B twilight lavender #B9AAFF · C sunrise coral #FF9F8A · D platinum #E3E8EF (keyword as a metallic gradient, since solid platinum ≈ the white "ICARUS") · E signal lime #C9F26B. Warm yellows were avoided because champagne/amber was just rejected for the badges.
- Styles: 1 faint border (all cards 22%, chosen 58%) · 2 tinted glass (border + 3%/11% wash) · 3 accent bar on the chosen card, borders neutral · 4 numbers and chosen title only · 5 gradient border with a soft glow on the chosen card.
- Rebuild after the normal preview: `node output/build-about-why-proposals.mjs`. Checked all colours and styles at 1440px and phone width, with no page errors.

## 국내 유일 badge back to ice blue — 2026-09-22
- The user rejected the champagne (#dcc59f) 국내 유일 badges; they are the original ice blue again (#9fdbfb text, 50% border, 13% fill). The silver capability numbers and hairlines were left as they are, since the user asked only about the badge.

## News: magazine layout applied — 2026-09-22
- The user chose G (매거진) from `/news-proposals.html` and asked for `Newsroom` instead of `What’s New`, in plain white; the published colour photographs instead of monochrome; more visible, designed category buttons, kept on the right; and less blue overall, which they found tiring to look at.
- `/news/` now opens with the white `Newsroom` heading and introduction, with a segmented all/company/media switch on the right: the selection is a solid white pill, each category carries a count badge; on phones the switch spans the width in equal segments and drops the counts below 375px. The newest matching story leads large (2:1 photo), the next three sit beside it (4:3 thumbnails), and older stories fall into a three-column grid below. A category with a single story lays photo and text side by side. A new selection fades in.
- Ice blue is gone from the page body: neutral category tag, grey dates and meta, white arrows, titles underline on hover, About's closing strip in white. Only keyboard focus rings and the shared header's active states keep the accent. The background is About's flat #060a10 (the navy corner glow is gone).
- Photographs are the originals, cropped only by object-fit (YTN's captions and KEPCO's watermark stay as published). The bundle copies went from 800px to 1200px (+~95 KB) for the lead photo; the envelope-material source is 600px, so it stays the softest.
- Validation: build and types pass. KO/EN at 320/390/768/1024/1440/1920px: no page or text overflow, category labels unclipped, filters show 1 + 3 / 1 + 2 / single, source links open safely in a new tab, no ice-blue text in the page body, no runtime errors. The older-story grid was checked with three stand-in records injected in the browser only.

## News page proposals — 2026-09-22
- The user found the compact date/title list too plain and asked for as many options as possible at the Mission/About quality level, while keeping news simple and clean. Ten options are at `/news-proposals.html?design=a&lang=ko` (`a`–`j`, plus `now` = the live page) behind a review toolbar with a photo colour toggle and a collapse button. The user chose G; see the entry above.
- Shared across options: the English heading `What’s New` (ice-blue keyword, pairing with About's What / Why / When / Where), dates in Pretendard lining tabular figures instead of mono, press photos in monochrome with colour on hover, and About's contact strip to close. A About chapter (recommended) · B When We Start timeline · C numbered index, photo opens on hover · D two-column cards · E sticky left heading · F About-hero cover · G magazine · H photo tiles · I scroll-linked pinned photo · J current list plus thumbnails.
- Photos: the bundle carries 800px copies, so `output/build-news-proposals.mjs` writes larger webp copies to the preview's `/media/news/`. The envelope-material source is only 600px (enlarged 2× there) and stays the softest in the large layouts (A, F, H, I); a larger original is needed if one of those is chosen. YTN is zoomed 1.4× to crop its broadcast captions, KEPCO 1.12× to crop the publisher watermark.
- Rebuild after the normal preview build: `node output/build-news-proposals.mjs`. Checked KO/EN at 320/390/768/1024/1440/1920px: no text or page overflow, all images load, filters, language switching, toolbar, C hover reveal, D hover colour, I scroll-linked photo; no runtime errors.

## When we start: timeline only — 2026-09-22
- At the user's request the lead (첫해부터 지금까지) and description are removed from When in both languages; the heading is followed directly by the rail, markers, years and entries.
- The last year in `when.history` is treated as the current year (`.is-current`, `aria-current="date"`): ice-blue marker and year, and two concentric rings (3s, half a cycle apart) growing from the marker. Reduced motion shows one still ring.
- **Only earlier years' markers are grey.** The user rejected greying past years' text: every year and entry stays fully legible (years #f5f8fc, entries #e6f0f8 16px/500, dates #a6c2d8 14px/600).
- Years: Pretendard 600, 34px desktop / 28px phone, lining tabular figures (was IBM Plex Mono 500 22/19px). The user found the first light-weight (300) version too faint. Month dates moved from mono to the body face to match.

## What we do capabilities: proposal E applied — 2026-09-22
- The user chose E (역량 요약) from `/about-what-proposals.html`. The old three-row fact list is replaced by `.ds-about-capabilities`: large keyword + one short line, with detail left to Why us. Order is 기체 → 운용 → 소재 (Airframe → Operations → Materials); 운용 replaces 제어 at the user's request and its line covers flight control and ground control.
- The 01/02/03 numbers were asked to look more refined and be easier to read: Pretendard 17px/500 with lining tabular figures and .1em tracking (was IBM Plex Mono 12px), each on an ice-blue hairline fading toward the photo.
- ≥1280px: three columns. Below 1280px the columns would be ~130px, so each capability becomes a row (numbered hairline above, keyword and line side by side on a shared subgrid column). Checked EN/KO at 320–1920px: no text or page overflow.

## What we do (#what-we-do, CSS `--how`) copy column — 2026-09-21
- The user found the left-hand copy hugging the margin. From 1024px up, `--chapter-copy-inset` (0→36px) moves the heading and copy in, and the copy's max-width grows by the same amount (540px + inset), so the rules end where the user approved: x662 at 1440, x636 at 1280, x708 at 1920 (start x93 / x82 / x132). The user then asked to start it slightly further left while keeping that right end, which is why the inset is small.
- To keep the text clear of the hull, the photo sits further right: `--field-right` -3.5vw (≥1440), -6vw (1280–1439), -7.5vw (1024–1279). Hull, tail and all three walkers stay inside the right fade at every width. Tablet and phone layouts are unchanged.

## Why and What right-column alignment — 2026-09-20
- Latest follow-up: moved both columns another 47px at 1440px (48px on wider screens), increasing the shared responsive offset cap from 112px to 160px. Headings and body now start at x988 on a 1440px viewport; their right gutter is retained. All 14 EN/KO responsive checks pass, with desktop screenshots reviewed (`output/about-right-shift-v2-qa.json`). This supersedes the earlier 112px limit below.
- Shifted both chapters' headings and all body content farther right into the black space using the same responsive offset, capped at 112px. At 1440px, Why moves another 44px and What moves 108px; both copy columns begin at x941 with the normal right gutter retained. The offset tapers to zero at 768px and does not affect the phone layout.
- Rebuilt the current 3000/8801 preview. Fourteen EN/KO checks at 320/390/768/1024/1280/1440/1920px confirm aligned heading/copy origins, one-line titles and no text/page overflow. Desktop screenshots reviewed; results: `output/about-right-shift-qa.json`.

## About chapter typography enlarged — 2026-09-20
- The user requested more visible chapter headings and the text underneath. All four chapters now use desktop headings of 46–58px (previously 38–46px), 24px semibold leads and 18px brighter body text. Tablet uses 40/22/17px, while phones use 32–42/22/16px. Fact/place headings, descriptions and captions are also larger and brighter.
- Keyword emphasis and single-line English chapter headings remain. The 15% enlargement of the How photograph remains; desktop/phone screenshots show readable copy clear of the subjects. Built the current preview for both ports. Chapter layout, image, heading, language and navigation checks passed at eight EN/KO viewport combinations; the older `check-about-a.mjs` hero-only baselines still differ from subsequent hero revisions. The separate full-subject photo checks pass all 14 cases.

## Current homepage server and cache correction — 2026-09-20
- Both local ports 8801 and 3000 now serve `.design-sync/.cache/preview/`, the current React work. Port 3000 previously served the legacy repository root; do not restart it there. Use `.design-sync/serve-preview.py --port 8801` (or `--port 3000`) after the build.
- The preview server returns `Cache-Control: no-store, max-age=0` and bypasses old conditional cache entries. The builder includes a content hash in the main CSS/JS URLs, so reloading picks up source changes. Windows requests to both ports confirm the current About HTML and the new field-team photo in the bundle.

## How we start supplied photo applied — 2026-09-20
- Latest adjustment: enlarged the displayed photograph by exactly 15% at each breakpoint (60vw→69vw, 58vw→66.7vw, 100%→115%), preserving its horizontal center with corresponding right offsets. The full airship and ground team remain visible. Rebuilt the shared 3000/8801 preview; all 14 EN/KO viewport checks pass, and desktop/phone screenshots were reviewed.
- The user requested placing the attached lawn/airship photograph in the actual How chapter. `AboutPage.controlImageSrc` now defaults to `/media/about-field-team-source.png`, and the normal preview build copies the exact 1448×1086 source into `media/`.
- The live `/about/` page now uses the wider composition (in colour since 2026-09-21 at the user's request, muted to saturate(.6) brightness(.74) so it sits with the hero film; the other About photos and the CFD stay monochrome): intrinsic image proportions, right-side placement, and edge gradients that leave the full hull, tail fins and all three people visible. Desktop/tablet copy stays on the left; the existing phone layout places the photo above the copy. This supersedes the earlier statement that the photo is proposal-only.
- Build/type declarations/CSS pass. EN/KO at 320/390/767/768/1024/1440/1920px pass actual-image, subject bounds, text separation, aspect-ratio, overflow and runtime checks. Desktop/tablet/phone screenshots reviewed: `output/how-photo-applied-*.png`; report: `output/how-photo-applied-qa.json`.

## About CFD half-scale adjustment — 2026-09-19
- The user requested halving the oversized CFD. Video dimensions are now exactly 50% of the previous desktop/tablet/mobile values: 175%→87.5%, 210%→105%, and mobile height 155%→77.5% with min-width 225%→112.5%. Desktop/tablet retain their visual centers; mobile keeps the hull-focused placement. The full-section background, monochrome opacity and typography remain.
- A left-side source mask prevents the legend reappearing after scaling down and softens the crop boundary. Build and desktop/phone visual review pass; playback and page width remain normal.

## How we start photo proposals — 2026-09-19
- Latest correction (revision 3): the user requires the complete airship and the whole person holding its nose to remain visible. The original aspect ratio is now preserved at a smaller explicit image width (desktop 60vw for A/B, 66vw for C/D), with responsive sizes for tablet/phone. Image edge fades and the left text gradient finish before the front person, and the bottom fade starts below their feet. All four options pass source-subject bounds checks for EN/KO at 320/390/768/1024/1440/1920px; screenshots `output/how-photo-v3-*.png` show the full figures. This supersedes the oversized crops in revision 2 below.
- User supplied a new photo of the ICARUS airship carried across a lawn and requested black-and-white/color crop proposals. The exact attachment is `static/about/about-field-team-source.png` (1448×1086), preserved unchanged. Do not substitute the similar earlier Downloads image.
- Review `/about-how-photo.html?photo=a&lang=ko` for A monochrome/wide, B color/wide, C monochrome/close, D color/close. The user rejected the earlier treatment and requested matching the current site's left-text gradient. Revision 2 restores the full About context, exact original copy/heading geometry and tablet side-by-side layout. A broader opaque-to-transparent #060a10 gradient secures the left text column and reveals the photo gradually on the right; upper/lower edge fading and reduced brightness/saturation blend it into the existing dark page. The original right-side visual width (72%) is restored and the image shifts right; enlargement is moderated. The preview scrolls to How on entry beneath a fixed comparison toolbar. The current About page is unchanged pending the user's choice.
- Rebuild with `node output/build-about-how-photo.mjs` after the normal preview. Details: `output/ABOUT-PHOTO-PROPOSALS.md`. Desktop/mobile, EN/KO, actual image loading, state switching, keyboard controls, direct links and reload checks pass. A is the suggested continuation of the site's monochrome direction; D is the more vivid close-up option.

## About oversized CFD background — 2026-09-19
- The user requested a dramatically enlarged CFD composition filling almost the screen. What now uses an edge-to-edge background across the whole section (minimum 760px / 88svh), with the video enlarged to 175% of the viewport width and cropped beyond the left edge. This replaces the earlier small contained 590×378 frame.
- The grayscale/translucent treatment remains. A stronger gradient darkens the area behind the right-hand copy and fades the top/bottom edges; the caption sits at the bottom-left. Video proportions remain 16:9.
- Tablet uses a separate crop; phones show a 360–480px tall, full-width close-up above the copy, retaining the large-scale composition without overflowing the text.
- Build and visual review pass at 1440/1024/768/390/320px. Targeted checks confirm no text/page overflow, original 16:9 video proportions and muted playback (`output/about-cfd-large-qa.json`, `output/about-cfd-large-*.png`).

## About CFD monochrome treatment — 2026-09-19
- The user requested matching the earlier black-and-white photographs instead of the vivid CFD render. The video and its poster now share grayscale, 90% brightness, 74% opacity and a very light 0.3px blur through CSS. Screen blending removes the residual dark rectangle; wider edge fading softens the boundary into the page. The animation and source assets are unchanged.
- Build and desktop/phone visual review pass; the airship silhouette and moving flow remain visible (`output/about-cfd-mono-1440.png`, `output/about-cfd-mono-390.png`).

## About Why alignment and CFD visual — 2026-09-19
- Why heading and copy move together to the right on tablet/desktop (about 64px at 1440px, capped at 72px); its gradient reaches the dark background sooner so text sits over it. Phone stacking stays unchanged.
- What now displays the supplied airship CFD animation beside the company claim. Original `static/about/about-cfd.gif` is preserved; the page serves a 15-second, 20fps H.264 copy plus a WebP poster. Source: the matching high-quality `ICARUS_CFD1-ezgif.com-video-to-gif-converter.gif` from the user's Downloads.
- The user rejected the original white background. `output/build-about-cfd.mjs` keys near-white pixels from the source animation over the chapter's #060a10 background, retaining the colored airship and flow. The served `about-cfd-dark.mp4` is about 6MB versus the 21MB GIF; the matching poster also uses the dark background. The frame border is removed and the outer edges fade into the chapter.
- The CSS viewport crops the 800×450 source to x192/y36/590×378, removing the left legend and excess margins. Animation plays when visible and pauses offscreen or with reduced motion. Source media remain uncropped for future reframing.
- Validation: build passes. Why alignment checked at 1440/1024/390px (`output/why-aligned-*.png`). Dark CFD screenshots at 0.1/5/10 seconds show intact hull/tail on desktop and phone; actual frames differ and natural playback loops after 15 seconds. Muted playback, reduced-motion/offscreen pause, and 320/768px overflow checks pass (`output/about-cfd-qa.json`).

## Selected About A layout and keyword emphasis — 2026-09-19
- The user selected concept A and requested applying it to the actual About page with slightly more emphasis on Why / How / What. `AboutPage.tsx` now uses four alternating image/copy chapters: Why and What have image left/copy right; How and Where have copy left/image right.
- A shared `ChapterHeading` keeps every English section title on one line and separates its opening word into a pale ice-blue semibold keyword; the remainder is regular near-white text. Titles stay restrained at roughly 44px desktop / 32px phone, instead of the former oversized two-line setting.
- Why and How retain black-and-white development/test photographs with mirrored gradients. The source photographs are provisional until the user supplies early-startup photos. What combines the airframe cutout with three concise capability rows, and Where pairs location/status details on the left with the existing city map on the right. The separate old timeline and technology cards are replaced by the chosen A composition.
- The top video hero follows the separate latest "Current ABOUT hero" decisions below, including the concurrently restored original controls. The selected A work changes the chapters below it. The older proposal page at `/about-layouts.html` remains available as the earlier design comparison; the selected implementation is now `/about/?lang=ko`.
- Validation: build, type declarations and CSS pass; EN/KO at 320, 390, 768 and 1440px pass layout, image and runtime checks. Desktop and mobile screenshots were visually reviewed. Mobile airframe width and map caption spacing were corrected; hero geometry remains unchanged. Checks and review artifacts: `output/check-about-a.mjs`, `output/about-a-qa.json`, `output/about-a-*.png`.
## About alternating layout proposals — 2026-09-19
- User requested multiple design proposals inspired by https://www.unastella.com/company/about-us: alternate image/text left-to-right each section, retain the gradient into copy, and reduce English titles to one line higher in the section.
- Three separate review concepts are at `http://localhost:8801/about-layouts.html?design=a` (mirrored gradient; recommended), `?design=b` (independent upper heading and split photo/copy), and `?design=c` (staggered archival photographs and overlapping copy). The reviewer tabs support keyboard navigation and direct query links.
- These are alternatives for review; the actual AboutPage, stylesheet, top hero, and main `/about/` preview remain unchanged by this proposal task. All concepts use the four requested sections; actual early-startup photographs will replace provisional development/test images later, as the user confirmed.
- Sources: `output/build-about-layouts.mjs`, `output/about-layouts.css`; run `node output/about-layout-assets.mjs` then `node output/build-about-layouts.mjs` from the repo root to regenerate local preview artifacts. The map reuses the existing AboutLocationsMap component.
- Verified A/B/C at 320, 390, 768, 1440px, all images, title nowrap, overflow, URL selection and tab/keyboard behavior. Screenshots: `output/layout-{a,b,c}-desktop.png` and `-mobile.png`; report `output/about-layouts-qa.json`.
## About editorial photo direction — 2026-09-19
- Main body headings are now the English **Why we start / How we start / What we do / Where we are** in both languages; the Korean marketing headlines and separate conviction panel are removed. Supporting copy sits beside the oversized titles on desktop and beneath them on mobile.
- Why and How use full-width monochrome documentary photography with dark text contrast overlays. Why currently uses the existing materials-development photo; How uses the supplied flight-test team frame. These are provisional composition assets, not asserted to be early founding photographs. The user confirmed they will prepare actual early-startup photos for later replacement.
- `AboutPage.researchImageSrc` and `controlImageSrc` are the two photograph replacement points. Corresponding captions live in `i18n/about.ts` (`why.imageCaption`, `how.imageCaption`). CSS provides grayscale and responsive crops, leaving source image files unchanged.
- Four development stages now appear as a compact sequence beneath the How photograph (four columns desktop, two tablet, one phone). Technology and location details remain below their new English headings.
- The body uses the current approved video hero and intro; see the latest hero decisions below. The chapter-navigation band has since been removed at the user's request.
## About structure revision — 2026-09-19
- `/about/` now follows the requested **Why we start → How we start → What we do → Where** flow. The existing full-bleed flight video, hero copy (including `ICARUS의 시작`), and responsive crop are preserved. See the current hero decisions below for the latest control and navigation choices.
- The body replaces photo-placement guides with the supplied flight-test still, the existing airframe cutout, and envelope-material photography. A four-stage development timeline uses phases rather than unsupported dates. Three capability columns cover integrated unmanned-airship development, envelope materials, and stratospheric systems in development.
- The company positioning comes directly from the user's brief: `국내 유일 무인 비행선 개발 기업` / `국내 유일 성층권 시스템 개발 기업`. On 2026-09-21 softer and narrower alternatives (전문 개발, 전주기 개발, 성층권 플랫폼) were tried and the user chose to keep this exact wording; don't reword it again without being asked. It is stored as `what.claims` ({ only, text }) and shown as ruled rows (user's pick of mockup B over keyword-colour A and accent-bar C, `output/claim-design-*.png`). The user asked for `국내 유일` to stand out more, so it is a blue pill badge above each claim rather than a small label. Locations also follow that brief: Gwangju office/assembly hangar, Jangseong test area, and Goheung coming soon. No specific future facility, opening date, or address is inferred.
- `AboutLocationsMap.tsx` reuses the existing Natural Earth coastline and projection to mark approximate city centers. Future Goheung uses a hollow marker and dashed leader; adjacent text communicates all locations and statuses accessibly.
- New bilingual copy lives in `src/i18n/about.ts`. Section copy, captions, image alternatives, status labels, metadata, and contact CTA follow the shared language preference. The new CSS remains scoped to `.ds-about`.
- Validation: package build/type declarations/CSS pass. EN/KO at 320, 390, 768, 1024, and 1440px have no content overflow, all images loaded, correct section order, and no browser runtime errors. Reduced motion pauses the hero. Desktop sections and mobile full-page screenshots were visually reviewed; `output/check-about-redesign.mjs` reproduces checks and screenshots.
- Prior `output/about-story.html` is an earlier separate proposal, not the updated page. Review the current implementation at `http://localhost:8801/about/?lang=ko` (or `lang=en`).
# design-sync notes: ICARUS design system

## Current ABOUT hero — 2026-09-19
- User selected A's title size: the actual About hero now uses 90% of its former desktop, mobile and short-screen font sizes. Pretendard 600 remains. Verified exact computed-size parity with A, and unclipped EN/KO title text, at 320/390/1024/1280/1440/1920px.
- Title font proposals requested after the visibility adjustments are available at `/about-type.html?font=a&lang=ko` (also b/c/d/original, and lang=en). A uses Pretendard 600; B SUIT 500; C IBM Plex Sans KR 500; D Noto Serif KR 500. All proposed title sizes are 90% of the current responsive values, with matching short-screen overrides; original retains the current actual site typography. The title sizes from A are now applied to `/about/`; the separate reference page remains available for the font comparison. Inline comparison controls occupy the existing empty film-button space and can be hidden. EN/KO selection, direct links, keyboard selection, reload persistence, local font rendering, and first-viewport geometry pass desktop/mobile checks. B is the suggested direction. Sources and licenses live in `output/about-type-fonts/`; regenerate via `node output/build-about-type.mjs` after the preview build.
- Latest visibility adjustment increases the upper-right location from 10px to 13px, the lower-left story link from 10px to 13px (8px to 11px on mobile), and the lower-right footage caption from 9px to 12px. Location/caption use brighter #eef6ff, and both bottom texts use weight 500. EN/KO share the styles; existing mobile visibility and full-screen hero spacing remain.
- Following the full hero restoration, the latest user request changes the upper label to “회사 소개 / ICARUS LTA” (“ABOUT US / ICARUS LTA” in English; on 2026-09-21 the user shortened it to just “ICARUS” in both languages) and increases its size from 12px to 14px on desktop and 10px to 12px on mobile. Only the inline film-viewing control (play icon, viewing text, 00:19) is removed; its space remains as a noninteractive spacer. Its unreachable dialog is removed too. Location, footage caption, bottom-right background playback control, story link and arrow remain.
- The hero fills the first viewport: 100dvh (100svh fallback), without the previous maximum height. A 560px minimum protects content on extremely short windows, and compact spacing/headline sizing keeps controls visible on smaller screens. The Why chapter begins after the hero, so its photograph no longer peeks into the first screen. Approved introduction/title remain, and background autoplay respects reduced motion/visibility. Build and EN/KO desktop/mobile geometry checks pass after the selective removal.
- This restoration is scoped to the top hero. The previously removed chapter-navigation band stays absent; lower story sections are unchanged by this task.

## ANIM B observation emphasis — 2026-09-19
- “위성 대비” and the observation applications now use 1pt larger type at every breakpoint (`calc(previous px + 1pt)`), brighter `#d6e2f2` text and weight 500. Both EN/KO share the change.
- “실시간 관측” / “Real-time Observation” now shares the communication metrics' font size, weight, ice-blue color and line height. Unified selectors keep it equal to “10배 저렴한 비용” across desktop, mobile and short-height breakpoints (17/13/14/12px as applicable, weight 600). Existing placement and scroll timing are preserved.

## Bilingual News and Contact — 2026-09-19
- User confirmed no mail service is available and explicitly requested design first. Delivery is deferred. The contact draft remains interactive for field/validation review; clicking a valid inquiry shows a neutral preview notice and sends nothing. Desktop spacing and mobile intro/message height are tightened for the compact layout.
- Added `/news/` and `/contact/` to the existing preview. Direct links accept `?lang=en` or `?lang=ko`; language selection persists between pages.
- News has a featured article, archive rows and All / Company / Media filters, using the four real stories from the legacy homepage. Contact now follows the user's UNASTELLA inquiry-form reference: email, subject, message and Send inquiry, with a compact desktop split layout and mobile stack. Direct email remains `contact@icarus-airship.com`. Real delivery awaits a configured public form endpoint; no-service and failure states preserve the draft. See `CONTACT-FORM.md`. Shared Contact navigation reaches the page.
- Both pages extend the current dark homepage design and adapt to phones. Source records, reference pages and behavior notes are in `NEWS-CONTACT-SOURCES.md`.

## Phone preview loading — 2026-09-19
- Both LAN listeners (192.168.10.11:8801 and 192.168.0.116:8801) forward to the WSL preview server; Windows and WSL requests to the Wi-Fi address return 200. Actual phone access still requires confirmation from the user.
- Reproduced a blank page by holding the two remote font CSS requests: synchronous head scripts waited for CSS and the document body was never parsed. `build-preview.mjs` now replaces remote font imports with local font faces from `static/fonts/`, defers vendor/app scripts, and mounts on DOMContentLoaded. A visible loading state replaces the empty root while scripts arrive. Font licenses and provenance are included.
- `/connection-check.html` is a plain, self-contained page with no JavaScript or external assets, for separating LAN access from application loading. It links to fresh main/About URLs.
- Verified main/About/animation rendering with external requests held and with local font downloads stalled, plus the connection page with JavaScript disabled. EN/KO layout and navigation checks still pass with the local fonts.

## ANIM B viewport fit — 2026-09-19
- Reserve the fixed navigation's 65px / 81px height above the sticky scene. The heading keeps its natural height and the animation flexes into the remaining `100svh` space, replacing the 400px / 520px minimum frame heights that pushed the title behind the header.
- Windows up to 740px high use tighter heading/body typography and closing-callout spacing. Other viewports retain the existing heading and description sizes. The mobile preview-only Scroll frames pill is hidden so it cannot cover observation labels.
- Built and refreshed port 8801. Verified actual forward/reverse scrolling in EN/KO at nine viewport sizes from 320×568 to 1920×1080: heading clears navigation, frame stays visible, and closing callouts fit without overlapping the mobile map.

## Bilingual About draft — 2026-09-19
- About now follows the shared EN/KO selection through `useLanguage()`. Editorial copy lives in `src/i18n/about.ts`; Korean is adapted for context and clarity rather than sentence-by-sentence English syntax. All headings, body text, photo guides/captions, image alternatives, film controls, section navigation, calls to action and document metadata switch together. Korean headings use roomier line heights and restrained tracking. Verified both languages at 320/390/768/1280/1440px, film-dialog controls, refresh persistence and main/About navigation.
- Revised to a company-origin story from the public Notion index and five relevant child pages. People is removed. The new sequence is **The making of ICARUS → Our beginning → The search → The work → Our mindset → contact**. Two Korean photo-placement guides mark missing research and development photographs; `researchImageSrc` / `controlImageSrc` can replace them. Existing materials photography supports the development story. No invented dates, staff profiles, performance superlatives or patent ownership claims. See `ABOUT-STORY-SOURCES.md` for sources and the image plan.
- `/about/` is generated by `build-preview.mjs` and renders `SiteHeader`, the new `AboutPage`, and `SiteFooter`. The default ABOUT / 회사 소개 links already point to `/about`, which the local server redirects to `/about/`.
- The About body sets `main lang` to the selected EN/KO preference, matching the header/footer. Navigating back through Mission or the company wordmark preserves it.
- Supplied 19-second film and two extracted frames live under `static/about/` and are copied to the preview's `/media/`. Background playback is muted and respects reduced motion; the full-film dialog includes native sound/seek controls and Escape to close. About omits the unrelated NASA hero credit.
- The initial purpose/principles/People layout has been replaced by the Notion-based story above. The dark visual direction remains consistent with the Mission page.
- Header accepts `activeHref`; About highlights its navigation entry. Below 768px, the Menu button opens page links and Contact while the language controls remain visible.

## Latest homepage revision — 2026-09-18
- Footer navigation now shares the header's Mission / About / Career / News links and their Korean labels. The address spans the full footer grid width below the company name: one line from 768px, natural wrapping on phones. Removed the old narrow address column and duplicate footer link lists.
- ANIM B's airframe callouts are modestly larger and brighter: SVG name/detail sizes 9 / 8 (previously 7.6 / 6.9), weights 700 / 500, tighter 0.8 name tracking and 11-unit detail line spacing. Use pale blue names and lighter body text, with slightly clearer leaders/rules. The two bottom labels move from y=246 to y=226, bringing them closer to the aircraft. EN/KO callouts checked at 320/390/768/1280px with no text overlaps or clipping.
- ANIM A altitude-axis names (저궤도 / 성층권 / 대류권 / 지상) use bold 8px on phones / 12px from 768px, reduced by the requested 3pt (4px) from 12px / 16px, with tight Hangul tracking. Neutral names use opaque `#c9d8ec`; the stratosphere name starts at 85% ice-blue opacity and brightens to 100%. Refreshed the local preview on port 8801.
- Korean ANIM A labels: laser/RF communication, ground service captions, Direct to Cell and the bottleneck badge use 11px on phones / 14px from 768px, with tighter tracking for Hangul. The bandwidth-gain badge uses 11px / 13px. Korean copy is **지상 기지국** and **통신 병목 발생**. Allow the ground caption and bottleneck to wrap on narrow phones; English typography stays at its existing sizes. Checked 0%, 50% and 100% at 320/390/768/1280px.
- ANIM B's closing frame now adds **Communication Relay** (10 times cheaper / 100 times faster than satellite) and **Observation** (Real-time Observation; Maritime, Wildfire, Disaster response, Environmental monitoring). Both fade in with Coverage Radius over progress 0.90–0.98 and reverse with scrolling. White section titles, thin blue rules and blue key details distinguish the hierarchy. Desktop copy sits to the map's right; below 768px the SVG makes room for two columns underneath and the radius stays legible in the upper-left corner. EN/KO copy lives in `endurance.capabilities`. Verified the build, 320/390/768/1280px layouts and actual forward/reverse scrolling in both languages; refreshed the local preview on port 8801.
- EN / KO buttons beside the header Contact pill switch the entire homepage: navigation, hero, both scroll scenes (including diagram labels), roadmap, closing CTA and footer. English is the first-visit default; `icarus-language` in localStorage preserves explicit selections. `useLanguage()` shares state across the components without a provider or page reload. Custom copy props still take precedence. Korean body copy keeps words together; SVG callouts account for Hangul glyph widths.
- Header: MISSION / ABOUT / CAREER / NEWS / CONTACT, with CONTACT replacing the former Get in touch pill (no duplicate link). After visual feedback, navigation is uppercase, weight 500, 14px at medium widths / 15px on desktop, tracking 0.05em; original text colours stay. Wordmark: ICARUS with a closely attached LTA company suffix (9px mobile / 10px desktop, weight 500, tracking 0.03em), baseline-aligned and lowered 1px. Cancel ICARUS's trailing letter spacing so the visible gap is only 4px.
- Remove Missions from the homepage composition (including the preview builders). The reusable component remains available for subpages.
- Roadmap defaults: PHASE 01 **Small-scale Airship Flight test** / **In Progress**; PHASE 02 **Stratosphere airship Flight test**; PHASE 03 **Scale Up**; PHASE 04 **Commercial Service**.
- Phase/status labels use the same Pretendard sans-serif as body text, at 16px with restrained tracking; titles are 22px on mobile and 24px on desktop. Connections are evenly dashed with breathing room around each node. Only the blue PHASE 01–02 connection moves, flowing one 13px dash interval every 1.6 seconds. PHASE 01 emits two concentric rings on a 3.2-second loop, offset by 1.6 seconds. Use a vertical timeline below 1024px; reduced motion keeps the dashed connection static and hides the ripples.
- This supersedes the original six-section wireframe references below: the homepage now has five sections (hero, two scroll scenes, roadmap, closing).

## What this design system is
- `design-system/` is a React/TypeScript component library for the **planned homepage renewal**, not for the site currently
  live at icarus-airship.com (`index.html` + `partials/`, HTMX + Tailwind CDN, untouched by this work).
- It follows the "Icarus 비행선 홈페이지 개선안" design project on claude.ai/design
  (`https://claude.ai/design/p/dd005cee-2940-471e-9614-4a88f6f144fe`):
  - **Structure** from wireframe board t8 ("확정 구조"): one-page main (hero → the 20 km gap → endurance → missions →
    roadmap → contact) plus four subpages (Info / Technology / Career / Contact), two scroll-linked animations, static site,
    no forms or backend.
  - **Look** from the dark boards 3a/3c, per the user's instruction on 2026-09-17: black space base, ice-blue accent,
    premium restraint. Exact values: `#02030a` base, `#8fd8ff` accent, Pretendard + IBM Plex Mono.
- **English and Korean.** The user requested an EN / KO switch after the original English-only version. Homepage defaults now follow the selected language; English remains the first-visit default. Translations live in `design-system/src/i18n/content.ts`.
- A faithful React port of the CURRENT live site was built first and then replaced when the direction changed. It is not in
  git; if it is ever needed again it must be rebuilt from `partials/`.

## Environment (Windows + WSL)
- Repo lives in WSL (`/root/icarus-homepage`); run node/npm/git inside WSL
  (`wsl.exe -d Ubuntu -e bash -lc 'cd /root/icarus-homepage && ...'`). Git from Windows fails with "dubious ownership".
- `-d Ubuntu` is not optional: the default distro on this machine is `docker-desktop`, which has no bash, so a bare
  `wsl.exe bash -lc ...` dies with `/bin/sh: bash: not found`.
- A shell whose cwd is the `\\wsl.localhost\...` UNC path cannot launch `wsl.exe` at all
  ("Failed to translate ..."); `cd` to a real Windows path such as `/c/Users` first.
- Node 24 LTS installed to `/usr/local` from the nodejs.org tarball. Playwright chromium in `/root/.cache/ms-playwright`.
- `wsl.exe --cd /root/...` fails (ERROR_PATH_NOT_FOUND); `cd` inside `bash -lc` instead.
- npm 11 skips install scripts (esbuild, @parcel/watcher); the prebuilt optional binaries work anyway.

## Build
- `cd design-system && npm ci && npm run build` (scripts/build.mjs): sharp converts `../static` images to webp in
  `generated/assets/` (mtime-cached; the 21.5 MB about_img.gif takes ~55 s cold), esbuild inlines them as data URLs into
  `dist/index.js`, tsc emits `.d.ts`, the Tailwind CLI compiles `dist/styles.css`.
- Converter: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules design-system/node_modules --out ./ds-bundle`.
- **`.design-sync/guide-ko.html` is the Korean guide the Design project shows** (the user reads this, not `README.md`).
  It is NOT produced by the converter: copy it in and upload it by hand every time the English docs change -
  `cp .design-sync/guide-ko.html "ds-bundle/ICARUS 디자인시스템 가이드.html"`, then `write_files` that path. It drifted
  once already (still described the old hero, the centred `Section`, and `overflow-x-hidden`), so re-read it against
  `ds-bundle/README.md` whenever conventions.md or a component's JSDoc changes.
- Re-sync driver: `node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules design-system/node_modules
  --out ./ds-bundle --remote <anchor>`. `--node-modules` must point at `design-system/node_modules` (react lives there);
  `.ds-sync/node_modules` only holds the harness and fails with "react not found under --node-modules".
- **`package-build.mjs` wipes the whole `ds-bundle/` directory**, including `_screenshots/`. After any full build, re-run
  `package-capture.mjs` for every component, not just the changed one, or the other review sheets are gone.
- Bundle is ~1.3 MB, nearly all inlined imagery. `about.webp` (614 KB animated) is the largest item and is currently unused
  by any component - drop it from `scripts/build.mjs` if the bundle needs to shrink.

## Styling decisions
- Tailwind v4. Brand tokens live in `@theme` in `design-system/src/styles.css`: `--color-space-*` (page), `--color-ice*`
  (accent), `--color-mist*` (text), plus `--animate-float/drift/twinkle`.
- The stylesheet only contains classes found in `design-system/src` plus the `@source inline(...)` safelist. Designs that
  use a class outside it render unstyled: extend the safelist and re-sync. `.design-sync/conventions.md` documents exactly
  what is available - keep the two in step.
- Fonts are remote: Pretendard (jsDelivr) and IBM Plex Mono (Google Fonts) are `@import`ed at the top of `styles.css`.
  Validate reports `[FONT_REMOTE]`, which is informational. If those CDNs are ever unreachable the stack falls back to
  system fonts.
- `.ds-stars`, `.ds-aurora`, `.ds-earth` are hand-written component classes in `@layer components` - the CSS-drawn
  Earth limb needs the `::after` rim, so it cannot be expressed in utilities alone.
- **`AltitudeScrollSection` is ANIM A from the user's own wireframe** - Claude Design project
  `dd005cee-2940-471e-9614-4a88f6f144fe`, file `Homepage Wireframes.dc.html`, block `8b` ("ANIM A 프레임",
  captioned 대역폭 병목 → 중계 해소). The user's latest instruction (2026-09-18) sets three milestones:
  **0%** shows Ground Station, Mbps and Network bottleneck immediately; **50%** adds the airship and
  `Gbps` / `x 100 bandwidth`; **100%** adds City, Mobile, Mobility and Military with Direct to Cell links.
  The ground station, constellation and clouds remain visible and fixed throughout; orbital links and
  the satellite-to-airship laser share the same pulse animation, independently of the blue radio downlink.
  There is no resolved-bottleneck check badge or B2C/B2B text.
  The link colours remain **red `#ff4a5c` (core `#ffd9dd`, rate `#ff9aa4`, label `#ffb4bc`) for every optical laser** -
  crosslinks and the hop up to the airship alike, so one colour always means one kind of link - `#4aa8e0` for the
  radio relay, amber `#d9a441` for the weak direct drop, and ice `#8fd8ff` left on the hardware. **None of these
  are theme tokens** - they are local constants so the brand keeps its single accent and nothing outside this
  scene can reach for a second hue. Two cloud banks flank the downlink rather than sitting on it, so the link
  threads between them and stays visible. The direct drop fades over 0.30–0.38, the airship enters over
  0.36–0.50 and the relay lights over 0.42–0.50; both rate labels sit to the column's right.
- **Direct to Cell service groups** (2026-09-18): City (buildings), Mobile (handset), Mobility
  (adjacent UAM and ship, centred at 75% with one caption below) and Military (field communications vehicle
  at the far-right 96% position) flank the ground station. All service icons, captions,
  independent dashed paths from the airship and the Direct to Cell label fade in together over 0.85–1.00.
  They are completely hidden in the initial and 50% frames. The central ground-station band remains.
  Link-kind labels and bandwidth figures use weight 700; laser labels use full-opacity light pink and RF
  direct RF labels full-opacity amber (#f2c877). These link-kind labels are 9px on phones / 11px on desktop.
  Direct RF labels sit 28px right of the link on phones / 44px on desktop. The blue relay has a larger
  RF Communication label (12px desktop) above Gbps, with a blue outlined x 100 bandwidth pill beneath;
  all three are centred together. Network bottleneck keeps its amber pill without a leading dot. The RF Mbps
  and airship-to-satellite Tbps are centred beneath their kind labels. Direct to Cell keeps its existing
  size and ice-blue colour, and sits at 62% of the frame to describe the direct service paths.
  All five ground captions share GroundCaption: weight 700, ice-300 (#b9dcff), identical size and
  line-height, and one common top position. Ground Station wraps on phones with its first line aligned.
- The default altitude-scene airship follows the user's Sceye reference: an elongated, low-profile
  envelope, rounded nose on the left, tapered tail on the right and small trapezoidal fins.
  The hull and fins mirror across the horizontal centreline (SVG y=24). Soft shading gives it a
  blue upper hull and silver-blue belly; a navy solar strip with bright cell dividers (depth reduced 25%)
  follows the upper silhouette. There is no gondola, side unit or propeller.
  It does not use the ICARUS CAD image. `airshipSrc`
  remains an optional explicit image override; other homepage sections keep their own imagery.
- Below 360px, the altitude column narrows to 88px and link-label tracking tightens so the larger
  communication labels stay clear of the link column. The bottleneck chip stays within the frame.
- **The bottleneck is named in words, and the link stays a straight line** (2026-09-18). The wireframe labels
  the drop `~ Mbps / Network bottleneck`, so the scene carries that label, and the amber drop runs **straight from
  the satellite to ground level**: a translucent amber band (`<rect>`, `DROP_HALF` either side of the centre, a
  gradient that only softens its two ends) with the dashed flow line down its middle. The band is
  **parallel-sided** - the drop does not narrow, it is simply never wide. A funnel tapering into a pair of amber
  jaws at the cloud deck was tried and **the user rejected both** (2026-09-18); do not reintroduce either shape.
- **Every link says what kind it is, and the bottleneck is a chip** (2026-09-18). A link's label is two lines:
  the kind of hop (`crosslinkKind` / `directKind` / `laserKind` - `Laser Communication (FSO)` on the optical
  links, `RF Communication` on the direct drop) in the axis's own uppercase micro-caps, over the figure it
  carries, and the figures carry **no tilde** (`Tbps`, not `~Tbps` - the user dropped them 2026-09-18).
  `Network bottleneck` used to be a third line under the figure and the user called that stack too much type; it
  is now a **bordered chip beside the link**, under the figure it qualifies. **There is no monospace left in this
  scene** - the user asked for the link labels to match the altitude scale's face, so `font-mono` is gone from it
  entirely (conventions.md and guide-ko.html said the opposite until now; they are updated).
- **All three downlink labels hang off the right of the column**, stacked: kind over figure, then the chip. The
  drop and the relay never share a frame, so they can take the same side without meeting. The crosslink's label
  sits **under its own span** on the left - `md:left-[30%]` is the midpoint of `SAT_X[0]..SAT_X[1]`, keep the two
  in step. Below `md` it goes flush left instead of centred: the phone plot is only ~226px and the band takes
  28px out of the middle of it, so a centred label ran straight over the band.
- **The two bands are the argument, and their ratio is the whole of it.** The radio relay is drawn as the same
  kind of band (`RELAY_HALF`), and it is deliberately **wider than the amber drop** - megabits against
  gigabits, read off the widths rather than off the labels. Keep `DROP_HALF < RELAY_HALF`; the user asked for
  that ratio explicitly on 2026-09-18. The wider band has to stay inside the gap between the two cloud banks,
  which is what caps both on a phone, and each band's rate label is positioned off its own edge (class-based
  `left-[calc(50%+Npx)]`, per breakpoint, because the bands narrow with the frame). The wireframe's frame ② also has the airship
  **enter from the right** ("오른쪽에서 진입, ~Mbps 링크 소멸"), so `airshipIn` drives its x as well as its
  opacity, eased with `easeOut` so it settles instead of snapping. It comes in from `AIRSHIP_FROM` - a third of
  the way out from the link to the right edge, which is about where the wireframe's own entry arrow starts - not
  from off the frame, which is what it used to do and what the user corrected on 2026-09-18.
- **The altitude scale is a real axis, and the plot starts where the rule is.** Four rungs - `LEO 400–700 km`,
  `STRATOSPHERE 20 km`, `TROPOSPHERE ~10 km` (the wireframe said ATMOSPHERE; the user relabelled both it and the
  wireframe on 2026-09-18), `GROUND 0 km` - each **a figure with its name under it**, both
  right-aligned into a rule down the left edge with a tick on it. Everything the axis measures lives in a sibling
  box that begins at the rule (`left-[100px] md:left-[152px]`), so one percentage means the same height on both
  sides and every rung is level with the layer it labels; the earlier version floated the labels inside the plot
  with ad-hoc `translateY(-132%)` nudges and nothing lined up. The 20 km rung is **STRATOSPHERE throughout** - it
  brightens when the airship lands on it and is never renamed to ICARUS (tried, rejected by the user
  2026-09-18). That is why `rowLabels` has `stratosphere`/`stratosphereAlt` and no `icarus` key.
- **The downlink column is one narrow SVG** (`w-16 md:w-20`), `viewBox="0 0 200 1000"` with
  `preserveAspectRatio="none"` and its height a percentage of the frame. Every link in it is vertical and centred
  on `COL_MID`, `linkY()` maps a row's frame percentage into that 0-1000 space so the axis and the links can never
  drift, and `vector-effect="non-scaling-stroke"` keeps every stroke and dash at its true size however far the box
  is stretched. Keep the column wider than the widest halo it draws (the radio's is 15px). Percentage-space SVG
  (`viewBox="0 0 100 100"`) is still fine for the horizontal crosslinks, where non-uniform scaling costs nothing.
- **RE-READ THE WIREFRAME BEFORE TOUCHING EITHER SCROLL SECTION.** The design project is live and the user
  edits it between sessions. On 2026-09-18 `8c` was rewritten end to end - from "자체 충전 · 5년+ 체공" (a
  cutaway whose state cycled day/night/years/station) to "기체 해부 → 한반도 커버리지" - and a whole ANIM B was
  built against the stale copy before anyone noticed. `8b`, ANIM A's own frame breakdown, has since been
  **deleted** from the file; `8a` still carries the page skeleton and a one-line summary of each animation, so
  that is the place to check what a section is supposed to be.
- **`EnduranceScrollSection` is ANIM B** - block `8c`, "기체 해부 → 한반도 커버리지". Its rule is **one airframe
  carrying two scenes, as one unbroken object**. Scene 1 is a three-quarter cutaway (seen from above and to the
  right, so the solar surface shows) with five parts named in turn - envelope material, solar panels, gondola,
  side propulsion unit, payload - each on a leader line. **The airframe is drawn from the real ICARUS render**
  (the user supplied it 2026-09-18): blunt nose at -x and a long taper to the tail at +x, six thin-film cells on
  the crown, a ducted fan on a pylon off the lower flank, a tail pusher and slim swept fins, a faired gondola
  under the belly with the payload module slung beneath it, and the blue ICARUS wordmark on the flank. The hull
  is **sampled** from `hullR()` into paths rather than approximated with an ellipse - an ellipse gives a lozenge,
  not an airship - and `crownK` swings the lit upper surface's far edge, which is what carries the turn. The labels then go, and *the same object* rotates to a
  plan view, shrinks and turns its nose north while the peninsula draws under it. Scene 2 expands six
  100km footprints in turn and the airframe comes to rest at the middle-left (`central-west`) station. The name
  `EnduranceScrollSection` is left over from the old brief and no longer describes it.
- **ANIM B map presentation**: the coastline traces in two overlapping passes (north 0.38–0.64,
  south 0.44–0.70), with a bright moving tip, a soft glow and a stronger settled outline.
  Land fills, outlines, glow and region labels use neutral charcoal/grey/white; coverage retains
  blue strokes with a lighter 9% fill so the geography stays visually neutral. Keep
  normalized path dashes in map space; `non-scaling-stroke` breaks their progress under the map scale.
  At the close, the left callout reads `COVERAGE RADIUS` / `100km` and points to the middle-left footprint.
  There are six airships: five stationary marks and the one carried from scene 1. Each has exactly
  one coverage perimeter; the extra small highlight ring on the arriving aircraft is removed.
  All six footprints reach full radius by progress 0.98, including when scrolling backwards.
  The old airframe caption, bottom fleet statistic, north arrow and right-hand radius label are removed.
- **The map is data, not drawing.** `koreaCoastline.ts` replaces the coarse wireframe outline with Natural
  Earth 1:10m Admin 0 Countries 5.1.1 (public domain): 663 mainland vertices for ROK, 671 for DPRK and all
  61 source island polygons, including Jeju and the eastern islands. Regenerate with
  `python3 .design-sync/generate-korea-map.py` (GeoPandas/Shapely); the generator checks the source checksum.
  Mercator coordinates are calibrated to the existing map (maximum residual <0.032 map units).
  `koreaCoverage.ts` is generated by `python3 .design-sync/generate-korea-coverage.py` from six
  WGS84 geodesic disks of radius 100km. The generator verifies that their exact shipped polygon union
  covers both the source mainland and the simplified displayed mainland without gaps. The user
  explicitly chose **mainland coverage**, excluding islands from this requirement. The stage is
  recentered vertically and scaled slightly smaller to include Jeju without clipping. Islands fade in
  after the main coastline starts drawing; finer strokes preserve coastal detail on phones.
  The old ~96% statistic was measured against the coarse mainland and is no longer displayed or claimed
  for this detailed map. Fleet-statistic props remain optional for compatibility but no longer render.
- **The turn is a morph, not a crossfade** (2026-09-18, after the user called the first attempt
  unsmooth). Drawing a three-quarter cutaway and a plan-view mark and dissolving one into the
  other reads as a dissolve, because it is one. `Airframe` takes a single `view` (0 = the
  three-quarter angle, 1 = straight down): the solar surface's far edge swings from just over the
  crown to past the centre line, which opens a crescent out into the whole silhouette, the hull's
  `ry` and the tail fins open with it, and everything that only exists at an angle - the flank
  highlight, the belly bounce, the gondola hanging below, the battery inside - fades with
  `1 - view`. The five other airships on the map are drawn as that same end state (a dark solar
  top with a lit rim), so the arriving one does not have to change colour to join them.
- **Choreography of the bridge**: the peninsula draws in *first*, under the airframe, so the
  ground it is settling onto is already there; then one continuous move carries heading, camera,
  scale and position together. `easeInOut` on all of it, and the heading/camera finish at 72% of
  the flight so the last of it is a straight settle rather than a turn and a shrink fighting each
  other. The footprints wait until it is down before they bloom.
- **Two viewBoxes, chosen at `md`.** Both scenes share one coordinate space so the airframe can simply move from
  the middle of the anatomy onto its station on the map - but one box cannot serve a 2.3:1 frame and a 0.9:1 one.
  The drawing is letterboxed to fit, so at phone width a 440-wide box puts every label at about 4px; `WIDE` and
  `NARROW` differ only in width, and every x is derived from it. The airframe's scale is interpolated in **log
  space** (`zoom`), because 25x of it linearly stays huge almost to the end and lands on the map as a blob.
- **The homepage is exactly the six sections in wireframe 8a** (labelled 확정 구조): hero, ANIM A, ANIM B, missions,
  roadmap, closing. `StatBar` and `TechCards` are not in it - both still ship for subpages. The skeleton lives in
  three places that must agree: `conventions.md` (which becomes the uploaded README), `guide-ko.html`, and
  `render-page.mjs`. **There is a fourth**: the local preview the user actually looks at, an `index.html` under the
  session scratchpad's `preview/` directory served by a bare `python3 -m http.server 8801`. It is NOT generated from
  anything - editing the skeleton without editing that file leaves the user staring at the old page and rightly
  concluding nothing was fixed. That happened once. Find it with `ls -la /proc/<pid>/cwd` for the python process.
- **Both scroll sections lead with the heading above the frame**, full width - the heading introduces the scene. The
  frames are sized in `vh` with a `max-h` cap so heading plus frame always fit the sticky `h-screen` box, which
  clips anything taller.
- **`Hero` sets the headline into the photograph**, in the black sky left of the limb (bottom-anchored under `md`,
  with its own bottom-up scrim there). The room it has is a triangle: the limb runs corner to corner, so the sky
  beside the headline narrows in proportion to the window. Stepped breakpoint type (`md:text-6xl lg:text-7xl`) put
  "Next Infrastructure Layer" straight through the limb at 1024-1280px, so the headline is sized fluidly -
  `text-[clamp(2.25rem,4.2vw,4.5rem)]` - which tracks that triangle at every width and still caps at the old 72px.
  Windows narrower than about 1.57:1 also crop the photo horizontally (the band gets taller than the 16:9 frame),
  eating black from the left; the fluid size covers that too. Re-check `render-page.mjs` at 1920/1280/1024/390 after
  touching the headline, the hero height, or the photograph.

## Imagery and rights
- **Hero photograph is swappable.** `static/hero/` holds eight NASA (public domain) horizon photographs at full
  resolution plus the user's own derivatives (`09`, `01_revise`), `_preview-bands.png` (the eight originals cropped to
  the homepage band), `CREDITS.md` and `credits.json`.
  `static/hero/SELECTED.txt` names the active one; `scripts/build.mjs` converts it to `hero-stratosphere.webp`, and
  generates `src/generated/hero.ts` with the matching credit and crop anchor, which `SiteFooter` and `Hero` use by
  default. To change the photo: edit SELECTED.txt, rebuild, re-sync.
- SELECTED.txt names the file **without its extension**; the build resolves `.jpg`/`.jpeg`/`.png`/`.webp`, so a
  retouched PNG can replace a JPG without touching any code.
- Currently `01_revise` - the user's retouch of `01-excite-balloon-stratosphere` (NASA/GSFC, EXCITE, Kyle Helson),
  painted down to a bare horizon: balloon, payload arm and gondola deck all gone, so the frame is one diagonal limb
  from bottom-left to top-right with black sky filling the left half. Its `credits.json` entry sets
  `"position": "center"` - the diagonal runs corner to corner, so a symmetric slice of the 2.28:1 band is the only
  crop that keeps the whole line - and `"note": "retouched"`, which the build appends to the footer credit so an
  edited frame is never passed off as NASA's own. Any entry can carry either field; `Hero` also takes
  `imagePosition` directly. (An earlier revision kept the deck and wanted `"center bottom"`; re-check the anchor
  whenever the file is replaced, because the right answer follows the composition.)
- Hero encoding: native width (no downscale), WebP quality 90. Quality 72 banded visibly on the dark sky gradient.
- **Resolution ceiling**: `01_revise` is 1672px wide - fine to ~1700px, upscaled 1.15x at 1920 and 1.5x at 2560, which
  is mostly invisible on this frame because the sky is a smooth gradient and only the deck carries fine detail. If a
  sharper hero is ever needed, the un-retouched originals run 3060-4928px (see the list below).
- `node .design-sync/render-page.mjs 1920x1080 out.png [scrollY]` renders the real page skeleton from `ds-bundle/` at a
  given viewport. **Two dev-only siblings skip `ds-bundle` entirely**, bundling `design-system/dist` into
  `.design-sync/.cache/dev/` with `bundleToIife` so nothing wipes `_screenshots` mid-iteration:
  `render-page-dev.mjs` (same page, same args) and `render-anim.mjs <WxH> <out> <p1,p2,...> [Component]`, which
  stacks one scroll section at several frozen `progress` values in a single PNG. Use them for the edit/render loop
  and run the converter once at the end. Preview cards are 1280x1100, so hero crops must be judged here (16:9 and 390px), not on the card.
- Only the selected photo ships in the bundle; the other seven live in the repo for swapping.
- The user proposed two other photographs that were **rejected on rights grounds**: one with a `fotor` watermark, one
  credited "JPC VAN HEIJST". Do not use either without a licence.
- Claude cannot save images pasted into chat. Any new photograph must be placed in `static/` by the user, then added to the
  `images` list in `design-system/scripts/build.mjs` and to `src/assets.ts`.

## Preview cards
- **The preview card body is white.** Components that do not paint their own background (Button, Eyebrow, SectionHeading,
  Reveal, a static SiteHeader) must be wrapped in a `bg-space-950` block inside their preview, or white text disappears.
- Wide sections use `cardMode: column` with a 1280px viewport; `Hero` needs 1280x1100 so the pills are inside the frame;
  `NewsSection`-style tall grids need a taller viewport (captures are one viewport tall, never scrolled).
- `SiteHeader` is `cardMode: single` (primary `OverHero`): a fixed header escapes grid cells ([GRID_OVERFLOW] escape).
- Both scroll sections take `progress={0..1}`; previews use frozen frames because cards never scroll.
- Changing an explicit `viewport` trips [CONFIG_STALE] on `preview-rebuild.mjs` - run the full `package-build.mjs`.

## Verification done on this sync
- Render check 17/17 clean; all 40 story cells graded good.
- The composed homepage was rendered at 1440px and reviewed section by section.

## Known render warns
- `[FONT_REMOTE]` - expected, see Styling decisions.

## Re-sync risks
- **The design project keeps moving.** Board t8 was the confirmed structure at sync time and the style boards were still
  three options. Re-read the design project before a re-sync and reconcile.
- **Safelist coverage**: designs may reach for classes outside the safelist (arbitrary values, other hues) and render unstyled.
- **Remote fonts**: a CDN change would silently alter typography everywhere.
- **Toolchain pins**: exact versions in design-system devDependencies (React 19.3, Tailwind 4.3.3, sharp 0.35.4, TypeScript 5.9.3).
- **Copy is provisional**: English marketing copy in component defaults was written during this sync from the design project's
  own wireframes and decks. The user has not reviewed every line.
