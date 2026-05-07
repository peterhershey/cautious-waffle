"use client";

import { animate, type AnimationPlaybackControls } from "framer-motion";
import { LOCKED_SPRING } from "./springConfig";

export type ScrollSurface = {
  getCurrent: () => number;
  setCurrent: (v: number) => void;
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const containerSurface = (el: HTMLElement): ScrollSurface => ({
  getCurrent: () => el.scrollTop,
  setCurrent: (v) => {
    el.scrollTop = v;
  },
});

export const windowSurface = (): ScrollSurface => ({
  getCurrent: () =>
    typeof window === "undefined" ? 0 : window.scrollY,
  setCurrent: (v) => {
    if (typeof window !== "undefined") window.scrollTo(0, v);
  },
});

type Options = {
  onComplete?: () => void;
};

/**
 * Spring-animate a scroll surface to `target`. Returns the animation handle
 * so callers can stop it on interrupt, or `null` if no animation was needed
 * (already at target, or reduced-motion environment).
 */
export function springScrollTo(
  surface: ScrollSurface,
  target: number,
  options: Options = {},
): AnimationPlaybackControls | null {
  const current = surface.getCurrent();
  if (Math.abs(current - target) < 0.5) {
    options.onComplete?.();
    return null;
  }

  if (prefersReducedMotion()) {
    surface.setCurrent(target);
    options.onComplete?.();
    return null;
  }

  const delta = target - current;
  const velocity = Math.sign(delta) * LOCKED_SPRING.velocityKick;

  return animate(current, target, {
    type: "spring",
    stiffness: LOCKED_SPRING.stiffness,
    damping: LOCKED_SPRING.damping,
    mass: LOCKED_SPRING.mass,
    velocity,
    onUpdate: (v) => surface.setCurrent(v),
    onComplete: options.onComplete,
  });
}
