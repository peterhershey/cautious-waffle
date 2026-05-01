# Slide catalog

Per-slide reference for the templates registered in `meta.ts` and rendered by `slides.tsx`. Source of truth: `meta.ts` (`TEMPLATES[]`). When adding a slide, register it in three places: `meta.ts` (`TEMPLATES`), `slides.tsx` (`BY_SLUG`), and — if it manages its own viewport — `SELF_CONTAINED`.

Browse: `/whatispeterupto/templates` (catalog). Single preview: `/whatispeterupto/templates/preview/<slug>`. All slides at once: `/whatispeterupto/templates/sample`.

---

## Index

| Slug | Name | Group | Self-contained |
|------|------|-------|----------------|
| 01 | Intro / Closing | Structural | — |
| 02 | Text Only — Quote | Content | — |
| 03 | Text Only — Informational | Content | — |
| 04 | Three-Up | Content | — |
| 05 | Media Left / Text Right | Content | — |
| 05b | Media Left — Animating | Content | — |
| 06 | Media Right / Text Left | Content | — |
| 07 | Timeline | Content | yes |
| 08 | Design Explorations | Content | — |
| 09 | Hero Metric | Content | — |
| 10 | Metrics Collection | Content | — |
| 13 | Video Embed | Content | — |
| 11 | Prototype | Special | yes |
| 12 | Archive Gallery | Special | — |

"Self-contained" slides bypass the centered `.wipu-sample-inner` / `.wipu-preview-slide` wrappers and manage their own full-viewport layout.

---

## 01 — Intro / Closing

- **Group:** Structural
- **Component:** `IntroSlide` → `IntroTemplate` (`templates/components/IntroTemplate.tsx`)
- **Use:** Hero opener, case-study entry, case-study closing — same layout, three roles.
- **Slots:** `emoji` (optional glyph), `greeting` (e.g., "Hi, I'm"), `name`, `note` (subtitle).
- **Variants:** Case-study hero adds a Role / Team / Shipped / Platforms meta bar (handled in case-study view, not the template directly).
- **Notes:** Centered, generous vertical rhythm. Pairs with `.wipu-tpl-intro` styles in `templates.css`.

## 02 — Text Only — Quote

- **Group:** Content
- **Component:** `QuoteSlide` (`slides.tsx`)
- **Use:** One pull quote on its own beat. Large italic type, minimal framing.
- **Slots:** Quote text, attribution.
- **CSS:** `.wipu-sample-quote`, `.wipu-sample-quote-attr` (`sample.css`).
- **Notes:** ~20ch max width keeps lines short. Use sparingly — earns the slide by being a single line.

## 03 — Text Only — Informational

- **Group:** Content
- **Component:** `InfoSlide` (`slides.tsx`)
- **Use:** Context-setting or narrative body beats. Two-column: title + kicker on the left, body on the right.
- **Slots:** Title, kicker (italic), 1–2 body paragraphs.
- **CSS:** `.wipu-sample-info-grid`, `.wipu-sample-info-title`, `.wipu-sample-info-kicker`, `.wipu-sample-info-body`.
- **Responsive:** Collapses to single column under 900px.

## 04 — Three-Up

- **Group:** Content
- **Component:** `ThreeUpSlide` → `ThreeUpTemplate` (`templates/components/ThreeUpTemplate.tsx`)
- **Use:** Three parallel concepts, options, or press quotes side-by-side.
- **Slots:** Array of 3 blocks, each with `eyebrow`, `title`, `body`.
- **CSS:** `.wipu-tpl-threeup` (`templates.css`).

## 05 — Media Left / Text Right

- **Group:** Content
- **Component:** `MediaLeftSlide` → `TextImageSlide` (`components/slides/text-image/TextImageSlide.tsx`)
- **Use:** Cluster of 2–3 rounded-corner tiles on the left, text column on the right. Grid-based but nudged off-axis for a hand-placed feel.
- **Slots:** `eyebrow`, `title`, `subtitle`, `children` (the cluster — `<TileColor>` / `<TileImage>`).
- **CSS:** `.wipu-ti`, `.wipu-ti-cluster`, cluster variants `.wipu-ti-cluster-{a,b,c}` (`text-image.css`).
- **Sides:** Pass `side="right"` to put the text on the right (i.e., this is "media left").

## 05b — Media Left — Animating

- **Group:** Content
- **Component:** `MediaLeftAnimatingSlide` (`slides.tsx`)
- **Use:** Replace 05's static cluster with a two-box morph slideshow. Always one big photo and one smaller color block; on each beat the boxes swap roles and the layout morphs.
- **Slots:** Eyebrow / title / subtitle (delegated to `TextImageSlide`). Photos pulled at random from the archive (`components/slides/creator/tiles.ts` — still images only).
- **Pacing:** `MORPH_PHASE_MS` (default 4200ms total) split into a long rest beat (`MORPH_REST_FRAC`, default 0.72) and a short morph beat. The box sits on each photo for ~3s, then morphs over ~1.2s into the next.
- **Easing:** `cubic-bezier(0.22, 0.8, 0.2, 1)` — matches the archive's signature curve.
- **Implementation:** rAF-driven. Position lerps between the current and next layout's rect, opacity is a smoothstepped overlap across 10 stacked per-phase content layers (5 photos + 5 tones, alternating). Both consume the same eased `morphT` so position and content stay in lockstep — no background snap. Honors `prefers-reduced-motion` (static at phase 0).
- **CSS:** `.wipu-morph`, `.wipu-morph-box`, `.wipu-morph-fill` (`sample.css`).
- **Tuning knobs:** `MORPH_LAYOUTS` (the 5 rect pairs), `MORPH_TONES`, `MORPH_PHASE_MS`, `MORPH_REST_FRAC`, `MORPH_PHOTO_COUNT`.

## 06 — Media Right / Text Left

- **Group:** Content
- **Component:** `MediaRightSlide` → `TextImageSlide` (`side="left"`).
- **Use:** Flipped version of 05. Same cluster language — 2–3 tiles, slightly off-grid.
- **Slots / CSS:** Same as 05; uses cluster variant `.wipu-ti-cluster-c`.

## 07 — Timeline

- **Group:** Content
- **Self-contained:** yes — manages its own scroll-pinned section.
- **Component:** `TimelineSlide` → `TimelineSample` (`templates/sample/TimelineSample.tsx`)
- **Use:** Horizontal pan through a sequence of stops. Vertical scroll translates to horizontal progression; past the last stop, scroll releases to the next slide.
- **Slots:** Array of `Stop` objects (`tint`, `title`, `date`).
- **Mechanics:** Outer section is `STOPS.length × 100svh` tall; sticky pin holds a single viewport while a track translates horizontally. Progress rail with ticks at the bottom. rAF-throttled.
- **CSS:** `.wipu-sample-tl-*` (`sample.css`).
- **Responsive / reduced-motion fallback:** Vertical stack of stops (no pin, no horizontal pan) on narrow viewports or when reduced-motion is set.

## 08 — Design Explorations

- **Group:** Content
- **Component:** `DesignExplorationsSlide` (`slides.tsx`)
- **Use:** All-image grid, no text. Visual iterations or options.
- **Layout:** 6-column dense grid with mixed tile sizes — `1x1` (2 cols × 1 row), `2x1` (4 × 1), `1x2` (2 × 2), `2x2` (4 × 2). `grid-auto-flow: dense` keeps the composition wonky and tightly packed, matching the archive (12) and media (05/06) language.
- **CSS:** `.wipu-sample-explore`, `.wipu-sample-explore-{1x1,2x1,1x2,2x2}` (`sample.css`).
- **Notes:** Tile count flexible — any number with mixed sizes works. Default sample uses 8.

## 09 — Hero Metric

- **Group:** Content
- **Component:** `HeroMetricSlide` (`slides.tsx`)
- **Use:** One standout stat. Big number, label, optional supporting line.
- **Slots:** Number, label (uppercase), optional note.
- **CSS:** `.wipu-sample-heroMetric*` (`sample.css`). Number color defaults to terracotta — swap via tone token.

## 10 — Metrics Collection

- **Group:** Content
- **Component:** `MetricsCollectionSlide` (`slides.tsx`)
- **Use:** Three metrics side-by-side. Impact cluster — often composed with press quotes into an Impact section.
- **Slots:** Title spanning all columns, then array of 3 `{ n, lbl, tone }` metrics.
- **CSS:** `.wipu-sample-metrics`, `.wipu-sample-metric-{n,lbl}` (`sample.css`).
- **Responsive:** Collapses to single column under 900px.

## 13 — Video Embed

- **Group:** Content
- **Component:** `VideoEmbedSlide` (`slides.tsx`)
- **Use:** Centered 16:9 YouTube embed with a hue-sync ambient glow behind the frame and a single title line below. For supporting video content inside a narrative beat (talks, demos, walkthroughs).
- **Slots:** YouTube video ID, iframe title, title line.
- **CSS:** `.wipu-sample-video`, `.wipu-sample-video-stage`, `.wipu-sample-video-glow`, `.wipu-sample-video-frame`, `.wipu-sample-video-iframe`, `.wipu-sample-video-title` (`sample.css`).
- **Embed URL:** `https://www.youtube-nocookie.com/embed/<id>?rel=0` — privacy-enhanced (no cookies until play), `rel=0` keeps related-video suggestions on-channel.
- **Frame:** `min(100%, 1040px)` × `aspect-ratio: 16 / 9`, `22px` border-radius matching the tile language; ink background so the frame holds shape before the iframe paints.
- **Glow:** YouTube `hqdefault.jpg` thumbnail scaled ~106–112%, blurred ~60–76px, saturated 1.4–1.9× behind the frame. Stage uses `isolation: isolate` so the glow's `z-index: -1` stays behind the frame without bleeding under the slide.
- **Motion:** rAF-driven, two layers.
  - *Ambient drift* (always on): slow sine-pair on transform translate + scale + opacity + blur. Slow rates (~0.3–0.4 Hz) so it reads as breathing, not motion.
  - *Audio-shaped pulse* (gated by play state): layered sines at unrelated rates (bass ≈ 2.3, beat ≈ 4.7 clipped, high ≈ 7.9 — units are radians/sec) bump scale, opacity, saturation, and reduce blur. Smoothed envelope ramps on/off so play↔pause transitions don't snap.
- **Audio coupling caveat:** YouTube embeds run cross-origin, so live amplitude is gated. Play/pause comes from the YouTube IFrame Player API (`enablejsapi=1`); the pulse shape is synthesized to feel music-like rather than truly tracking the waveform. For real amplitude, switch to a self-hosted `<video>` + Web Audio `AnalyserNode`.
- **Reduced motion:** `prefers-reduced-motion: reduce` skips the rAF loop; static CSS values stand.
- **Notes:** Lazy-loaded. Allows fullscreen + standard YouTube permissions. Not self-contained — fits the standard `.wipu-sample-inner` column. For full-bleed cinematic use, promote to a self-contained variant (mirror the Prototype slide pattern).

## 11 — Prototype

- **Group:** Special
- **Self-contained:** yes — full-bleed, no inset / border / shadow. The prototype IS the slide.
- **Component:** `PrototypeSlide` (`slides.tsx`)
- **Use:** Embed one of the real interactive prototypes from `/prototypes/<slug>` at the end of every case study.
- **Slots:** `src` (prototype URL), `title` (iframe title for a11y).
- **CSS:** `.wipu-sample-proto`, `.wipu-sample-proto-iframe` (`sample.css`). 100% width × 100svh.
- **Notes:** Sample currently hard-codes `/prototypes/voice-chat`. Parameterize when promoting from sample to per-case-study usage.

## 12 — Archive Gallery

- **Group:** Special
- **Component:** `ArchiveGallerySlide` (sample placeholder) / `CreatorSlide` (real implementation at `components/slides/creator/index.tsx`)
- **Use:** Folder-icon entry point that expands to a draggable canvas of mixed-size tiles. Main page only.
- **Behavior:** Click folder → overlay opens (immersive), tiles "explode" with staggered reveal, magnetic drift on cursor / gyro fallback on touch. Esc or × closes. FPS-gated drift (disables below 28fps).
- **Slots:** Array of `Tile` objects (image or card) — see `components/slides/creator/tiles.ts`.
- **CSS:** `creator.css` — 7-col dense grid with tile sizes `1x1` / `2x1` / `1x2` / `2x2` / `3x2`.
- **Notes:** Sample template is a static button mock; real interaction lives in `CreatorSlide`. Honors `prefers-reduced-motion`.

---

## Adding a new slide

1. Add an entry to `TEMPLATES[]` in `meta.ts` (slug, name, group, one-line `use`).
2. Implement the component in `slides.tsx` (or a dedicated file if it grows). Render template content only — outer layout is provided by `SlideWrapper` / `PreviewShell` unless self-contained.
3. Register in `BY_SLUG` in `slides.tsx`.
4. If the slide manages its own viewport (full-bleed, scroll-pinned, etc.), add the slug to `SELF_CONTAINED`.
5. Add styles to `templates/sample/sample.css` (or a co-located CSS file for components with their own folder).
6. Verify at `/whatispeterupto/templates/preview/<slug>` and `/whatispeterupto/templates/sample`.
7. Update this file.

## Related

- `meta.ts` — slug / name / group / use registry. Single source of truth.
- `slides.tsx` — components and `BY_SLUG` / `SELF_CONTAINED` registry.
- `templates/components/` — shared template primitives (`IntroTemplate`, `ThreeUpTemplate`).
- `templates/sample/` — sample deck and per-slide CSS.
- `templates/preview/[slide]/` — single-slide preview route.
- `app/whatispeterupto/TEMPLATES.md` — broader design / composition guidance (which template to reach for, gaps, primitives).
