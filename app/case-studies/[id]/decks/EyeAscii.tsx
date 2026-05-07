"use client";

import { useEffect, useState } from "react";
import { EYE_FRAMES } from "./eye-frames";

/* Characters grouped by similar visual density. Within a group, swapping
   one for another preserves the eye's shading while creating a subtle
   shimmer at the character level. */
const FLICKER_GROUPS: readonly string[] = [
  ".,'`",
  ";:",
  "cl",
  "ox",
  "kO",
  "XK",
  "W@",
];

const FLICKER_LOOKUP: Record<string, string> = {};
for (const group of FLICKER_GROUPS) {
  for (const ch of group) FLICKER_LOOKUP[ch] = group;
}

function flicker(base: string, swaps: number): string {
  const chars = base.split("");
  for (let i = 0; i < swaps; i++) {
    const pos = Math.floor(Math.random() * chars.length);
    const group = FLICKER_LOOKUP[chars[pos]];
    if (!group) continue;
    chars[pos] = group[Math.floor(Math.random() * group.length)];
  }
  return chars.join("");
}

function shuffled(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Placements for the four words around the arc of the eye. Coordinates
   are (row, col) within the 24×112 frame; positions cluster along the
   top/bottom arcs and sides without crowding the iris. Multiple slots
   per word so successive appearances feel scattered, not metronomic. */
type Placement = { word: string; row: number; col: number };
const PHRASE_PLACEMENTS: readonly Placement[] = [
  /* top arc */
  { word: "TEACHING", row: 2, col: 50 },
  { word: "GEMINI", row: 1, col: 72 },
  { word: "SEE", row: 3, col: 38 },
  { word: "TO", row: 2, col: 88 },
  /* bottom arc */
  { word: "TEACHING", row: 22, col: 48 },
  { word: "GEMINI", row: 21, col: 70 },
  { word: "SEE", row: 22, col: 32 },
  { word: "TO", row: 21, col: 92 },
  /* sides */
  { word: "GEMINI", row: 8, col: 4 },
  { word: "GEMINI", row: 15, col: 96 },
  { word: "SEE", row: 6, col: 22 },
  { word: "SEE", row: 17, col: 86 },
  /* near iris (small words only) */
  { word: "TO", row: 9, col: 74 },
  { word: "TO", row: 14, col: 32 },
];

const PHRASE_IN_MS = 700;
const PHRASE_HOLD_MS = 900;
const PHRASE_OUT_MS = 700;
const PHRASE_TOTAL_MS = PHRASE_IN_MS + PHRASE_HOLD_MS + PHRASE_OUT_MS;

type ActivePhrase = {
  word: string;
  row: number;
  col: number;
  startTime: number;
  shuffleIn: number[];
  shuffleOut: number[];
};

export function EyeAscii() {
  const baseOpen = EYE_FRAMES[0];
  const [frame, setFrame] = useState(baseOpen);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let baseFlicker = baseOpen;
    let tickCount = 0;
    const FLICKER_EVERY = 3; /* 3 × 80ms ≈ 240ms between shimmer updates */

    let active: ActivePhrase[] = [];
    /* Track recently used placements so the next pick is unlikely to
       repeat — keeps appearances feeling spread out around the arc. */
    const recent: number[] = [];

    const startPhrase = () => {
      let attempts = 6;
      let idx = 0;
      while (attempts-- > 0) {
        idx = Math.floor(Math.random() * PHRASE_PLACEMENTS.length);
        if (!recent.includes(idx)) break;
      }
      recent.push(idx);
      if (recent.length > 5) recent.shift();
      const p = PHRASE_PLACEMENTS[idx];
      active.push({
        word: p.word,
        row: p.row,
        col: p.col,
        startTime: performance.now(),
        shuffleIn: shuffled(p.word.length),
        shuffleOut: shuffled(p.word.length),
      });
    };

    /* Schedule successive appearances at 1.4–3.4s intervals — close
       enough that 1–2 words are usually active, far enough apart that
       gaps of total stillness still happen. */
    let phraseTimer = window.setTimeout(function schedule() {
      startPhrase();
      const nextDelay = 1400 + Math.random() * 2000;
      phraseTimer = window.setTimeout(schedule, nextDelay);
    }, 1500 + Math.random() * 1500);

    const tick = () => {
      tickCount++;
      if (tickCount % FLICKER_EVERY === 0) {
        baseFlicker = flicker(baseOpen, 10);
      }
      const now = performance.now();
      active = active.filter((p) => now - p.startTime < PHRASE_TOTAL_MS);

      let result = baseFlicker;
      if (active.length > 0) {
        const lines = result.split("\n");
        for (const p of active) {
          const elapsed = now - p.startTime;
          const visible = new Set<number>();
          if (elapsed < PHRASE_IN_MS) {
            const count = Math.floor(
              (elapsed / PHRASE_IN_MS) * p.word.length
            );
            for (let i = 0; i < count; i++) visible.add(p.shuffleIn[i]);
          } else if (elapsed < PHRASE_IN_MS + PHRASE_HOLD_MS) {
            for (let i = 0; i < p.word.length; i++) visible.add(i);
          } else {
            const outElapsed = elapsed - PHRASE_IN_MS - PHRASE_HOLD_MS;
            const hidden = Math.floor(
              (outElapsed / PHRASE_OUT_MS) * p.word.length
            );
            const hiddenSet = new Set(p.shuffleOut.slice(0, hidden));
            for (let i = 0; i < p.word.length; i++) {
              if (!hiddenSet.has(i)) visible.add(i);
            }
          }
          if (visible.size === 0) continue;
          if (p.row >= lines.length) continue;
          const lineChars = lines[p.row].split("");
          for (const i of visible) {
            const col = p.col + i;
            if (col >= 0 && col < lineChars.length) {
              lineChars[col] = p.word[i];
            }
          }
          lines[p.row] = lineChars.join("");
        }
        result = lines.join("\n");
      }

      setFrame(result);
    };

    const tickId = window.setInterval(tick, 80);
    return () => {
      window.clearInterval(tickId);
      window.clearTimeout(phraseTimer);
    };
  }, [baseOpen]);

  return (
    <div
      className="wpd-tgts-ascii-eye"
      role="img"
      aria-label="ASCII illustration of a blinking eye"
    >
      <pre
        className="wpd-tgts-ascii-eye-frame wpd-tgts-ascii-eye-frame-1"
        aria-hidden
      >
        {frame}
      </pre>
      {EYE_FRAMES.slice(1).map((f, i) => (
        <pre
          key={i}
          className={`wpd-tgts-ascii-eye-frame wpd-tgts-ascii-eye-frame-${i + 2}`}
          aria-hidden
        >
          {f}
        </pre>
      ))}
    </div>
  );
}
