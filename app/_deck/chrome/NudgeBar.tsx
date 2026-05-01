"use client";

import { useEffect, useState } from "react";
import { useDeck } from "../Deck";

const IDLE_MS = 8000;

export function NudgeBar() {
  const { activeIndex, total, lastNavKeyAt } = useDeck();
  const [shown, setShown] = useState(false);

  // Reset & re-arm idle timer on slide change or nav-key
  useEffect(() => {
    setShown(false);
    if (activeIndex >= total - 1) return;
    const t = window.setTimeout(() => setShown(true), IDLE_MS);
    return () => window.clearTimeout(t);
  }, [activeIndex, total, lastNavKeyAt]);

  // Hide on mousemove (any movement = user is active)
  useEffect(() => {
    if (!shown) return;
    const onMove = () => setShown(false);
    document.addEventListener("mousemove", onMove, { passive: true, once: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, [shown]);

  if (activeIndex >= total - 1) return null;

  return (
    <div
      className="wipu-nudge"
      data-shown={shown ? "true" : undefined}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
