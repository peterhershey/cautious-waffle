"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { IntroTemplate } from "../../../_deck/templates/IntroTemplate";
import { StrokeHeroMetric } from "../../../_deck/templates/StrokeHeroMetric";

/* ────────────────────────────────────────────────────────────
   Shared tile-field decoration. Same 10 slots (positions, parallax
   strength, drift path, focus variant, rotation, duration) — only
   the image-to-slot mapping is rotated by `offset` so two instances
   feel like the same template with a different focal pick.
   ──────────────────────────────────────────────────────────── */

type Slot = {
  pos: string;
  blur: number;
  /** Parallax magnitude on each axis (px). Larger = closer to viewer. */
  px: number;
  py: number;
  /** Per-tile mouse-follow lerp factor (0–1). Higher = snaps faster. */
  lerp: number;
  rot: number;
  /** Drift cycle duration (s). Distant tiles drift slower. */
  dur: number;
  drift: "a" | "b" | "c" | "d";
  focus: "near" | "far";
};

const SLOTS: Slot[] = [
  // Sharp foreground — closer to lens, large parallax, faster mouse-follow.
  { pos: "tl", blur: 0,  px: 58, py: 22, lerp: 0.18, rot: -1.2, dur: 7.5,  drift: "a", focus: "near" },
  { pos: "tr", blur: 0,  px: 24, py: 52, lerp: 0.10, rot: 0.8,  dur: 9.0,  drift: "b", focus: "near" },
  { pos: "bl", blur: 0,  px: 46, py: 36, lerp: 0.14, rot: 1.0,  dur: 8.0,  drift: "c", focus: "near" },
  { pos: "br", blur: 0,  px: 32, py: 60, lerp: 0.22, rot: -0.6, dur: 10.5, drift: "d", focus: "near" },
  // Blurred background — further back, smaller parallax, more lag.
  { pos: "blur-tl", blur: 18, px: 26, py: 12, lerp: 0.06, rot: -1.4, dur: 13.0, drift: "b", focus: "far" },
  { pos: "blur-tr", blur: 22, px: 12, py: 30, lerp: 0.12, rot: 1.2,  dur: 14.5, drift: "c", focus: "far" },
  { pos: "blur-ml", blur: 16, px: 34, py: 16, lerp: 0.08, rot: 1.5,  dur: 11.5, drift: "a", focus: "far" },
  { pos: "blur-mr", blur: 18, px: 16, py: 26, lerp: 0.14, rot: -1.0, dur: 12.5, drift: "d", focus: "far" },
  { pos: "blur-bl", blur: 20, px: 22, py: 14, lerp: 0.05, rot: 0.4,  dur: 15.5, drift: "a", focus: "far" },
  { pos: "blur-br", blur: 20, px: 10, py: 24, lerp: 0.09, rot: -0.8, dur: 16.0, drift: "d", focus: "far" },
];

const IMAGES = [
  "3M4pecnPCQeDZvf.webp",
  "3VeJSHtsYV3CAcq.webp",
  "4b2FUMAUXP5T9Mw.webp",
  "4DQSz4qVqBoaQAg.webp",
  "4TGtJmmMP9RbtwN.webp",
  "55Kc45KH44oMMCm.webp",
  "6ffSjHDPahNuoi3.webp",
  "8ffbXnuDyHZrZUS.webp",
  "A4BZhVZKzHx2uPv.webp",
  "7kaDt3rWZgSMERJ.webp",
];

const COLORS = [
  "var(--wipu-terracotta)",
  "var(--wipu-mint)",
  "var(--wipu-mustard)",
  "var(--wipu-rose)",
  "var(--wipu-navy)",
  "var(--wipu-terracotta)",
  "var(--wipu-mint)",
  "var(--wipu-rose)",
  "var(--wipu-navy)",
  "var(--wipu-mustard)",
];

const HERO_DIR = "/portfolio%20transfer/veo/hero/";

type VeoTileFieldProps = {
  /** Rotates the image→slot mapping so two instances feel like the same
      collage with a different focal pick. Any integer is valid. */
  offset?: number;
  children: ReactNode;
};

function VeoTileField({ offset = 0, children }: VeoTileFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const hero = ref.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type TileState = {
      tile: HTMLDivElement;
      lerp: number;
      cx: number;
      cy: number;
      /** Lerped scroll-progress per tile. Tiles with smaller lerp rates
          (the distant blurred ones) drag noticeably more than the sharp
          foreground tiles — so the field doesn't settle in lockstep. */
      sy: number;
    };
    const states: TileState[] = SLOTS.map((slot, i) => ({
      tile: tileRefs.current[i],
      lerp: slot.lerp,
      cx: 0,
      cy: 0,
      sy: 0,
    })).filter((s): s is TileState => s.tile !== null);

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left - rect.width / 2) / rect.width;
      targetY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      // Slide-relative scroll progress: -1 when the slide sits a viewport
      // above us, 0 when it's centered, +1 when it sits a viewport below.
      // Clamped slightly past ±1 so tiles don't fly when the slide is
      // far off-screen (we still apply an offset, but bounded).
      const rect = hero.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const slideCenter = rect.top + rect.height / 2;
      const rawSy = (slideCenter - vh / 2) / vh;
      const targetSy = Math.max(-1.2, Math.min(1.2, rawSy));

      for (const s of states) {
        s.cx += (targetX - s.cx) * s.lerp;
        s.cy += (targetY - s.cy) * s.lerp;
        // Same per-tile lerp rate as mouse parallax — lighter tiles
        // (low `lerp`) lag further behind, giving the field its drag.
        s.sy += (targetSy - s.sy) * s.lerp;
        s.tile.style.setProperty("--tile-mx", s.cx.toFixed(3));
        s.tile.style.setProperty("--tile-my", s.cy.toFixed(3));
        s.tile.style.setProperty("--tile-sy", s.sy.toFixed(3));
      }
      rafId = requestAnimationFrame(tick);
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const len = IMAGES.length;
  const norm = ((offset % len) + len) % len;

  return (
    <div ref={ref} className="wipu-veo-hero">
      <div className="wipu-veo-hero-tiles" aria-hidden>
        {SLOTS.map((slot, i) => {
          const idx = (i + norm) % len;
          return (
            <div
              key={slot.pos}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              className={`wipu-veo-tile wipu-veo-tile--${slot.pos} wipu-veo-tile--drift-${slot.drift} wipu-veo-tile--focus-${slot.focus}`}
              style={
                {
                  "--tile-color": COLORS[idx],
                  "--tile-blur": `${slot.blur}px`,
                  "--tile-px": slot.px,
                  "--tile-py": slot.py,
                  "--tile-rot": `${slot.rot}deg`,
                  "--tile-dur": `${slot.dur}s`,
                  "--tile-i": i,
                } as CSSProperties
              }
            >
              <img
                src={`${HERO_DIR}${IMAGES[idx]}`}
                alt=""
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      <div className="wipu-veo-hero-content">{children}</div>
    </div>
  );
}

/* ─────────────── Title-slide variant ─────────────── */
export function VeoHero() {
  return (
    <VeoTileField offset={0}>
      <IntroTemplate
        emoji="🎬"
        greeting={<>CASE STUDY · 2025</>}
        name={<>Everyone&rsquo;s a Director.</>}
        note="Creating the interface for Google's most advanced video generation model."
      />
    </VeoTileField>
  );
}

/* ─────────────── Hero-metric variant ───────────────
   Same tile field with the image-to-slot mapping rotated by 5 — half a
   cycle of the 10-image list, so what was sharp on the title slide is
   blurred here and vice versa. Strongest "same template, refocused"
   effect with a single integer offset. */
export function VeoMetricHero() {
  return (
    <VeoTileField offset={5}>
      <StrokeHeroMetric
        number="1B"
        label={
          <>
            Veo videos
            <br />
            views weekly
          </>
        }
      />
    </VeoTileField>
  );
}
