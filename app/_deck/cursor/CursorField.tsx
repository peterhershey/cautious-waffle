"use client";

import { useEffect, useRef } from "react";
import { isCoarsePointer } from "../scroll/touchDetect";

/* ------------------------------------------------------------------ *
 * Cursor field — a wake through water.
 *
 * An ambient, motion-driven layer that lives BEHIND the slide content. At rest
 * it is invisible. As the pointer moves it disturbs a grid of points, each of
 * which gains energy from the speed and nearness of the pass and stores the
 * flow direction — leaving glowing streaks along the path. Stop moving and the
 * energy slowly decays, so the wake settles and fades like water going still.
 *
 * Feel values below were dialed in via a live tuning panel. The lit tone steps
 * through the deck's brand palette on the blink-caret cadence
 * (templates.css → wipu-tpl-emojihead-cursor-cycle).
 * ------------------------------------------------------------------ */

// Brand palette, in the same cycle order as the deck blink caret.
const COLORS = [
  "#e07a52", // terracotta
  "#f2d06a", // mustard
  "#8ce0a8", // mint
  "#a3636b", // rose
  "#2640e2", // navy
];
const COLOR_STEP_MS = 1200; // hold each tone ~1.2s, snapping (matches caret)

const GRID_SPACING = 48; // px between field points
const INFLUENCE = 370; // px, brush size — radius the pointer disturbs per frame
const SPEED_REF = 16; // px/frame of movement that deposits full energy
const MOVE_MIN = 0.6; // px/frame below which nothing is disturbed (resting)
const DEPOSIT = 0.9; // how fast energy builds while moving through
const DECAY = 0.915; // per-frame energy falloff — the "slow fade"
const STREAK_LEN = 12; // px, streak length at full energy
const OPACITY = 0.4; // overall opacity multiplier (subtle)
const GLOW = 4; // shadow-blur glow amount

type Pt = { x: number; y: number; e: number; dx: number; dy: number };

export function CursorField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Decorative + animated: skip on touch and when reduced motion is preferred.
    if (
      isCoarsePointer() ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points: Pt[] = [];
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      points = [];
      for (let gx = GRID_SPACING / 2; gx < window.innerWidth; gx += GRID_SPACING) {
        for (let gy = GRID_SPACING / 2; gy < window.innerHeight; gy += GRID_SPACING) {
          points.push({ x: gx, y: gy, e: 0, dx: 0, dy: 0 });
        }
      }
    };
    build();

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let pmx = mx;
    let pmy = my;
    let visible = false;
    let colorIdx = 0;
    let lastColor = performance.now();

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      visible = true;
    };
    const onLeave = () => {
      visible = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("resize", build);

    const inf2 = INFLUENCE * INFLUENCE;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      if (now - lastColor >= COLOR_STEP_MS) {
        lastColor = now;
        colorIdx = (colorIdx + 1) % COLORS.length;
      }
      const color = COLORS[colorIdx];

      // Pointer motion this frame (px/frame) → drives how much energy is deposited.
      const cvx = mx - pmx;
      const cvy = my - pmy;
      pmx = mx;
      pmy = my;
      const spd = Math.hypot(cvx, cvy);
      const moving = visible && spd > MOVE_MIN;
      const ndx = spd > 0.001 ? cvx / spd : 0;
      const ndy = spd > 0.001 ? cvy / spd : 0;
      const speedAmt = Math.min(1, spd / SPEED_REF);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Slow settle: energy always bleeds away.
        p.e *= DECAY;

        // Deposit energy where the moving pointer passes near.
        if (moving) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < inf2) {
            const prox = 1 - Math.sqrt(d2) / INFLUENCE;
            const dep = prox * speedAmt * DEPOSIT;
            if (dep > 0.001) {
              p.e = Math.min(1, p.e + dep);
              // Steer the streak toward the current flow, weighted by deposit.
              const w = Math.min(1, dep * 2.2);
              p.dx += (ndx - p.dx) * w;
              p.dy += (ndy - p.dy) * w;
            }
          }
        }

        if (p.e <= 0.01) continue; // invisible at rest

        const e = p.e;
        let ux = p.dx;
        let uy = p.dy;
        const m = Math.hypot(ux, uy) || 1;
        ux /= m;
        uy /= m;
        const len = 2 + e * e * STREAK_LEN;

        ctx.strokeStyle = color;
        ctx.globalAlpha = Math.min(1, e * OPACITY);
        ctx.lineWidth = 1.2 + e * 1.8;
        ctx.shadowColor = color;
        ctx.shadowBlur = e * GLOW;
        ctx.beginPath();
        ctx.moveTo((p.x - ux * len * 0.3) * dpr, (p.y - uy * len * 0.3) * dpr);
        ctx.lineTo((p.x + ux * len) * dpr, (p.y + uy * len) * dpr);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastColor = performance.now();
        pmx = mx;
        pmy = my;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", build);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="cursor-field-canvas" aria-hidden="true" />
  );
}
