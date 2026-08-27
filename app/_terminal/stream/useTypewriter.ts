"use client";

import { useEffect, useRef, useState } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Options = {
  /** When false, the text is shown in full immediately and onDone fires once.
   *  Use this to render history beats / inactive segments without animation. */
  enabled: boolean;
  /** Characters per second. */
  cps?: number;
  onDone?: () => void;
};

/** Reveals `text` character-by-character via a single rAF loop (frame-aligned,
 *  resolution-independent, auto-throttles in background tabs). Respects
 *  prefers-reduced-motion. SSR-safe: the rAF loop only starts inside an effect,
 *  and the server/first-paint value of `shown` is deterministic. */
export function useTypewriter(text: string, { enabled, cps = 42, onDone }: Options) {
  // Server + first client paint: empty while animating, full when not — both
  // deterministic, so no hydration mismatch (the rAF below runs client-only).
  const [shown, setShown] = useState(() => (enabled ? "" : text));
  const [done, setDone] = useState(() => !enabled);

  // Keep the latest onDone without retriggering the effect.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.(REDUCED_MOTION).matches;

    if (reduce) {
      setShown(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setShown("");
    setDone(false);

    let raf = 0;
    let start = 0;
    let finished = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      const count = Math.min(text.length, Math.floor(elapsed * cps));
      setShown(text.slice(0, count));
      if (count >= text.length) {
        finished = true;
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (!finished) cancelAnimationFrame(raf);
    };
    // Re-run when the text or enabled flag changes.
  }, [text, enabled, cps]);

  return { shown, done };
}
