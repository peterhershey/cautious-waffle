"use client";

import { useEffect, useRef, useState } from "react";
import { EYE_FRAMES } from "../../case-studies/[id]/decks/eye-frames";

/* Reuses the case study's ASCII eye-frame DATA (eye-frames.ts) but renders it
 * standalone — the original EyeAscii component is coupled to case-study CSS.
 * Here it's a terminal title moment: an open eye that blinks now and then,
 * in the terminal accent. Reduced-motion → a single static open frame. */

const OPEN = 0;
const FRAME_MS = 70; // per-frame during a blink
const IDLE_MIN = 3200;
const IDLE_MAX = 6000;
const OPEN_MS = 360; // hold before releasing the beat sequence

type Props = { active: boolean; onDone?: () => void };

export function EyeTitle({ active, onDone }: Props) {
  const [frame, setFrame] = useState(OPEN);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Release the beat sequence shortly after the eye appears.
  useEffect(() => {
    if (!active) {
      onDoneRef.current?.();
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDoneRef.current?.();
      return;
    }
    const id = window.setTimeout(() => onDoneRef.current?.(), OPEN_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  // Idle-then-blink loop. A blink steps to the last frame and back.
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const last = EYE_FRAMES.length - 1;
    let timers: number[] = [];

    const blink = () => {
      const seq = [
        ...Array.from({ length: last + 1 }, (_, i) => i),
        ...Array.from({ length: last }, (_, i) => last - 1 - i),
      ]; // 0→last→0
      seq.forEach((f, i) => {
        timers.push(window.setTimeout(() => setFrame(f), i * FRAME_MS));
      });
      const idle = IDLE_MIN + (IDLE_MAX - IDLE_MIN) * 0.5;
      timers.push(
        window.setTimeout(blink, seq.length * FRAME_MS + idle),
      );
    };

    const startId = window.setTimeout(blink, IDLE_MIN);
    timers.push(startId);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <pre className="term-eye term-accent" aria-label="ASCII eye">
      {EYE_FRAMES[frame]}
    </pre>
  );
}
