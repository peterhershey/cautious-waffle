"use client";

import { useEffect, useState } from "react";

type Status = "good" | "poor";

const LABELS: Record<Status, string> = {
  good: "24fps",
  poor: "10fps",
};

// How long the pill stays expanded after a tap before auto-collapsing.
const AUTO_COLLAPSE_MS = 2800;

type Props = {
  status: Status;
};

/**
 * Labs feature — stream status indicator.
 * Default: a pulsing dot in the top-left (just the dot, no label).
 * Tap: expands into a pill with the current fps, then auto-collapses
 * back to the resting circle after a few seconds.
 * Status changes update color and label; they do NOT auto-expand.
 */
export function StreamStatus({ status }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Auto-collapse: every time the pill opens, schedule a reset. Tapping
  // again while expanded restarts the timer (because the effect re-runs
  // when `expanded` flips from false → true via the toggle).
  useEffect(() => {
    if (!expanded) return;
    const t = window.setTimeout(() => setExpanded(false), AUTO_COLLAPSE_MS);
    return () => window.clearTimeout(t);
  }, [expanded]);

  return (
    <button
      type="button"
      className="proto-stream-status"
      data-status={status}
      data-expanded={expanded}
      onClick={() => setExpanded((v) => !v)}
      aria-label={
        expanded
          ? `Stream ${status === "good" ? "healthy" : "degraded"}, ${LABELS[status]}`
          : "Show stream status"
      }
      aria-expanded={expanded}
    >
      <span className="proto-stream-dot" aria-hidden />
      <span className="proto-stream-label">{LABELS[status]}</span>
    </button>
  );
}
