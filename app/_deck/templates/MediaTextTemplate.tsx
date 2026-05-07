/* Template — Media + text split.
   Half-width media on one side, eyebrow + title + body on the other.
   `mediaSide` flips the layout. Pass an array for `media` to cycle
   through several images with a crossfade (used on the competitive-
   landscape slide). Wraps to single column on narrow viewports. */

"use client";

import { useEffect, useState, type ReactNode } from "react";

export type MediaTextMedia =
  | { kind?: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | {
      kind: "video";
      src: string;
      alt: string;
      poster?: string;
      fit?: "cover" | "contain";
    };

export type MediaTextTemplateProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body: ReactNode;
  media: MediaTextMedia | MediaTextMedia[];
  mediaSide?: "left" | "right";
  /** Per-slide dwell time for slideshow media, in ms. Default 3200. */
  slideshowMs?: number;
};

export function MediaTextTemplate({
  eyebrow,
  title,
  body,
  media,
  mediaSide = "left",
  slideshowMs = 3200,
}: MediaTextTemplateProps) {
  return (
    <div className="wipu-tpl-mediatext" data-media-side={mediaSide}>
      <div className="wipu-tpl-mediatext-media">
        <MediaSlot media={media} dwellMs={slideshowMs} />
      </div>
      <div className="wipu-tpl-mediatext-text">
        {eyebrow && (
          <div className="wipu-tpl-mediatext-eyebrow">{eyebrow}</div>
        )}
        <h2 className="wipu-tpl-mediatext-title">{title}</h2>
        <div className="wipu-tpl-mediatext-body">{body}</div>
      </div>
    </div>
  );
}

export function MediaSlot({
  media,
  dwellMs = 3200,
}: {
  media: MediaTextMedia | MediaTextMedia[];
  dwellMs?: number;
}) {
  const items = Array.isArray(media) ? media : [media];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, dwellMs);
    return () => window.clearInterval(id);
  }, [items.length, dwellMs]);

  if (items.length === 1) {
    const m = items[0];
    const fitStyle =
      m.fit === "contain" ? { objectFit: "contain" as const } : undefined;
    return m.kind === "video" ? (
      <video
        src={m.src}
        poster={m.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={m.alt}
        style={fitStyle}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={m.src} alt={m.alt} loading="lazy" style={fitStyle} />
    );
  }

  return (
    <>
      {items.map((m, i) => {
        const fitStyle =
          m.fit === "contain" ? { objectFit: "contain" as const } : undefined;
        return m.kind === "video" ? (
          <video
            key={m.src}
            className="wipu-tpl-mediatext-slide"
            data-active={i === index}
            src={m.src}
            poster={m.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-label={m.alt}
            aria-hidden={i !== index}
            style={fitStyle}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={m.src}
            className="wipu-tpl-mediatext-slide"
            data-active={i === index}
            src={m.src}
            alt={m.alt}
            loading={i === 0 ? "eager" : "lazy"}
            aria-hidden={i !== index}
            style={fitStyle}
          />
        );
      })}
    </>
  );
}
