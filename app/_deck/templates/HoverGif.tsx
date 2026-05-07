"use client";

import { useEffect, useRef, useState } from "react";

export type HoverGifProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function HoverGif({ src, alt = "", className }: HoverGifProps) {
  const [hovered, setHovered] = useState(false);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled.current) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        setFrameUrl(canvas.toDataURL("image/png"));
      } catch {
        /* tainted canvas — fall through to live src */
      }
    };
    img.src = src;
    return () => {
      cancelled.current = true;
    };
  }, [src]);

  return (
    <span
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-block",
        lineHeight: 0,
        padding: "0.4em",
        margin: "-0.4em",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hovered || !frameUrl ? src : frameUrl}
        alt={alt}
        draggable={false}
        style={{ height: "1em", width: "auto", display: "block" }}
      />
    </span>
  );
}
