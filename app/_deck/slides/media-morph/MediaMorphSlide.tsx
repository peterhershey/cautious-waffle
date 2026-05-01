/* Media-morph slide — text column on one side, two-box morphing
   media mosaic on the other. Boxes flow through 5 layouts and swap
   roles each phase (media↔color tint). Each phase has a long rest
   beat (the photo/video sits still) and a short eased morph beat.

   Position and content opacity are both driven by the same rAF loop
   off an "effective phase" so they stay in lockstep. Reused by the
   image-based templates showcase slide and the video-based AI
   Native slide on the home deck. */

"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { TextImageSlide } from "../text-image/TextImageSlide";

export type MediaMorphMedia =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string };

export type MediaMorphSlideProps = {
  side: "left" | "right";
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Pool to shuffle from. Component picks `pickCount` of these on mount. */
  media: MediaMorphMedia[];
  /** Total time per phase in ms (rest + morph). Default 4200. */
  phaseMs?: number;
  /** How many distinct media items to cycle through. Default 5. */
  pickCount?: number;
};

type MorphRect = { left: number; top: number; width: number; height: number };

const MORPH_LAYOUTS: [MorphRect, MorphRect][] = [
  [
    { left: 0, top: 0, width: 62, height: 100 },
    { left: 66, top: 0, width: 34, height: 44 },
  ],
  [
    { left: 38, top: 0, width: 62, height: 100 },
    { left: 0, top: 0, width: 34, height: 56 },
  ],
  [
    { left: 0, top: 0, width: 100, height: 60 },
    { left: 0, top: 64, width: 44, height: 36 },
  ],
  [
    { left: 0, top: 0, width: 66, height: 66 },
    { left: 70, top: 70, width: 30, height: 30 },
  ],
  [
    { left: 0, top: 28, width: 64, height: 72 },
    { left: 50, top: 0, width: 50, height: 22 },
  ],
];
const MORPH_TONES = ["rose", "terracotta", "mustard", "mint", "navy"] as const;
const MORPH_REST_FRAC = 0.72;
const MORPH_CYCLE = MORPH_LAYOUTS.length * 2;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function rectAt(box: "A" | "B", phase: number): MorphRect {
  const layoutIdx = mod(phase, MORPH_LAYOUTS.length);
  const aIsBig = mod(phase, 2) === 0;
  const slot = (box === "A" ? aIsBig : !aIsBig) ? 0 : 1;
  return MORPH_LAYOUTS[layoutIdx][slot];
}
function contentAt(box: "A" | "B", phase: number, pickCount: number) {
  const isMedia = mod(phase + (box === "A" ? 0 : 1), 2) === 0;
  const idx = mod(phase, pickCount);
  return isMedia
    ? { kind: "media" as const, idx }
    : { kind: "tint" as const, tone: MORPH_TONES[idx % MORPH_TONES.length] };
}
function smoothstep(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}
function makeCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (u: number) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let t = u;
    for (let i = 0; i < 8; i++) {
      const dx = sampleDerivX(t);
      if (Math.abs(dx) < 1e-6) break;
      t -= (sampleX(t) - u) / dx;
    }
    return sampleY(t);
  };
}
const morphEase = makeCubicBezier(0.22, 0.8, 0.2, 1);

export function MediaMorphSlide({
  side,
  eyebrow,
  title,
  subtitle,
  media,
  phaseMs = 4200,
  pickCount = 5,
}: MediaMorphSlideProps) {
  /* Initial picks render deterministically (first N) so SSR matches first
     client paint; the post-mount effect shuffles. */
  const initialPicks = useMemo(
    () => media.slice(0, pickCount),
    [media, pickCount],
  );
  const [picked, setPicked] = useState<MediaMorphMedia[]>(initialPicks);

  const refA = useRef<HTMLDivElement | null>(null);
  const refB = useRef<HTMLDivElement | null>(null);
  const layersA = useRef<(HTMLDivElement | null)[]>([]);
  const layersB = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (media.length < pickCount) return;
    const shuffled = [...media]
      .sort(() => Math.random() - 0.5)
      .slice(0, pickCount);
    setPicked(shuffled);
  }, [media, pickCount]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyRect = (el: HTMLDivElement | null, r: MorphRect) => {
      if (!el) return;
      el.style.left = `${r.left}%`;
      el.style.top = `${r.top}%`;
      el.style.width = `${r.width}%`;
      el.style.height = `${r.height}%`;
    };

    if (reduce) {
      applyRect(refA.current, rectAt("A", 0));
      applyRect(refB.current, rectAt("B", 0));
      layersA.current.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? "1" : "0";
      });
      layersB.current.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? "1" : "0";
      });
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / phaseMs;
      const phaseIdx = Math.floor(elapsed);
      const localT = elapsed - phaseIdx;

      const morphT =
        localT < MORPH_REST_FRAC
          ? 0
          : morphEase((localT - MORPH_REST_FRAC) / (1 - MORPH_REST_FRAC));

      const interp = (box: "A" | "B"): MorphRect => {
        const from = rectAt(box, phaseIdx);
        const to = rectAt(box, phaseIdx + 1);
        return {
          left: from.left + (to.left - from.left) * morphT,
          top: from.top + (to.top - from.top) * morphT,
          width: from.width + (to.width - from.width) * morphT,
          height: from.height + (to.height - from.height) * morphT,
        };
      };
      applyRect(refA.current, interp("A"));
      applyRect(refB.current, interp("B"));

      const effectivePhase = phaseIdx + morphT;
      const updateLayers = (refs: (HTMLDivElement | null)[]) => {
        for (let i = 0; i < MORPH_CYCLE; i++) {
          const el = refs[i];
          if (!el) continue;
          const tInCycle = mod(effectivePhase - i, MORPH_CYCLE);
          const dist = Math.min(tInCycle, MORPH_CYCLE - tInCycle);
          el.style.opacity = dist >= 1 ? "0" : String(smoothstep(1 - dist));
        }
      };
      updateLayers(layersA.current);
      updateLayers(layersB.current);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phaseMs]);

  const renderLayer = (
    box: "A" | "B",
    i: number,
    refs: (HTMLDivElement | null)[],
  ) => {
    const c = contentAt(box, i, pickCount);
    const setRef = (el: HTMLDivElement | null) => {
      refs[i] = el;
    };
    if (c.kind === "media") {
      const item = picked[c.idx];
      if (!item) {
        return <div key={i} ref={setRef} className="wipu-morph-fill" />;
      }
      if (item.kind === "video") {
        return (
          <div key={i} ref={setRef} className="wipu-morph-fill">
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
          </div>
        );
      }
      return (
        <div key={i} ref={setRef} className="wipu-morph-fill">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" loading="lazy" draggable={false} />
        </div>
      );
    }
    return (
      <div
        key={i}
        ref={setRef}
        className="wipu-morph-fill"
        style={{ backgroundColor: `var(--wipu-${c.tone})` }}
      />
    );
  };

  return (
    <TextImageSlide
      side={side}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
    >
      <div className="wipu-morph">
        <div ref={refA} className="wipu-morph-box" aria-hidden>
          {Array.from({ length: MORPH_CYCLE }, (_, i) =>
            renderLayer("A", i, layersA.current),
          )}
        </div>
        <div ref={refB} className="wipu-morph-box" aria-hidden>
          {Array.from({ length: MORPH_CYCLE }, (_, i) =>
            renderLayer("B", i, layersB.current),
          )}
        </div>
      </div>
    </TextImageSlide>
  );
}
