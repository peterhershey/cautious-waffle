"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/* ── Cursor tuning ───────────────────────────────────────────────────
   All of these are knobs to dial in feel. Speeds are CSS px / ms.    */
const TRIGGER_SPEED = 0.9;       // below this: no trail, just the dot
const FULL_SPEED = 2.6;          // at/above this: trail at full opacity
const TRAIL_WINDOW_MS = 2400;    // how far back samples are drawn (long ink wake)
const VELOCITY_WINDOW_MS = 60;   // sample window used to compute speed/angle
const ATTACK_MS = 70;            // strength rises this fast (responsive on draw)
const DECAY_MS = 2400;           // strength falls over this duration (slow fade)
const DOT_RADIUS = 6;            // idle dot size
const ARROW_BASE_PX = 18;        // arrowhead leg length when faintly visible
const ARROW_GROW_PX = 10;        // extra leg length at full strength
const ARROW_WING_RAD = 0.55;     // half-angle of arrowhead (~31.5°)
const DASH_PERIOD = 24;          // sum of stroke-dasharray ("10 14") — keep in sync with CSS
const MARCH_RATE = 0.0044;       // px / ms — dash march speed (independent of cursor speed)

type Sample = { x: number; y: number; t: number };

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

let viewportSnapshot: { w: number; h: number } | null = null;
function getViewport(): { w: number; h: number } {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!viewportSnapshot || viewportSnapshot.w !== w || viewportSnapshot.h !== h) {
    viewportSnapshot = { w, h };
  }
  return viewportSnapshot;
}
function getServerViewport(): { w: number; h: number } | null {
  return null;
}

export function VelocityCursor() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const headRef = useRef<SVGPathElement | null>(null);
  const vp = useSyncExternalStore(subscribeResize, getViewport, getServerViewport);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const buffer: Sample[] = [];
    let lastFrame = performance.now();
    let strength = 0;
    let lastAngle = 0;
    let visible = false;
    /* Dash anchoring: dashoffset is measured from the path's start. As old
       samples age out of the buffer, the path's start shifts forward by the
       arc length removed — which would drag the dash pattern with it,
       coupling the apparent march rate to cursor velocity. We accumulate
       the length pruned from the front and add it to the dashoffset to
       cancel that drift, so the only motion left is the constant march. */
    let lengthPrunedFromFront = 0;
    let marchProgress = 0;

    const onMove = (e: MouseEvent) => {
      buffer.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!visible && svgRef.current) {
        svgRef.current.style.opacity = "1";
        visible = true;
      }
    };
    const onLeave = () => {
      if (svgRef.current) svgRef.current.style.opacity = "0";
      visible = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = now - lastFrame;
      lastFrame = now;

      // Drop samples older than the trail window. For each removed sample,
      // accumulate the arc length of the segment it anchored so we can
      // cancel the dash-pattern drift that would otherwise occur.
      while (buffer.length && now - buffer[0].t > TRAIL_WINDOW_MS + 80) {
        if (buffer.length >= 2) {
          const a = buffer[0];
          const b = buffer[1];
          lengthPrunedFromFront += Math.hypot(b.x - a.x, b.y - a.y);
        }
        buffer.shift();
      }
      marchProgress += MARCH_RATE * dt;

      const last = buffer[buffer.length - 1];
      const dot = dotRef.current;
      const line = lineRef.current;
      const head = headRef.current;
      if (!last || !dot || !line || !head) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Speed + direction from samples in the velocity window
      let speed = 0;
      let vx = 0;
      let vy = 0;
      const cutoff = now - VELOCITY_WINDOW_MS;
      let i = buffer.length - 1;
      while (i > 0 && buffer[i - 1].t > cutoff) i--;
      if (i < buffer.length - 1) {
        const a = buffer[i];
        const b = buffer[buffer.length - 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dur = Math.max(1, b.t - a.t);
        speed = Math.sqrt(dx * dx + dy * dy) / dur;
        vx = dx / dur;
        vy = dy / dur;
      }
      if (speed > 0.05) lastAngle = Math.atan2(vy, vx);

      // Strength target — fast attack, slow decay
      const target = Math.max(
        0,
        Math.min(1, (speed - TRIGGER_SPEED) / (FULL_SPEED - TRIGGER_SPEED)),
      );
      const tau = target > strength ? ATTACK_MS : DECAY_MS;
      const k = 1 - Math.exp(-dt / tau);
      strength += (target - strength) * k;
      if (strength < 0.001) strength = 0;

      // Dot follows the cursor at all times
      dot.setAttribute("cx", last.x.toFixed(1));
      dot.setAttribute("cy", last.y.toFixed(1));

      // Trail polyline = samples within the trail window
      const startT = now - TRAIL_WINDOW_MS;
      let firstIdx = 0;
      while (firstIdx < buffer.length && buffer[firstIdx].t < startT) firstIdx++;
      const pts = buffer.length - firstIdx;

      if (strength > 0.02 && pts >= 2) {
        let d = `M${buffer[firstIdx].x.toFixed(1)} ${buffer[firstIdx].y.toFixed(1)}`;
        for (let j = firstIdx + 1; j < buffer.length; j++) {
          d += ` L${buffer[j].x.toFixed(1)} ${buffer[j].y.toFixed(1)}`;
        }
        line.setAttribute("d", d);
        line.style.opacity = strength.toFixed(3);
        const offset = -((lengthPrunedFromFront + marchProgress) % DASH_PERIOD);
        line.style.strokeDashoffset = offset.toFixed(2);

        const size = ARROW_BASE_PX + strength * ARROW_GROW_PX;
        const x1 = last.x - Math.cos(lastAngle - ARROW_WING_RAD) * size;
        const y1 = last.y - Math.sin(lastAngle - ARROW_WING_RAD) * size;
        const x2 = last.x - Math.cos(lastAngle + ARROW_WING_RAD) * size;
        const y2 = last.y - Math.sin(lastAngle + ARROW_WING_RAD) * size;
        head.setAttribute(
          "d",
          `M${x1.toFixed(1)} ${y1.toFixed(1)} L${last.x.toFixed(1)} ${last.y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`,
        );
        head.style.opacity = strength.toFixed(3);
        dot.style.opacity = Math.max(0, 1 - strength * 1.4).toFixed(3);
      } else {
        line.setAttribute("d", "");
        head.setAttribute("d", "");
        line.style.opacity = "0";
        head.style.opacity = "0";
        dot.style.opacity = "1";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!vp) return null;

  return (
    <svg
      ref={svgRef}
      className="field-notes-cursor"
      viewBox={`0 0 ${vp.w} ${vp.h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path ref={lineRef} className="field-notes-cursor-line" />
      <path ref={headRef} className="field-notes-cursor-head" />
      <circle ref={dotRef} cx="-100" cy="-100" r={DOT_RADIUS} className="field-notes-cursor-dot" />
    </svg>
  );
}
