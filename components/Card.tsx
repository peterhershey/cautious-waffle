"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { useRef, useState } from "react";
import type { ProjectEntry } from "@/lib/projects";
import { useDominantColor } from "@/lib/useDominantColor";

type Props = {
  project: ProjectEntry;
  planeHeight: number;
  vh: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
};

export function Card({ project, planeHeight, vh, progress, reducedMotion }: Props) {
  const router = useRouter();
  const [dragged, setDragged] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = useDominantColor(project.image);

  const { placement } = project;

  const baseW = 320 * placement.scale;
  const baseH = (baseW / project.width) * project.height;

  // Parallax drift + rotation drift across scroll.
  const driftPx = useTransform(
    progress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, placement.drift * vh]
  );
  const rotate = useTransform(
    progress,
    [0, 1],
    reducedMotion
      ? [placement.rotate, placement.rotate]
      : [placement.rotate, placement.rotate + placement.rotateDrift]
  );

  // Hover tilt.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 18,
  });
  const lift = useMotionValue(0);
  const glowOpacity = useSpring(lift, { stiffness: 80, damping: 18 });
  const shadow = useTransform(
    lift,
    [0, 1],
    [
      "0 10px 28px rgba(0,0,0,0.55), 0 1px 2px rgba(0,0,0,0.5)",
      "0 36px 70px rgba(0,0,0,0.75), 0 4px 12px rgba(0,0,0,0.6)",
    ]
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    lift.set(0);
  }

  function handleTap() {
    if (dragged) return;
    router.push(`/projects/${project.slug}`);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (Math.hypot(info.offset.x, info.offset.y) < 4) {
      setDragged(false);
    }
  }

  const topBase = (placement.y / 100) * planeHeight - baseH / 2;
  const GLOW_SIZE = 1100;

  return (
    <motion.div
      ref={ref}
      layoutId={`card-${project.slug}`}
      drag
      dragMomentum={false}
      onDragStart={() => setDragged(true)}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => lift.set(1)}
      onMouseLeave={handleMouseLeave}
      initial={false}
      style={{
        position: "absolute",
        width: baseW,
        height: baseH,
        left: `calc(${placement.x}% - ${baseW / 2}px)`,
        top: topBase,
        y: dragged ? 0 : driftPx,
        rotate: dragged ? placement.rotate : rotate,
        zIndex: placement.z,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        cursor: "grab",
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ cursor: "grabbing" }}
      aria-label={`Open project ${project.title}`}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/projects/${project.slug}`);
        }
      }}
    >
      {/* the glow — lives alongside the card, rides the same transform */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: baseW / 2 - GLOW_SIZE / 2,
          top: baseH / 2 - GLOW_SIZE / 2,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          opacity: glowOpacity,
          background: `radial-gradient(circle, ${color} 0%, ${color} 18%, rgba(0,0,0,0) 62%)`,
          filter: "blur(110px)",
          mixBlendMode: "screen",
          willChange: "opacity",
          zIndex: -1,
        }}
      />

      {/* the card surface — clipped */}
      <motion.div
        className="absolute inset-0"
        style={{
          borderRadius: 2,
          overflow: "hidden",
          background: "#0a0a0a",
          boxShadow: shadow,
        }}
      >
        <Image
          src={project.image}
          alt={project.title}
          width={project.width}
          height={project.height}
          draggable={false}
          priority
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            filter: "grayscale(0.2) contrast(1.02)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
