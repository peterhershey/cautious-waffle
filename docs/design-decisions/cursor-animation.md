# Cursor animation — design decision

_Decided 2026-06-09 via a `/diverge` round on the homepage cursor._

## Context

The homepage deck started with a lo-fi "Claude burst" cursor — a terracotta
radial asterisk that replaced the native cursor, tracked the pointer, cycled the
brand palette, and stretched with speed. Before investing further we probed three
conceptually distinct directions against it.

## Probed

- **Current** — the shipped burst: a single sprite glued to the pointer, snappy
  1:1 tracking, stepped shimmer, palette cycling, speed-stretch.
- **1 · Momentum** — _What if the cursor had weight?_ The burst on a spring,
  lagging and wobbling to a stop instead of tracking 1:1.
- **2 · Field** — _What if there were no cursor sprite at all?_ A viewport grid of
  ticks that lean toward, lengthen, and light up around the pointer (iron filings).
- **3 · Swarm** — _What if the cursor were many?_ A flock of sparks that schools
  around the pointer, scatters on fast moves, and coalesces when paused.

## Winner: **Field** (`variant-2-field`)

Param dialed in: **Reach = 350px** (baked as `REACH` in `CursorField.tsx`).

### Why (Peter, in his own words)

> It felt calmer, a little bit more refined of an effect, and sort of worked as a
> cool secondary element, but it didn't get [old] like all the other ones got old
> so fast. It was like, for two seconds, I was like, "Oh, that's cool," and then it
> got annoying. This one feels like a more subtle kind of effect that can be
> effective over long periods.

The burst, momentum, and swarm all read as novelty that wears off; the field works
as ambient atmosphere that holds up over a long session.

### Port note

The probe hid the native cursor; the shipped version **keeps the native cursor
visible** and runs the field as an ambient layer alongside it. A no-sprite effect
with the cursor hidden makes clicking imprecise — the exact kind of thing that gets
annoying over time, which is the opposite of why Field won (and it's the
accessibility-correct call).

## Implementation

- `app/_deck/cursor/CursorField.tsx` — the canvas layer (DPR-aware, resize +
  visibility handling, gated off on touch and `prefers-reduced-motion`).
- `app/_deck/cursor/cursor-field.css` — fixed `pointer-events: none` overlay.
- Mounted once in `app/(deck)/layout.tsx` (homepage deck only).
- Lit tone steps through the brand palette on the blink-caret cadence
  (`templates.css` → `wipu-tpl-emojihead-cursor-cycle`).

## Later refinements

- **Motion-driven ("wake through water").** Replaced the constant proximity glow
  with a per-point energy model: points gain energy from the speed + nearness of
  the pointer's pass (storing flow direction as a streak), then decay slowly.
  Invisible at rest, ramps up with movement, fades after stopping. Reach is no
  longer a single halo radius — see `INFLUENCE` / `DECAY` / `SPEED_REF` constants.
- **Moved behind content.** Canvas dropped from `z-index: 40` to `z-index: 0`,
  matching `.wipu-scene-bg` so it sits behind the slide content (shows through
  transparent slides; themed solid-color slides cover it).
- **Feel dialed in via a live tuning panel** (temporary, since removed). Final
  baked values in `CursorField.tsx`: wide brush (`INFLUENCE 370`), short streaks
  (`STREAK_LEN 12`), low `OPACITY 0.4`, quick settle (`DECAY 0.915`), eager
  `DEPOSIT 0.9`, `GRID_SPACING 48`, `GLOW 4` — a broad, subtle, fast-fading wake.
