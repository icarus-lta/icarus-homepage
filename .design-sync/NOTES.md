# design-sync notes: ICARUS design system

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
