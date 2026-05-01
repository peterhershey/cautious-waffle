"use client";

import { useEffect, useState } from "react";
import "./site-frame.css";

const POOL = "▣●○·┌┐└┘─│═┬┴├┤◉/\\".split("");
const SCRAMBLE_MS = 900;

type Glyph = { ch: string };
type Pattern = Glyph[][];

const g = (ch: string): Glyph => ({ ch });

function parse(...rows: string[]): Pattern {
  return rows.map((row) => [...row].map((ch) => g(ch)));
}

function hashKey(key: string | number | undefined): number {
  if (key === undefined) return 0;
  if (typeof key === "number") return Math.abs(key);
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// TL is built per-route so the page label can be woven into the art.
// Traces hug the top and left edges; when present, the label sits on
// its own line (or inside a bracketed/bus-rail header) so the
// horizontal run never touches the text.
function buildTL(
  label: string | undefined,
  num: string | undefined,
  variant: number,
): Pattern {
  const head = label ? (num ? `${num}  ${label}` : label) : null;
  const v = variant % 4;
  let rows: string[];

  if (v === 0) {
    const trace = [
      `─●───○───●───○──~~`,
      `│`,
      `│`,
      `│`,
      `▣`,
      `│`,
      `│`,
      `●`,
      `│`,
      `│`,
      `·`,
      `│`,
      `~`,
    ];
    rows = head ? [head, ...trace] : trace;
  } else if (v === 1) {
    rows = [
      head
        ? `┌─[ ${head} ]──●──○──●──~~`
        : `┌──●──○──●──~~`,
      `│`,
      `│`,
      `●`,
      `│`,
      `│`,
      `▣`,
      `│`,
      `│`,
      `·`,
      `│`,
      `~`,
    ];
  } else if (v === 2) {
    const trace = [
      `●─┬─○─●─○─●──~~`,
      `  │`,
      `  ▣`,
      `│`,
      `│`,
      `│`,
      `●`,
      `│`,
      `│`,
      `·`,
      `│`,
      `~`,
    ];
    rows = head ? [head, ...trace] : trace;
  } else {
    rows = [
      head
        ? `═══[ ${head} ]══════════~~`
        : `═══════════════════~~`,
      `│`,
      `│`,
      `●`,
      `│`,
      `│`,
      `│`,
      `▣`,
      `│`,
      `│`,
      `·`,
      `│`,
      `~`,
    ];
  }

  return rows.map((row) => [...row].map((ch) => g(ch)));
}

const TR_VARIANTS: Pattern[] = [
  parse(
    "~~──●───○───●───○──┐",
    "                   │",
    "                   │",
    "                   ▣",
    "                   │",
    "                   │",
    "                   ●",
    "                   │",
    "                   ·",
    "                   │",
    "                   ~",
  ),
  parse(
    "════════════════════",
    "                   │",
    "~~──●───○───●──●───┘",
    "                   │",
    "                   ●",
    "                   │",
    "                   ▣",
    "                   │",
    "                   ·",
    "                   ~",
  ),
  parse(
    "~~──●─○─●─○─●──┐",
    "               │",
    "               ▣",
    "               │",
    "               │",
    "               ●",
    "               │",
    "               │",
    "               ·",
    "               │",
    "               ~",
  ),
];

const BR_VARIANTS: Pattern[] = [
  parse(
    "                   ~",
    "                   │",
    "                   ·",
    "                   │",
    "                   ●",
    "                   │",
    "                   │",
    "                   ▣",
    "                   │",
    "                   │",
    "~~──●───○───●───○──┘",
  ),
  parse(
    "               ~",
    "               │",
    "               ●",
    "               │",
    "               ▣  ─○─",
    "               │",
    "               │",
    "~~──●─○─●─○─●──┘",
  ),
  parse(
    "                   ~",
    "                   │",
    "                   ·",
    "                   │",
    "                   ●",
    "                   │",
    "                   ▣",
    "                   │",
    "~~──●─┬─○─●─┬─○────┘",
    "      │     │",
    "      ●     ▣",
  ),
];

const BL_VARIANTS: Pattern[] = [
  parse(
    "~",
    "│",
    "·",
    "│",
    "│",
    "●",
    "│",
    "│",
    "▣",
    "│",
    "│",
    "└─●───○───●───○──~~",
  ),
  parse(
    "~",
    "│",
    "·",
    "│",
    "▣  ─○─",
    "│",
    "│",
    "●",
    "│",
    "│",
    "└─●─○─●─○─●──~~",
  ),
  parse(
    "~",
    "│",
    "·",
    "│",
    "●",
    "│",
    "│",
    "▣",
    "│",
    "└══●═════════════~~",
  ),
];

type CornerKey = "tr" | "br" | "bl";

// Always include TL. Cycle through pairs of the outer three for spontaneity.
const OUTER_PAIRS: ReadonlyArray<ReadonlyArray<CornerKey>> = [
  ["tr", "br"],
  ["br", "bl"],
  ["tr", "bl"],
];

function pseudoRand(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function RenderedPattern({
  pattern,
  progress,
  tick,
  seed,
}: {
  pattern: Pattern;
  progress: number;
  tick: number;
  seed: number;
}) {
  const total = pattern.reduce((acc, row) => acc + row.length, 0);
  let order = 0;
  return (
    <>
      {pattern.map((row, ri) => (
        <div key={ri}>
          {row.map((cell, ci) => {
            const idx = order++;
            const isSpace = cell.ch === " ";
            const lockIn =
              0.55 * (idx / Math.max(1, total - 1)) +
              0.45 * pseudoRand(idx + seed * 17);
            const locked = progress >= lockIn;
            let display = cell.ch;
            if (!locked && !isSpace) {
              display = POOL[(tick + idx * 7 + seed * 3) % POOL.length];
            }
            const className =
              !locked && !isSpace ? "site-frame-scramble" : undefined;
            return (
              <span key={ci} className={className}>
                {display}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
}

export type SiteFrameProps = {
  /** TL line. When present, sits on its own line so the trace below never touches it. */
  label?: string;
  /** Optional leading number, prepended to label as "{num}  {label}" (deck uses this). */
  num?: string;
  /** Any change retriggers the scramble and rotates the variant. */
  scrambleKey?: string | number;
};

export function SiteFrame({ label, num, scrambleKey = 0 }: SiteFrameProps) {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const loop = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / SCRAMBLE_MS);
      setProgress(p);
      setTick((t) => t + 1);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrambleKey]);

  const variant = hashKey(scrambleKey);
  const isScrambling = progress < 1;

  const tlPattern = buildTL(label, num, variant);
  const outerPair = OUTER_PAIRS[variant % OUTER_PAIRS.length];

  const cornerClass = (key: string) =>
    [
      "site-frame-corner",
      `site-frame-${key}`,
      isScrambling ? "is-scrambling" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="site-frame" aria-hidden="true">
      <div className={cornerClass("tl")}>
        <RenderedPattern
          pattern={tlPattern}
          progress={progress}
          tick={tick}
          seed={variant * 11}
        />
      </div>
      {outerPair.includes("tr") && (
        <div className={cornerClass("tr")}>
          <RenderedPattern
            pattern={TR_VARIANTS[variant % TR_VARIANTS.length]}
            progress={progress}
            tick={tick}
            seed={variant * 11 + 1}
          />
        </div>
      )}
      {outerPair.includes("br") && (
        <div className={cornerClass("br")}>
          <RenderedPattern
            pattern={BR_VARIANTS[variant % BR_VARIANTS.length]}
            progress={progress}
            tick={tick}
            seed={variant * 11 + 2}
          />
        </div>
      )}
      {outerPair.includes("bl") && (
        <div className={cornerClass("bl")}>
          <RenderedPattern
            pattern={BL_VARIANTS[variant % BL_VARIANTS.length]}
            progress={progress}
            tick={tick}
            seed={variant * 11 + 3}
          />
        </div>
      )}
    </div>
  );
}
