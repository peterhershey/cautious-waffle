import { LOCKED_SPRING } from "../_deck/scroll/springConfig";

/** Shared spring for shell morphs and pop-up entrances — matches the site-wide
 *  flip-through feel (the deck's locked spring) so terminal motion is of a
 *  piece with the case-study decks. */
export const SHELL_SPRING = {
  type: "spring" as const,
  stiffness: LOCKED_SPRING.stiffness,
  damping: LOCKED_SPRING.damping,
  mass: LOCKED_SPRING.mass,
};
