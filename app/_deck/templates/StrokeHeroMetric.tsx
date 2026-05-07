/* Hero metric — the number is rendered as SVG <text> with stroke only,
   no fill ever. A stroke-dashoffset animation draws the glyph outlines
   on as if a plotter is tracing them. Mono face for the ASCII-adjacent
   line-art feel.

   Re-triggers via IntersectionObserver each time the slide returns to
   view (key bump remounts the SVG so the CSS animation replays). */

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type StrokeHeroMetricProps = {
  /** The big number itself, e.g. "20–30%". Newlines split into stacked
     lines (rendered as tspans), letting longer titles like
     "What have we\nlearned?" claim more vertical real estate. */
  number: string;
  label?: ReactNode;
  note?: ReactNode;
};

const FONT_SIZE = 240;
const PAD = 8;
const FALLBACK_VIEWBOX = `0 0 800 ${FONT_SIZE + PAD * 2}`;

export function StrokeHeroMetric({
  number,
  label,
  note,
}: StrokeHeroMetricProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);
  const [run, setRun] = useState(0);
  const [viewBox, setViewBox] = useState<string>(FALLBACK_VIEWBOX);
  const [ready, setReady] = useState(false);
  /* Dasharray sized from the measured bbox so the draw-on animation
     traces the full glyph outlines for any string length, short metric
     or long title. ~3× width is a safe heuristic for the combined
     perimeter of mono-glyph outlines. */
  const [dashLen, setDashLen] = useState<number>(4000);

  /* Measure the rendered text bbox, then size the viewBox to fit so the
     SVG scales precisely to its glyphs without slack. */
  useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return;
    const measure = () => {
      const b = t.getBBox();
      if (b.width === 0 || b.height === 0) return false;
      setViewBox(
        `${b.x - PAD} ${b.y - PAD} ${b.width + PAD * 2} ${b.height + PAD * 2}`,
      );
      /* getComputedTextLength sums character advances across all
         tspans, so the dasharray scales correctly for multi-line
         titles without underestimating from bbox.width alone. */
      const advance = t.getComputedTextLength?.() ?? b.width;
      setDashLen(Math.ceil(advance * 3));
      setReady(true);
      return true;
    };
    if (measure()) return;
    /* getBBox can return zeros before the web font lands — re-measure
       after fonts are ready and on a couple of rAFs as a safety net. */
    let cancelled = false;
    const tryAgain = () => {
      if (cancelled) return;
      if (!measure()) requestAnimationFrame(tryAgain);
    };
    requestAnimationFrame(tryAgain);
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [number, run]);

  /* IntersectionObserver retrigger — bumping `run` remounts the SVG via
     the key, restarting the CSS draw-on animation. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setRun((k) => k + 1);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="wipu-sample-heroMetric">
      <svg
        key={run}
        className="wipu-sample-heroMetric-svg"
        viewBox={viewBox}
        /* Bottom-align the glyph inside the SVG box so the visible
           number ends right at the SVG's bottom edge — keeps the label
           tight under the number when the SVG box is taller than the
           glyph (happens for short labels like "3X" / "1B"). */
        preserveAspectRatio="xMidYMax meet"
        role="img"
        aria-label={number}
        data-ready={ready ? "true" : undefined}
      >
        <text
          ref={textRef}
          x="0"
          y="0"
          dominantBaseline="hanging"
          fontSize={FONT_SIZE}
          className="wipu-sample-heroMetric-svg-text"
          style={{ strokeDasharray: dashLen, strokeDashoffset: dashLen }}
        >
          {(() => {
            const lines = number.split("\n");
            if (lines.length === 1) return number;
            return lines.map((line, i) => (
              <tspan key={i} x="0" dy={i === 0 ? 0 : FONT_SIZE}>
                {line}
              </tspan>
            ));
          })()}
        </text>
      </svg>
      {label && <div className="wipu-sample-heroMetric-lbl">{label}</div>}
      {note && <p className="wipu-sample-heroMetric-note">{note}</p>}
    </div>
  );
}
