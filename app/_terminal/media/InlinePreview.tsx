"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt: string;
  /** Display name shown in the faux file header, e.g. "washington-post.gif". */
  name: string;
  width: number;
  height: number;
  /** When true (active in the reveal sequence) the preview "opens" then calls
   *  onDone so the next output block follows. When false it renders at once. */
  active: boolean;
  onDone?: () => void;
};

const OPEN_MS = 420;

/** A single image rendered inline as command output — a framed block with a
 *  faux file header (à la iTerm2/kitty inline images), full-resolution inside.
 *  Reserved for stills; time-based media opens in a floating window later. */
export function InlinePreview({
  src,
  alt,
  name,
  width,
  height,
  active,
  onDone,
}: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Hold the reveal a beat so it reads as "opening", then release the sequence.
  useEffect(() => {
    if (!active) {
      onDoneRef.current?.();
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDoneRef.current?.();
      return;
    }
    const id = window.setTimeout(() => onDoneRef.current?.(), OPEN_MS);
    return () => window.clearTimeout(id);
  }, [active]);

  return (
    <figure className="term-preview">
      <figcaption className="term-preview-head term-faint">
        <span className="term-accent">▌</span> preview: {name}
        <span className="term-preview-dim">
          {" "}
          · {width}×{height}
        </span>
      </figcaption>
      <img
        className="term-preview-img"
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
