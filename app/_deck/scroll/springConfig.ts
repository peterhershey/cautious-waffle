/* Locked-in spring scroll feel — used by both the home deck and case-study
   decks for a consistent "flip-through" feel across the site. */

export const LOCKED_SPRING = {
  stiffness: 275,
  damping: 29,
  mass: 0.6,
  /** Initial velocity injected so the spring engages instantly instead of
      ramping up from rest. */
  velocityKick: 1700,
  /** Post-fire wheel debounce. Tuned high enough that trackpad noise can't
      chain a second slide. */
  cooldownMs: 180,
} as const;
