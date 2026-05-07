"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Phase = "enter" | "box" | "dot" | "exit";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  onDone: () => void;
};

const BOX_HOLD_MS = 2400;
const DOT_HOLD_MS = 1400;
const EXIT_MS = 300;

export function VisualOverlay({ x, y, width, height, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("enter");
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPhase("box"));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase === "box") {
      const t = window.setTimeout(() => setPhase("dot"), BOX_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "dot") {
      const t = window.setTimeout(() => setPhase("exit"), DOT_HOLD_MS);
      return () => window.clearTimeout(t);
    }
    if (phase === "exit") {
      const t = window.setTimeout(() => onDoneRef.current(), EXIT_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  return (
    <div
      className="proto-vo"
      data-phase={phase}
      style={
        {
          left: x,
          top: y,
          "--vo-w": `${width}px`,
          "--vo-h": `${height}px`,
          "--vo-enter-w": `${Math.round(width * 0.77)}px`,
          "--vo-enter-h": `${Math.round(height * 0.77)}px`,
        } as CSSProperties
      }
      aria-hidden
    />
  );
}
