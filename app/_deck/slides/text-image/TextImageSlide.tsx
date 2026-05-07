"use client";

import type { ReactNode } from "react";

type Props = {
  side: "left" | "right";
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  footer?: ReactNode; // optional secondary content under the subtitle
  children: ReactNode; // the image cluster
};

export function TextImageSlide({ side, eyebrow, title, subtitle, footer, children }: Props) {
  return (
    <div className="wipu-ti" data-side={side}>
      <div className="wipu-ti-text">
        <div className="wipu-ti-eyebrow">{eyebrow}</div>
        <h2 className="wipu-ti-title">{title}</h2>
        {subtitle && <p className="wipu-ti-subtitle">{subtitle}</p>}
        {footer}
      </div>
      {children}
    </div>
  );
}

export function Placeholder({ className }: { className?: string }) {
  return <div className={`wipu-placeholder ${className ?? ""}`} aria-hidden />;
}

export function TileColor({
  tone,
}: {
  tone: "terracotta" | "mint" | "mustard" | "rose" | "navy";
}) {
  return <div className={`wipu-placeholder wipu-placeholder--tone-${tone}`} aria-hidden />;
}

export function TileImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="wipu-placeholder wipu-placeholder--image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" draggable={false} />
    </div>
  );
}
