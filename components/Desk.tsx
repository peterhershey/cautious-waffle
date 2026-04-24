"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { projects } from "@/lib/projects";
import { beats, PLANE_VH } from "@/lib/scenes";
import { Card } from "./Card";

export function Desk() {
  const reducedMotion = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    function onResize() {
      setVh(window.innerHeight);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0005,
  });

  const planeHeight = (PLANE_VH / 100) * vh;
  const maxShift = Math.max(0, planeHeight - vh);
  const planeY = useTransform(smooth, [0, 1], [0, -maxShift]);

  const [beatIdx, setBeatIdx] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => {
    let nearest = 0;
    let bestDist = Infinity;
    for (let i = 0; i < beats.length; i++) {
      const d = Math.abs(beats[i].at - v);
      if (d < bestDist) {
        bestDist = d;
        nearest = i;
      }
    }
    if (nearest !== beatIdx) setBeatIdx(nearest);
  });

  const beat = beats[beatIdx];

  return (
    <div
      ref={wrapRef}
      style={{ height: `${PLANE_VH}vh` }}
      className="relative bg-black"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        style={{ perspective: 1600 }}
      >
        {/* vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 text-[11px] tracking-[0.22em] uppercase text-neutral-500">
          <span>Peter Hershey</span>
          <span className="opacity-70">Portfolio</span>
        </div>

        {/* scene copy */}
        <div className="absolute bottom-12 left-10 right-10 z-40 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <h1 className="text-4xl md:text-6xl font-light leading-[1.02] text-neutral-100 tracking-tight">
                {beat.title}
              </h1>
              {beat.blurb ? (
                <p className="mt-4 max-w-md text-sm md:text-base font-light text-neutral-400 leading-relaxed">
                  {beat.blurb}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {beatIdx === 0 ? (
          <div className="absolute bottom-7 right-10 z-50 text-[10px] uppercase tracking-[0.3em] text-neutral-600">
            Scroll
          </div>
        ) : null}

        {/* progress rail */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
          {beats.map((b, i) => (
            <span
              key={b.id}
              className="h-4 w-px bg-neutral-700 transition-opacity duration-300"
              style={{ opacity: i === beatIdx ? 1 : 0.3 }}
            />
          ))}
        </div>

        {/* plane — panned by scroll; cards add their own per-card parallax on top */}
        <motion.div
          className="absolute left-0 right-0 top-0"
          style={{
            height: planeHeight,
            y: reducedMotion ? 0 : planeY,
          }}
        >
          {projects.map((p) => (
            <Card
              key={p.slug}
              project={p}
              planeHeight={planeHeight}
              vh={vh}
              progress={smooth}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
