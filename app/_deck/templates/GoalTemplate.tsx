/* Template — Goal statement with annotated callouts.
   A central north-star line, optional emoji prefix, and up to four
   corner annotation cards connected by orthogonal dashed leader lines.

   Two-step slide: step 0 shows the goal alone; step 1 fades in the
   annotation cards and draws each leader from the card edge to the
   targeted word. The keyboard handler intercepts arrow keys at capture
   phase while the slide is the active one in the viewport, so the deck
   only advances to the next slide once both steps have played. */

"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type GoalAnnotation = {
  position: "tl" | "tr" | "bl" | "br";
  text: ReactNode;
  /** Optional id matching a `<GoalTarget id>` inside the goal text. When
      set, the leader points at that exact word. */
  target?: string;
};

export type GoalTemplateProps = {
  eyebrow?: ReactNode;
  emoji?: ReactNode;
  goal: ReactNode;
  annotations?: GoalAnnotation[];
};

export function GoalTarget({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return <span data-goal-target={id}>{children}</span>;
}

const VB_W = 1200;
const VB_H = 700;

/* Stable empty-array reference for the default. Prevents a fresh `[]`
   each render from churning the dep arrays of the layout effects below
   into an infinite update loop. */
const EMPTY_ANNOTATIONS: GoalAnnotation[] = [];

const CORNER_PATHS: Record<GoalAnnotation["position"], string> = {
  tr: "M 1020 230 V 290 H 540 V 330",
  tl: "M 180 230 V 290 H 660 V 330",
  br: "M 1020 600 V 540 H 540 V 400",
  bl: "M 180 600 V 540 H 660 V 400",
};

export function GoalTemplate({
  eyebrow = "GOAL",
  emoji = "🎯",
  goal,
  annotations = EMPTY_ANNOTATIONS,
}: GoalTemplateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [computed, setComputed] = useState<Record<number, string>>({});
  const [pathLengths, setPathLengths] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);
  const [markersOn, setMarkersOn] = useState(false);

  const totalSteps = annotations.length > 0 ? 2 : 1;

  /* Measure card and target word positions, build the leader path so
     it starts on the card's inner edge and ends just outside the word. */
  useLayoutEffect(() => {
    if (annotations.length === 0) return;
    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      if (cRect.width === 0 || cRect.height === 0) return;
      const sx = VB_W / cRect.width;
      const sy = VB_H / cRect.height;
      const next: Record<number, string> = {};
      annotations.forEach((a, i) => {
        if (!a.target) return;
        const wordEl = container.querySelector<HTMLElement>(
          `[data-goal-target="${a.target}"]`,
        );
        const cardEl = container.querySelector<HTMLElement>(
          `[data-goal-card="${i}"]`,
        );
        if (!wordEl || !cardEl) return;

        const wRect = wordEl.getBoundingClientRect();
        const kRect = cardEl.getBoundingClientRect();
        const isCardOnTop = a.position === "tl" || a.position === "tr";

        // Card anchor — middle of the card's inside edge (bottom for
        // top cards, top for bottom cards).
        const cardX = (kRect.left + kRect.width / 2 - cRect.left) * sx;
        const cardY = isCardOnTop
          ? (kRect.bottom - cRect.top) * sy + 4
          : (kRect.top - cRect.top) * sy - 4;

        // Word anchor — top edge for top cards, bottom edge for bottom
        // cards. Pulled a few px outward so the arrow doesn't sit on
        // top of the glyph.
        const wordX = (wRect.left + wRect.width / 2 - cRect.left) * sx;
        const wordY = isCardOnTop
          ? (wRect.top - cRect.top - 6) * sy
          : (wRect.bottom - cRect.top + 6) * sy;

        // Manhattan: vertical out of card, horizontal across, vertical
        // into word. Last segment is V so the arrowhead orients in the
        // word's direction.
        const midY = (cardY + wordY) / 2;
        next[i] = `M ${cardX} ${cardY} V ${midY} H ${wordX} V ${wordY}`;
      });
      setComputed(next);
    };
    compute();
    const onResize = () => compute();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [annotations]);

  // Re-measure once web fonts settle (word metrics shift).
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts?.ready) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      window.dispatchEvent(new Event("resize"));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* After paths are written to the DOM, capture each path's total length
     for the draw-on animation (stroke-dasharray = length). */
  useLayoutEffect(() => {
    if (annotations.length === 0) return;
    const lens: Record<number, number> = {};
    pathRefs.current.forEach((el, i) => {
      if (!el) return;
      try {
        lens[i] = el.getTotalLength();
      } catch {
        /* path not yet laid out */
      }
    });
    setPathLengths(lens);
  }, [computed, annotations]);

  /* Two-step keyboard navigation. Capture phase + stopImmediatePropagation
     so the deck's slide-level handler doesn't advance until both steps
     of this slide have played. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isActive = rect.top <= vh / 2 && rect.bottom >= vh / 2;
      if (!isActive) return;

      const dir =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
          ? 1
          : e.key === "ArrowUp" ||
              e.key === "ArrowLeft" ||
              e.key === "PageUp" ||
              (e.key === " " && e.shiftKey)
            ? -1
            : 0;
      if (dir === 0) return;

      if (dir === 1 && step < totalSteps - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStep(step + 1);
      } else if (dir === -1 && step > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStep(step - 1);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [step, totalSteps]);

  /* Hold the arrowhead marker off until the line has finished drawing
     so it never floats — it appears at the moment the stroke reaches
     the word. */
  useEffect(() => {
    if (step >= 1) {
      const t = window.setTimeout(() => setMarkersOn(true), 750);
      return () => window.clearTimeout(t);
    }
    setMarkersOn(false);
  }, [step]);

  return (
    <div
      ref={containerRef}
      className="wipu-tpl-goal"
      data-step={step}
      data-marker={markersOn ? "on" : "off"}
    >
      <div className="wipu-tpl-goal-eyebrow">{eyebrow}</div>

      <svg
        className="wipu-tpl-goal-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="wipu-tpl-goal-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {annotations.map((a, i) => {
          const d =
            a.target && computed[i]
              ? computed[i]
              : CORNER_PATHS[a.position];
          const len = pathLengths[i] ?? 0;
          const drawn = step >= 1;
          return (
            <path
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray={len ? `${len} ${len}` : undefined}
              strokeDashoffset={len ? (drawn ? 0 : len) : undefined}
              markerEnd={markersOn ? "url(#wipu-tpl-goal-arrow)" : undefined}
              style={{
                transition:
                  "stroke-dashoffset 700ms cubic-bezier(0.4, 0.6, 0.2, 1)",
              }}
            />
          );
        })}
      </svg>

      {annotations.map((a, i) => (
        <div
          key={i}
          data-goal-card={i}
          className={`wipu-tpl-goal-card wipu-tpl-goal-card-${a.position}`}
          style={{
            opacity: step >= 1 ? 1 : 0,
            transform: step >= 1 ? "translateY(0)" : "translateY(-6px)",
            transition: `opacity 380ms ease-out ${i * 80}ms, transform 380ms ease-out ${i * 80}ms`,
          }}
        >
          {a.text}
        </div>
      ))}

      <div className="wipu-tpl-goal-statement">
        {emoji && (
          <span className="wipu-tpl-goal-emoji" aria-hidden>
            {emoji}
          </span>
        )}
        <p className="wipu-tpl-goal-text">{goal}</p>
      </div>
    </div>
  );
}
