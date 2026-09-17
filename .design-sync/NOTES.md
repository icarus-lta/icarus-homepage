# design-sync notes: ICARUS design system

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
- **English only.** The user asked for all Korean copy to be removed from component defaults (2026-09-17). Do not
  reintroduce Korean unless they ask.
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
  `dd005cee-2940-471e-9614-4a88f6f144fe`, file `Homepage Wireframes.dc.html`, block `8b` ("ANIM A 프레임").
  That block is the spec; read it before touching the scene. Its rules: the LEO constellation, the cloud deck and
  the ground station are drawn from the first frame and never move, the inter-satellite links pulse the whole way,
  and **only the downlink changes** - orbit-only (Tbps) → a thin direct drop through the cloud (Mbps) → ICARUS on
  the 20 km line relaying laser up / radio down (tens of Gbps, which the wireframe asks to be marked as a target,
  so the default rate string says so). The wireframe also fixes the link colours; translated to the dark theme they
  are ice `#8fd8ff` for laser, `#4aa8e0` for the radio relay and amber `#d9a441` for the weak direct drop. **The
  amber is deliberately not a theme token** - it exists only inside this component so nothing else can reach for a
  second accent hue. The drop is fully faded out before the relay lights (`directOut` ends at 0.68, `relay` starts
  there) so the two never share the same segment, and their rate labels sit on opposite sides of the axis.
- **`StatBar` is not on the homepage.** The wireframe runs the hero straight into ANIM A with nothing between, so
  the page skeleton in conventions.md, guide-ko.html and `render-page.mjs` all drop it. The component still ships.
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
  given viewport. Preview cards are 1280x1100, so hero crops must be judged here (16:9 and 390px), not on the card.
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
