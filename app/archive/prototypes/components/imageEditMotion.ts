/* Motion tokens for the image-editing prototype ONLY.

   Intentionally NOT shared with app/_deck — the prototypes are a separate app
   with their own design language. Tuned for a "dynamic canvas": shapes
   transform into new shapes, surfaces unfurl from their origin, words flex and
   reflow. Personality is a subtle flex — a whisper of overshoot on arrivals
   (damping ratio ≈ 0.93–0.96), clean travel and exits. */

// ── Eases (cubic-bezier) ──────────────────────────────────────────────
export const EASE_STANDARD = [0.2, 0.7, 0.2, 1] as const; // travel, fades (house EASE)
export const EASE_DOLLY = [0.22, 0.9, 0.24, 1] as const; // push-in / out (house ZOOM_EASE)

// ── Spring family — the only three springs ────────────────────────────
// SNAP  — tap/press feedback, tiny travel. Crisp.
export const SPRING_SNAP = { type: "spring", stiffness: 520, damping: 32, mass: 0.6 } as const;
// SOFT  — surface travel: popovers, buttons, chips, hotspot. One soft kiss.
export const SPRING_SOFT = { type: "spring", stiffness: 380, damping: 31, mass: 0.7 } as const;
// MORPH — shared-element shape change: tile↔card, chip width. Weightier flex.
export const SPRING_MORPH = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const;

// ── Durations (seconds, unless _MS) ───────────────────────────────────
export const DUR_FAST = 0.18; // micro fades (hint, icon crossfade)
export const DUR_BASE = 0.26; // standard crossfade
export const DUR_DOLLY = 0.52; // push into / out of region
export const REGEN_MS = 6500; // generative dwell — measured, not frantic

// ── Stagger ───────────────────────────────────────────────────────────
export const STAGGER_TILES = 0.045; // satellite tiles clearing out of the way
export const STAGGER_OPTS = 0.018; // popover options cascading in

// ── Semantic presets (spread into a <motion> `transition`) ────────────
export const morph = { layout: SPRING_MORPH } as const;
export const popover = { ...SPRING_SOFT } as const;
export const dolly = { duration: DUR_DOLLY, ease: EASE_DOLLY } as const;
export const dissolve = { duration: DUR_BASE, ease: EASE_STANDARD } as const;

// ── Frosted regenerate ────────────────────────────────────────────────
// The NEW image doesn't exist yet, so for most of the dwell we show the OLD
// image blurred under crawling noise. Only in the final stretch does the new
// (orange) image fade in — still blurry — and then denoise sharp at the very end.
//
// The old, blurred image holds, then yields to the new image late.
export const oldHold = {
  duration: REGEN_MS / 1000,
  times: [0, 0.05, 0.7, 0.86],
  ease: EASE_STANDARD,
};
// The new image fades in (still blurry) over the final ~2s, then resolves sharp.
export const newReveal = {
  duration: REGEN_MS / 1000,
  times: [0, 0.7, 0.86, 1],
  ease: EASE_DOLLY,
};
// The frosted-noise veil eases in, holds, then clears just before the sharp
// image lands so the final frame is clean.
export const noiseFade = {
  duration: REGEN_MS / 1000,
  times: [0, 0.08, 0.8, 0.95],
  ease: EASE_STANDARD,
};
