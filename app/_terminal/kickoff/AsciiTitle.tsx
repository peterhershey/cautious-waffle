"use client";

import { useEffect, useRef, useState } from "react";
import { BANNER_PETER, BANNER_HERSHEY } from "./banner";

const ROWS: string[] = [...BANNER_PETER, "", ...BANNER_HERSHEY];
const ROW_MS = 85;

type Props = {
  /** When true, the banner reveals row-by-row, then fires onDone. When false
   *  (history / reduced-motion) it renders in full and fires onDone at once. */
  active: boolean;
  onDone?: () => void;
};

/** The one-time kickoff title moment. Pre-baked figlet (banner.ts) revealed
 *  line-by-line in the terminal's live lime. Mirrors EyeAscii's effect-gated,
 *  reduced-motion-aware <pre> pattern (case-studies/.../EyeAscii.tsx). */
export function AsciiTitle({ active, onDone }: Props) {
  const [revealed, setRevealed] = useState(() => (active ? 0 : ROWS.length));
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setRevealed(ROWS.length);
      onDoneRef.current?.();
      return;
    }

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setRevealed(ROWS.length);
      onDoneRef.current?.();
      return;
    }

    setRevealed(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= ROWS.length) {
        window.clearInterval(id);
        onDoneRef.current?.();
      }
    }, ROW_MS);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <pre className="term-banner term-accent" aria-label="Peter Hershey">
      {ROWS.slice(0, revealed).join("\n")}
    </pre>
  );
}
