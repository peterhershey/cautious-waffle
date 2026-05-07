"use client";

import { type AnimationPlaybackControls } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { LOCKED_SPRING } from "./springConfig";
import { containerSurface, springScrollTo } from "./springScroll";

type AnimControls = AnimationPlaybackControls;

type Params = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  total: number;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  bumpNavKey: () => void;
};

export function useDeckScroll({
  containerRef,
  total,
  activeIndex,
  setActiveIndex,
  bumpNavKey,
}: Params) {
  const animRef = useRef<AnimControls | null>(null);
  const isAnimatingRef = useRef(false);
  const activeIndexRef = useRef(activeIndex);
  // Synchronous "where the user has committed to" — updated inside goTo before
  // React re-renders, so back-to-back wheel events advance from the new target.
  const intentIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    intentIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      const target = clamped * container.clientHeight;

      animRef.current?.stop();
      intentIndexRef.current = clamped;
      setActiveIndex(clamped);

      isAnimatingRef.current = true;
      animRef.current = springScrollTo(containerSurface(container), target, {
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      // springScrollTo returns null when already at target / reduced-motion.
      if (!animRef.current) isAnimatingRef.current = false;
    },
    [containerRef, total, setActiveIndex],
  );

  useEffect(() => {
    return () => {
      animRef.current?.stop();
    };
  }, []);

  // Wheel hijack: one gesture = one slide by default, but a strong-enough
  // event during the lock can break through and advance an extra slide.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cooldownUntil = 0;
    let lastFireAt = 0;
    const BREAK_DELTA = 200; // |deltaY| that overrides the lock
    const BREAK_GAP_MS = 200; // min spacing between break-through fires

    const onWheel = (e: WheelEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t?.closest(
          "input, textarea, [contenteditable='true'], [data-allow-scroll='true']",
        )
      ) {
        return;
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (Math.abs(e.deltaY) < 8) return;

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const locked = isAnimatingRef.current || now < cooldownUntil;
      const strong = Math.abs(e.deltaY) >= BREAK_DELTA;

      if (locked) {
        if (!strong || now - lastFireAt < BREAK_GAP_MS) return;
      }

      const dir = e.deltaY > 0 ? 1 : -1;
      bumpNavKey();
      goTo(intentIndexRef.current + dir);
      lastFireAt = now;
      cooldownUntil = now + LOCKED_SPRING.cooldownMs;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [containerRef, goTo, bumpNavKey]);

  // Resize: keep scrollTop aligned to the active slide when clientHeight changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timer: number | null = null;

    const realign = () => {
      const c = containerRef.current;
      if (!c) return;
      const target = activeIndexRef.current * c.clientHeight;
      animRef.current?.stop();
      isAnimatingRef.current = false;
      c.scrollTop = target;
    };

    const onResize = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(realign, 120);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [containerRef]);

  return { goTo, isAnimatingRef };
}
