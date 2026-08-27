# Prompt chips — design decision

_Decided 2026-06-12 via a `/diverge` round on the editable chips in the image-editing prototype's prompt._

## Context

The image-editing prototype's prompt is a live, tappable sentence — each editable
word opens a picker of alternatives. The shipped chips were gray outline pills.
Before investing further we probed three conceptually distinct chip designs.

## Probed

- **Current** — outlined inline pills that open a frosted word-wheel centered over
  the word (current word in the middle, alternatives fanning above/below).
- **1 · Inline reel** — _What if tapping expands the word in-flow into a horizontal
  filmstrip you scrub through — no overlay, current word centered, neighbours
  peeking?_ Tactile, but you can't see the whole set at once.
- **2 · Prose** — _What if the words are editable prose with a quiet dotted
  underline, recede until touched, and reading scans as a sentence?_
- **3 · Swatches** — _What if you choose by look, not word — a tray of preview
  thumbnails (a swatch per option) with the word as caption?_ The departure;
  previews were faked.

## Winner: **Prose** (`variant-2-prose`)

No tunable params.

### Why (Peter, in his own words)

> _(pending — to be filled from Peter's one-liner)_

### Port adjustments (Peter's direction)

The winning idea was the **prose word treatment**, not variant 2's whole package.
Three changes were folded in during the port:

1. **Fully monochromatic.** Dropped the lava-red accent on the regenerating option
   and on edited words — the prompt is now all grayscale. (`ALTER_KEYWORD` still
   drives the real image regen; it just has no special color.)
2. **Popover stays centered on the tapped word** — kept the shipped word-wheel
   centering rather than variant 2's below-the-word anchor.
3. **Selected word is a rounded chip.** Default words are dotted-underline prose;
   tapping (open) or committing a change (edited) inflates the word into a rounded
   monochrome chip and drops the underline. Edited stays filled + bold so changed
   words read at a glance.

## Implementation

All in the shipped files — no new components:

- `app/archive/prototypes/components/ImageEditingView.tsx` — `EditableChip`
  unchanged in structure (already centered its popover); dead `data-lava`
  attribute removed from options.
- `app/archive/prototypes/theme.css` — `.imgedit-chip` default is now
  dotted-underline prose; `[data-open]` / `[data-edited]` inflate to a rounded
  monochrome chip; lava-red option rules removed.

The `/diverge` harness and `explorations/prompt-chips/` were torn down after the port.
