"use client";

import { useEffect, useRef } from "react";

/* Section-break "slide": an ASCII rule + a spaced title + meta, with generous
 * vertical breathing room. Paired with a beat's `clear` flag it lands on a
 * freshly-emptied screen — a deliberate pause between walls of output. */

const RULE = "─".repeat(14) + "  ◇  " + "─".repeat(14);
const REVEAL_MS = 300;

type Props = {
  title: string;
  meta?: string;
  active: boolean;
  onDone?: () => void;
};

export function DividerSlide({ title, meta, active, onDone }: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

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
    const id = window.setTimeout(() => onDoneRef.current?.(), REVEAL_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <div className="term-divider">
      <div className="term-divider-rule term-faint">{RULE}</div>
      <div className="term-divider-title term-accent">{title}</div>
      {meta ? <div className="term-divider-meta term-dim">{meta}</div> : null}
      <div className="term-divider-rule term-faint">{RULE}</div>
    </div>
  );
}
