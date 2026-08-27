"use client";

import { useTerminal } from "../TerminalContext";

type Hint = { key: string; label: string };

/** Claude-Code-style key-hint footer. Phase-aware: while streaming the primary
 *  action is "skip"; once parked it's "next". Solves discoverability without
 *  instructions. */
export function StatusLine() {
  const { state, paletteOpen, gallerySlide } = useTerminal();

  let hints: Hint[];
  if (gallerySlide !== null) {
    hints = [
      { key: "space", label: "flip" },
      { key: "←", label: "back" },
      { key: "esc", label: "close" },
    ];
  } else if (paletteOpen) {
    hints = [
      { key: "↑↓", label: "select" },
      { key: "enter", label: "jump" },
      { key: "esc", label: "close" },
    ];
  } else if (state.phase !== "done") {
    hints = [
      { key: "space", label: "skip" },
      { key: "/", label: "jump" },
    ];
  } else {
    hints = [
      { key: "space", label: "next" },
      { key: "←", label: "back" },
      { key: "/", label: "jump" },
    ];
  }

  return (
    <div className="term-status" role="status">
      {hints.map((h, i) => (
        <span key={h.label} className="term-status-item">
          {i > 0 ? <span className="term-status-sep"> · </span> : null}
          <span className="term-status-key term-accent">{h.key}</span>{" "}
          <span className="term-dim">{h.label}</span>
        </span>
      ))}
    </div>
  );
}
