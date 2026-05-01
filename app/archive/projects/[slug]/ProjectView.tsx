"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/projects";

export function ProjectView({ project }: { project: Project }) {
  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <header className="flex items-center justify-between px-8 py-6 text-[11px] uppercase tracking-[0.18em] text-neutral-400">
        <Link href="/" className="transition-opacity hover:opacity-70">
          ← Desk
        </Link>
        <span className="opacity-60">{project.year}</span>
      </header>

      <main className="mx-auto max-w-5xl px-8 pb-32">
        <motion.div
          layoutId={`card-${project.slug}`}
          className="relative overflow-hidden rounded-[4px] bg-neutral-900"
          style={{ aspectRatio: `${project.width} / ${project.height}` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </motion.div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              {project.role}
            </div>
            <h1 className="mt-3 text-5xl font-light leading-none">
              <em className="italic-serif">{project.title}</em>
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-800 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p className="text-lg font-light leading-relaxed text-neutral-300">
            {project.summary}
          </p>
        </div>

        <div className="mt-20 text-xs uppercase tracking-[0.2em] text-neutral-600">
          Case study in progress.
        </div>
      </main>
    </div>
  );
}
