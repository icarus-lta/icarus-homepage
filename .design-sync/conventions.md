# Building with the ICARUS design system

ICARUS LTA builds uncrewed airships that hold station at 20 km. The system is **dark-only** and **English-only**: near-black space backgrounds, one ice-blue accent, Pretendard type, mono labels for figures. There is no light theme - never invert it, and never add Korean copy unless the user asks.

## Setup
- No provider or wrapper. `styles.css` sets the page: `bg-space-950`, `text-mist`, Pretendard, smooth scrolling.
- Every section component paints its own background. If you build a bare block of your own, put it on `bg-space-950` (or `bg-space-900`) so white text stays readable.
- **One page gutter.** Bands run full-bleed and their content sits on a shared margin - `window.IcarusDS.containerClass` (`w-full mx-auto px-6 md:px-10 lg:px-16 2xl:px-24`). Put it on any band you build so your text lines up with the header, the hero headline and the photography. Never re-centre content in a narrow `max-w-6xl` column; that leaves the copy stranded in the middle of wide screens while the imagery runs edge to edge.
- **Never wrap a page in `overflow-x-hidden` (or any `overflow-hidden` ancestor).** It turns the wrapper into a scroll container, which silently stops `position: sticky` from pinning, and the scroll-driven sections then slide past instead of animating. Use `overflow-x-clip`.
- `SiteHeader` is `position="fixed"` and floats over the page, so the first section must deal with it. `Hero` and `PageHero` already do - `Hero` deliberately runs its photograph up under the header. Any other first section needs `pt-32`.
- `Hero` is one full-bleed image with the headline set **into** the image, in the empty sky beside the limb (left of it on wide screens, along the bottom on a phone). Its type is sized in `vw` so it stays clear of the horizon at every window size - don't re-style the headline or move it out from under the photograph.

```jsx
const { SiteHeader, Hero, AltitudeScrollSection, EnduranceScrollSection,
        MissionGrid, RoadmapTimeline, ContactCTA, SiteFooter } = window.IcarusDS;
<div className="overflow-x-clip">
  <SiteHeader />
  <Hero />                       {/* nothing between the photograph and the first scene */}
  <AltitudeScrollSection />      {/* scroll-driven: orbit only → direct drop → ICARUS relays */}
  <EnduranceScrollSection />     {/* scroll-driven: solar charge / night discharge / years */}
  <MissionGrid />
  <RoadmapTimeline />
  <ContactCTA />
  <SiteFooter />
</div>
```

**That list is the whole homepage.** It comes from the customer's own signed-off wireframe (six sections: hero, the two scroll scenes, missions, roadmap, closing), so don't add to it. Nothing sits between the hero photograph and the first scroll scene either - no figure row, no eyebrow, no caption. `StatBar` and `TechCards` still ship for subpages and campaign pages; neither belongs on the homepage.

Both scroll sections lead with their heading **above** the animation frame - the heading introduces the scene, it does not sit beside it. The frame is capped at `max-w-5xl` and left-aligned on the page gutter, so it sits under the heading at roughly the same width; stretched to the full gutter it read as a letterbox and the schematic inside it as a thread. `AltitudeScrollSection` carries no eyebrow: it is the first thing under the hero, so its title is the page's second display heading and stands alone. Inside its frame the altitude scale (`LEO 400–700 km`, `ICARUS 20 km`, `ATMOSPHERE ~10 km`) and `GROUND STATION` are set in the **sans** face, not mono - at that size mono read as a code listing. Mono stays on the throughput figures beside the links, which are instrument readouts.

Subpages (Info, Technology, Career, Contact) use the same shell with `PageHero` in place of `Hero`, then `Section` blocks, then `ContactCTA` and `SiteFooter`.

## Motion
- **Entrance**: wrap anything in `Reveal` - it fades and lifts the content when it scrolls into view. Stagger a row with `delay={0|100|200}`. `TechCards`, `MissionGrid` and `RoadmapTimeline` already do this internally.
- **Scroll-driven scenes**: `useScrollProgress()` returns `{ref, progress}` - attach `ref` to a tall section and drive anything from `progress` (0 to 1). `ramp(progress, from, to)` gives an eased 0..1 slice of it. That is how both scroll sections work: a tall `<section>` holding a `sticky top-0 h-screen` scene. Keep the sticky box exactly `h-screen` (a sticky element taller than the viewport never pins) and keep every ancestor free of `overflow-hidden`.
- Both scroll sections accept `progress={0..1}`, which freezes one frame instead of following the scroll - use it for a static mock-up, never on a live page.
- Keep motion restrained: opacity and small translations, `duration-500`/`700`, `ease-out`. The only looping animation is the airship's slow `animate-float`.

## Styling: Tailwind CSS v4 with the brand palette
Style your own glue markup with these classes - not inline styles, not new CSS. The stylesheet is precompiled, so only these scales exist (`sm:`/`md:`/`lg:` prefixes work on layout, spacing, `w-full`, fractional widths, `max-w-*`, text size and alignment). Anything else - arbitrary values like `w-[37rem]`, other hues, odd steps like `p-7` - renders unstyled.

| Purpose | Classes |
|---|---|
| Space base | `bg-space-{950,900,800,700,600}` (950 is the page), `bg-gradient-to-b from-space-950 via-space-900 to-space-950` |
| Accent | `text-ice`, `bg-ice`, `border-ice`, `text-ice-{100,300,600}`, `bg-ice/{10,20,30}`, `border-ice/{20,30,40}` |
| Text | `text-white`, `text-mist` (body), `text-mist-dim` (captions), `text-white/{60,70,80,90}` |
| Surfaces | `bg-white/{5,10,20}`, `border-white/{10,15,20}`, `rounded-{xl,2xl,3xl,full}`, `shadow-{md,lg,xl,2xl}`, `backdrop-blur-{sm,md,lg}` |
| Layout | `flex`, `grid`, `grid-cols-{1,2,3,4,5,6,12}`, `gap-{0,1,2,3,4,5,6,8,10,12,16,20,24}`, `items-center`, `justify-between`, `hidden md:flex` |
| Spacing | `p`/`px`/`py`/`pt`/`pb`/`pl`/`pr` `-{0,1,2,3,4,5,6,8,10,12,16,20,24,28,32,40,48}`, `m`/`mx`/`my`/`mt`/`mb` to `-32`, `mx-auto`, `space-y-{1,2,3,4,6,8,10,12}` |
| Size | `max-w-{xs..7xl}`, `w-full`, `h-full`, `min-h-screen`, `aspect-{square,video}`, `w`/`h`/`size` `-{4,5,6,8,10,12,16,20,24,32,40,48,56,64,72,80,96}` |
| Type | `text-{xs..9xl}`, `font-{light,normal,medium,semibold,bold,extrabold}`, `font-mono` (labels and figures), `leading-{tight,snug,relaxed}`, `tracking-{tight,wide,wider,widest}`, `tabular-nums` |
| Motion | `transition-{all,colors,opacity,transform}`, `duration-{150,300,500,700,1000}`, `delay-{100,150,200,300,500,700}`, `ease-out`, `opacity-{0,20,40,60,80,100}`, `translate-y-{0,4,8,12}`, `hover:-translate-y-{0.5,1}`, `scale-{95,100,105}`, `animate-{float,drift,twinkle,pulse}` |

Two system classes carry the space look: `ds-stars` (a star field - lay it over a dark box with `absolute inset-0 opacity-50`) and `ds-aurora` (a soft glow). `Section` takes `stars` and `tone="base|raised|deep|navy"` so you rarely need them by hand.

House style: display headings `text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight`; body `text-base text-mist leading-relaxed`; captions `text-sm text-mist-dim`; labels `font-mono text-xs uppercase tracking-[0.18em] text-ice` (that is what `Eyebrow` renders); cards `rounded-2xl border border-white/10 bg-white/5 p-8`.

## Imagery
`window.IcarusDS.images` holds the only images that ship: `heroStratosphere` (the horizon photograph the homepage opens with), `airship3d` (the ICARUS render), `logo`, `logoCircle`, and company photos `about`, `product`, `newsMaterial`, `newsAward`, `newsYtn`, `newsKepco`. Never invent image URLs. The horizon photograph is NASA imagery in the public domain; `window.IcarusDS.heroCredit` is its credit line and `SiteFooter` shows it by default, so keep it.

## Where the truth lives
Check `styles.css` and the `_ds_bundle.css` it imports before using an unfamiliar class. Props and examples are in `components/<group>/<Name>/<Name>.prompt.md` and `<Name>.d.ts`.
