# Portfolio Slide Templates

Reusable layout templates for the portfolio. These apply to both the main
page (`SLIDES[]` in `components/slides/index.tsx`) and case-study sections
(`CaseStudySection` union in `content.ts`, rendered by
`case-studies/[id]/CaseStudyView.tsx`).

**How to use this doc.** When drafting a new slide or case-study section,
pick the closest template below. Each entry names the content slots it
needs, the primitives already in the codebase to compose from, and known
variants. If nothing fits, check the **Gaps** section at the bottom — some
gaps are waiting to be promoted into templates.

**Primitive paths.** Class names like `.wipu-longform-title` live in
`board.css`. Container `.wipu-slide` lives in `deck.css`. Components live
under `components/` and `case-studies/[id]/`.

---

## Structural templates

### Intro / Closing

**Use for:** main-page hero, case-study entry, case-study wrap.
Same layout, different content.
**Fields:** kicker/label, big title, subtitle or positioning line,
optional glyphs, optional photo or visual, optional meta grid (for case
studies).
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  KICKER · 00                                  │
│                                               │
│   Big title that names the thing              │
│   Subtitle or positioning line, smaller.      │
│                                               │
│   [ meta col ] [ meta col ] [ meta ] [ meta ] │
└───────────────────────────────────────────────┘
```
**Existing primitives:**
- Main-page hero → `HeroSlide` (`components/slides/index.tsx`),
  `.wipu-hero*` classes
- Case-study hero → `CaseHero` (`case-studies/[id]/CaseStudyView.tsx`),
  `.wipu-case-hero*` + `.wipu-case-meta` 4-col grid (`board.css`)

**Variants:**
- *Case Hero* — adds Role / Team / Shipped / Platforms meta bar below
  subtitle, and optional glyph row above title.
- *Closing* — same shape, reused at case-study end (currently rendered
  as a footer with back link; see `.wipu-case-footer`).

**Examples in use:** main page slide 00 (`HeroSlide`); Teaching Gemini
to See hero.

---

## Content layout templates

### Text Only (Quote)

**Use for:** a single pull quote or highlight line that deserves a full
beat. Large type, minimal framing.
**Fields:** quote text, optional attribution, optional tone.
**Layout sketch:**
```
┌───────────────────────────────────┐
│                                   │
│     "A single sentence that       │
│      earns its own slide."        │
│      — attribution                │
│                                   │
└───────────────────────────────────┘
```
**Existing primitives:** `.wipu-quote` / `.wipu-quote.is-lg`
(`board.css`), or `.wipu-case-pullquote` for inline use within a section
(top-border accent style).
**Variants:** *Reflections* (numbered list of short paragraphs) is a
sibling "informational list" variant — see `.wipu-case-reflections` and
`ReflectionsSection`. Use it for closing takeaways or lessons-learned
lists.
**Examples in use:** pull quotes inside Act sections in Teaching Gemini
to See; Reflections section at case-study tail.

---

### Text Only (Informational)

**Use for:** context-setting or narrative beats. Body copy block, no
images. Can be one column or title-left / body-right.
**Fields:** label/eyebrow, title, optional kicker/subtitle, 1–3 body
paragraphs.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · 02                                   │
│                                               │
│  Title on the left         Body paragraph on  │
│  spans two or three        the right in a     │
│  lines.                    readable column.   │
│  Kicker underneath.                           │
│                            Second paragraph.  │
└───────────────────────────────────────────────┘
```
**Existing primitives:** `.wipu-longform-title` +
`.wipu-longform-kicker` + `.wipu-longform-body`; wrap in
`.wipu-layout-twocol` for title-left / body-right split. `ProseSection`
in `CaseStudyView.tsx` is the reference composition.
**Variants:** single-column (no `.wipu-layout-twocol`) for shorter
beats.
**Examples in use:** the "Frame" prose section in Teaching Gemini to
See.

---

### Three-Up

**Use for:** three parallel concepts, options, features, or press
quotes. Horizontally laid out, equal weight.
**Fields:** 3× { eyebrow, title/quote, optional image, optional
attribution }.
**Layout sketch:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  [ 01 ]      [ 02 ]      [ 03 ]             │
│  eyebrow     eyebrow     eyebrow            │
│  title       title       title              │
│  body        body        body               │
│                                             │
└─────────────────────────────────────────────┘
```
**Existing primitives:**
- Main-page text-only three-up → `.wipu-ainative-blocks` pattern
- Media three-up → `.wipu-fs-triad-row` (`board.css`)
- *Press Quotes grid* → `.wipu-case-pressgrid` with tonal cards
  (`.wipu-case-press`, `.wipu-case-press-quote`,
  `.wipu-case-press-attribution`)

**Variants:**
- *Press Quotes* — 3 tonal cards with attributed quotes (used inside
  Impact sections).
- *Triad phones* — 3 phone mockups side-by-side (`.wipu-fs-triad-phone`).

**Examples in use:** "AI-Native" main page slide; Impact section press
quotes in Teaching Gemini to See.

---

### Media Left / Text Right

**Use for:** a cluster of 2–3 rounded-corner image tiles on the left;
text column on the right. The images always come as a cluster — not a
single image — so you get the visual language of a grid that's been
nudged off-axis for a hand-placed rather than column-locked feel.
**Fields:** eyebrow, title, subtitle, body, 2–3 tiles (polaroid,
color-tinted, or real image).
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · 04                                   │
│                                               │
│  ┌───────┐  ┌────┐    Title on the right      │
│  │       │  │IMG │    Subtitle, italic.       │
│  │  IMG  │  └────┘                            │
│  │       │          Body paragraph.           │
│  └───────┘  ┌────┐                            │
│             │IMG │  Body paragraph.           │
│             └────┘                            │
└───────────────────────────────────────────────┘
   └── tiles have subtle rotation (≈ ±1°) and
       nudged translate so the grid feels alive
```
**Existing primitives:** `TextImageSlide` with `side="right"` (text
right)
(`components/slides/text-image/TextImageSlide.tsx`). Image clusters via
`.wipu-ti-cluster` + one of `-a` / `-b` / `-c` variants. Tile component:
`TileColor` (tinted placeholder) or `TileImage` (real image). Each tile
renders as a `.wipu-placeholder` with 22px border-radius; cluster-C
also translates the right column down 18px so the grid doesn't align
perfectly.
**Variants:**
- Cluster A — three tiles: medium top-right, wide middle, small bottom.
- Cluster B — two tiles: small tile top-left, large square below.
- Cluster C — three tiles: tall tile left, two stacked tiles right
  (right column nudged down 18px for asymmetry).
- Always ≥ 2 tiles. Single image is not the house style.
**Examples in use:** "Seeing People" slide on main page (cluster C with
real photos).

---

### Media Right / Text Left

**Use for:** flipped version. Same cluster language, just on the other
side.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · 05                                   │
│                                               │
│  Title on the left     ┌────┐   ┌───────┐     │
│  Subtitle, italic.     │IMG │   │       │     │
│                        └────┘   │  IMG  │     │
│  Body paragraph.                │       │     │
│                        ┌────┐   └───────┘     │
│  Body paragraph.       │IMG │                 │
│                        └────┘                 │
└───────────────────────────────────────────────┘
```
**Existing primitives:** `TextImageSlide` with `side="left"` (text
left). Same cluster variants and tiles as Media Left / Text Right.
**Variants:** same three cluster patterns.
**Examples in use:** "DC Years" slide on main page (cluster B with real
photos).

---

### Timeline

**Use for:** a scroll-pinned sequence of wide-format images shown one
at a time. The slide is a tall scroll container (N × 100svh); as the
viewer scrolls, the stage stays pinned while the track pans
horizontally from stop to stop. Each ≈100svh of scroll = one stop.
Past the last stop, scroll releases to the next slide.
**Fields:** sequence of stops, each with a wide image, a short title,
and a date/marker label. A labeled track at the bottom shows where you
are; progress fills from start to the active dot.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · 06                                   │
│                                               │
│      ┌─────────────────────┐                  │
│      │                     │                  │
│      │    WIDE  IMAGE      │                  │
│      │                     │                  │
│      └─────────────────────┘                  │
│                                               │
│             Title · small                     │
│              FEB 2024                         │
│                                               │
│   ●━━━━━●──────○──────○──────○                │
│   FEB   MAY    AUG    FEB    OCT              │
│   2024  2024   2024   2025   2025             │
└───────────────────────────────────────────────┘
      ↓ scroll advances to next stop
      ↓ past last stop = continue to next slide
```
**Existing primitives:**
- Sample version: `TimelineSample` in
  `templates/sample/TimelineSample.tsx`. Scroll-pinned — outer section
  is `STOPS.length × 100svh` tall, a sticky pin holds the stage, rAF
  scroll handler translates progress into a horizontal `translate3d`
  of the track and updates the progress fill + active dot.
- Production case-study version: `GeminiTimeline.tsx` +
  `.wipu-timeline`, `.wipu-timeline-stop`, `.wipu-timeline-track`,
  `.wipu-timeline-progress-fill` (`board.css`). Identical mechanism,
  tuned for real phone-mock images. Source of truth for this pattern.
- Snap markers: `.wipu-sample-tl-snap` at each 100svh mark inside the
  tall wrapper. If the document has `scroll-snap-type: y mandatory`
  (as the sample page does), scroll hard-snaps to each stop.
**Variants:**
- *Scroll-pinned* (default, sample + Gemini) — see above.
- *Reduced-motion fallback* — at narrow viewports or with
  `prefers-reduced-motion`, the CSS collapses the track to a vertical
  stack; no scroll-hijacking.
- *Act / Chapter* — a single "stop" treated as its own full section
  with `CityStamp`, pull quote, setup, body. See `ActSection` in
  `CaseStudyView.tsx`. A timeline can be thought of as a sequence of
  Acts, or Acts can stand alone without the timeline bar.

**Examples in use:** `GeminiTimeline` + three Act sections (NYC, Zürich,
Mexico City) in Teaching Gemini to See.

---

### Design Explorations

**Use for:** visual iterations, design options, mood-board style
collections. All-image grid, no text.
**Fields:** N images (typically 4–9), optional captions per image,
optional overall title.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  [ img ]  [ img ]  [ img ]                    │
│  [ img ]  [ img ]  [ img ]                    │
│  [ img ]  [ img ]  [ img ]                    │
└───────────────────────────────────────────────┘
```
**Existing primitives:** no dedicated grid class yet — see **Gaps**.
Closest today: `.wipu-logowall` (3-col grid, 2-col on narrow) or a
compose-from-scratch CSS grid inside a `.wipu-slide`. Tile primitives
available: `.wipu-fs-image` (tintable image card),
`.wipu-fs-polaroid`, plain `.wipu-image-frame`.
**Variants:** uniform grid vs. staggered / collage. A collage variant
could reuse the `.wipu-fs` canvas pattern from the Archive Gallery
without the drag affordance.
**Examples in use:** not yet.

---

### Hero Metric

**Use for:** one standout stat that deserves a full beat.
**Fields:** big number, label (1–2 lines), optional supporting context
paragraph.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│                                               │
│                                               │
│               42M                              │
│         users reached in Q1                   │
│                                               │
│      Optional supporting sentence.            │
│                                               │
└───────────────────────────────────────────────┘
```
**Existing primitives:** `.wipu-pullnum` + `.wipu-pullnum-n`
(`board.css`). Design-system "Hero stat" variant uses SVG text with a
stroke-draw animation — see `design-system/page.tsx` for the reference
implementation.
**Variants:** static number vs. stroke-draw-animated SVG.
**Examples in use:** design-system catalog only.

---

### Metrics Collection

**Use for:** a cluster of impact numbers shown together. Typically three
across.
**Fields:** N× { big number, label, tone }. Optional section title above.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · 08                                   │
│                                               │
│  Title of the impact beat                     │
│                                               │
│   42M            3.2×           98%           │
│   users          speedup        retention     │
│                                               │
└───────────────────────────────────────────────┘
```
**Existing primitives:** `.wipu-case-statrow` (auto-fit grid,
`minmax(260px, 1fr)`) + `StatBlock` (in `CaseStudyView.tsx`) which wraps
`.wipu-pullnum`. Tone via `data-accent` / `TONE_VAR`.
**Variants:**
- *Impact section* — composes Metrics Collection + Press Quotes
  Three-Up + optional notes + optional honest caveat into one full-slide
  beat. See `ImpactSection` in `CaseStudyView.tsx`. Treat this
  composition as the canonical "impact" pattern rather than a separate
  template.
- *Scattered stats* — `.wipu-stats-scatter` with varied `data-indent`
  offsets for a looser layout (used on main page in design-system
  catalog).

**Examples in use:** Impact section in Teaching Gemini to See.

---

## Special templates

### Prototype

**Use for:** a thin slide-wrapper around one of the interactive
prototypes that live at `/prototypes/<slug>`. The prototype page is the
source of truth — it already ships a controls panel, phone frame, and
playback logic (see `app/prototypes/[slug]/PrototypeView.tsx`). The
slide just provides a centered, rounded container and loads it via an
iframe. Comes at the end of every case study.
**Fields:** one `<iframe src="/prototypes/<slug>">`. That's it.
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  LABEL · PROTOTYPE                            │
│                                               │
│  ┌────────────────────────────────────────┐   │
│  │                                        │   │
│  │  [ controls panel ]  │   [ phone ]     │   │
│  │                      │                 │   │
│  │                      │                 │   │
│  └────────────────────────────────────────┘   │
│           ↑ iframe to /prototypes/<slug>      │
└───────────────────────────────────────────────┘
```
**Existing primitives:**
- Prototype source of truth: `app/prototypes/[slug]/PrototypeView.tsx`
  — renders `VoiceChatView` or `VideoGenerationView` depending on
  `kind`. Data + turn scripts in `lib/prototypes.ts`.
- Slide wrapper (sample): `.wipu-sample-proto-frame` +
  `.wipu-sample-proto-iframe` — rounded container + shadow, iframe fills
  it.
- Case-study-in-flow inline version: `LiveVideoEmbed.tsx` +
  `.wipu-live-embed.proto-root` / `.proto-phone` (`board.css`). For
  when the prototype appears mid-case-study (e.g. the Zürich act) and
  needs the phone but not the controls.
**Available prototypes today:**
- `voice-chat` — voice-first Gemini with caption bar and a looping
  background video. Two scenarios (dying plant, first interview).
- `video-generation` — mobile flow for generating a short video from a
  text prompt.
**Variants:**
- Full page via iframe (sample, case-study-end) — shows controls + phone.
- Inline embed (`LiveVideoEmbed`, mid-case-study) — phone only, no
  controls panel.
**Examples in use:** end of Zürich act in Teaching Gemini to See
(inline embed); slide 11 of the sample presentation (full iframe).

---

### Archive Gallery

**Use for:** supplemental artifacts that don't need to be in the main
scroll flow. Main page only. An icon (folder) is the entrypoint; click
to expand into a draggable canvas.
**Fields:** folder label + icon, N tiles of mixed media (polaroids,
image tiles, sticky notes, quotes, stats, phone mocks, etc.).
**Layout sketch:**
```
┌───────────────────────────────────────────────┐
│  Main flow continues above                    │
│                                               │
│            ┌──┐                               │
│            │📁│  ← click                      │
│            └──┘                               │
│            label                              │
│                                               │
│  → expands to full-bleed draggable canvas     │
│    of scattered artifacts                     │
└───────────────────────────────────────────────┘
```
**Existing primitives:** `.wipu-folder` entrypoint
(`.wipu-folder-icon`, `.wipu-folder-tab`, `.wipu-folder-back`),
`.wipu-fs` canvas + `.wipu-fs-card` items, `.wipu-fs-bi` generic card
frame. Tile kinds available: polaroid, image-tile, video-polaroid,
sticky-note, quote, stat, callout-pill, phone-mock, annotated-phone,
triad, overlap-stack, agenda, emoji-tile, wordmark-card, shapes.
Powered by `CreatorSlide` (see `components/slides/creator/`).
**Variants:** single folder vs. multiple entrypoints on one slide.
**Examples in use:** "Creator" slide on main page.

---

## Gaps & open questions

Things the codebase already has (or lacks) that this list doesn't fully
cover. Decide case-by-case whether to promote to templates, treat as
variants, or leave bespoke.

1. **Case Hero meta bar** — the 4-col Role / Team / Shipped / Platforms
   strip is unique to case-study intros. Currently folded into *Intro /
   Closing* as a variant. Promote to its own template?
2. **Act / Chapter** — `ActSection` with `CityStamp`, pull quote, setup
   paragraph, and body is distinctive. Currently folded into *Timeline*
   as a "stop" variant. Could stand alone as its own template if acts
   appear outside timelines.
3. **Reflections (numbered list)** — `.wipu-case-reflections` is a
   specific numbered-list layout. Folded into *Text Only
   (Informational)* as a sibling. Could promote.
4. **Press Quotes grid** — `.wipu-case-pressgrid` with tonal cards is a
   specific 3-up. Folded into *Three-Up*. Could promote.
5. **Impact section composition** — today's `ImpactSection` composes
   Metrics Collection + Press Quotes Three-Up + notes into one slide.
   Worth naming this common composition explicitly in future revisions.
6. **Image + caption band** — `.wipu-image-band` /
   `.wipu-image-frame` / `.wipu-image-cap` exist but aren't in the list.
   Could be a *Media Full-Bleed* template, or stay as a primitive used
   inside Media-Left/Right.
7. **Career / qualifications path** — `.wipu-quals-path` (arrow
   sequence) is main-page-specific. Probably bespoke; flagged here for
   awareness.
8. **No dedicated Design Explorations primitive** — the category is
   listed but there's no grid class tuned for iteration screenshots.
   Either compose from `.wipu-logowall` / tile primitives each time, or
   build a reusable `.wipu-explorations-grid`.

---

## Primitive quick reference

Container and layout:
- `.wipu-slide` — full-viewport section shell (`deck.css`)
- `.wipu-slide-inner` — centered content column inside a slide
- `.wipu-layout-twocol` — 2-column grid (1.05fr 1fr)
- `.wipu-case-act-inner` — 2-column variant for acts (1.1fr 1fr)
- `.wipu-fs-triad-row` — 3-column grid

Typography:
- `.wipu-slide-label` — uppercase kicker/eyebrow
- `.wipu-longform-title` / `.wipu-longform-kicker` /
  `.wipu-longform-body` — prose trio
- `.wipu-case-hero-title` / `.wipu-case-hero-subtitle` — case hero
- `.wipu-quote` / `.wipu-case-pullquote` — quote blocks
- `.wipu-callout` — sticky-note-styled callout

Metrics:
- `.wipu-pullnum` / `.wipu-pullnum-n` / `.wipu-pullnum-lbl` — big number
- `.wipu-stat` / `.wipu-stat-n` / `.wipu-stat-lbl` — stat block
- `.wipu-case-statrow` — auto-fit stats grid
- `.wipu-stats-scatter` — staggered stats layout

Media:
- `.wipu-image-band` — full-bleed image lead-in
- `.wipu-image-frame` / `.wipu-image-cap` / `.wipu-image-kicker` —
  framed image with caption
- `.wipu-case-image-well` — placeholder frame (is-wide / is-phone /
  is-square)
- `.wipu-fs-polaroid` — polaroid card
- `.wipu-fs-image` — tintable image card
- `.wipu-ti-cluster` / `-a` / `-b` / `-c` — image cluster patterns

Special:
- `.wipu-timeline*` — horizontal timeline with progress
- `.wipu-live-embed.proto-root` / `.proto-phone` — prototype frame
- `.wipu-folder` + `.wipu-fs` / `.wipu-fs-card` / `.wipu-fs-bi` —
  archive gallery system
- `.wipu-case-stamp` — circular city stamp (SVG-drawn)
- `.wipu-case-pressgrid` + `.wipu-case-press` — press quote cards
- `.wipu-case-reflections` + `.wipu-case-reflection` — numbered list

Components:
- `TextImageSlide` — Media Left / Right template
- `CaseHero` — case-study intro
- `ProseSection` / `ActSection` / `ImpactSection` /
  `ReflectionsSection` — case-study renderers
- `GeminiTimeline` / `ZurichScroller` / `LiveVideoEmbed` — currently
  bespoke to Teaching Gemini to See
- `CityStamp` — reusable stamp graphic
- `CreatorSlide` — archive gallery
