"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type HudSurfaceProps = {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  /* Render as a different element (e.g., "section") if needed. Defaults to div. */
  as?: "div" | "section" | "header" | "nav" | "aside";
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children" | "style">;

/* Wraps content in a glass HUD surface and tracks the pointer to drive
   --hud-mx / --hud-my / --hud-intensity via rAF + style.setProperty.
   No React re-renders. Respects prefers-reduced-motion and coarse pointers. */
export function HudSurface({
  className,
  children,
  style,
  as = "div",
  ...rest
}: HudSurfaceProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Skip the parallax wiring on devices with no hover pointer — the
       listeners would burn cycles tracking taps that don't drive the
       effect anyway. */
    const noHover = window.matchMedia("(hover: none)").matches;
    if (reduce || noHover) return;

    const target = { mx: 0.5, my: 0.5, intensity: 0 };
    const current = { mx: 0.5, my: 0.5, intensity: 0 };
    let rafId = 0;
    let running = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      current.mx = lerp(current.mx, target.mx, 0.18);
      current.my = lerp(current.my, target.my, 0.18);
      current.intensity = lerp(current.intensity, target.intensity, 0.12);

      el.style.setProperty("--hud-mx", current.mx.toFixed(3));
      el.style.setProperty("--hud-my", current.my.toFixed(3));
      el.style.setProperty("--hud-intensity", current.intensity.toFixed(3));

      const settled =
        Math.abs(current.mx - target.mx) < 0.001 &&
        Math.abs(current.my - target.my) < 0.001 &&
        Math.abs(current.intensity - target.intensity) < 0.002;

      if (settled) {
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.mx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      target.my = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
      target.intensity = 1;
      ensureRunning();
    };

    const onEnter = () => {
      target.intensity = 1;
      ensureRunning();
    };

    const onLeave = () => {
      target.intensity = 0;
      target.mx = 0.5;
      target.my = 0.5;
      ensureRunning();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const Component = as as "div";
  const composedClassName = className ? `hud ${className}` : "hud";

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={composedClassName}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
