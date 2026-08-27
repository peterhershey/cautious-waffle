"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** YouTube embed id. */
  id: string;
  /** Player params (e.g. "start=127&rel=0"). */
  params?: string;
  /** Faux file header label, e.g. "early-computing.mov". */
  name: string;
  active: boolean;
  onDone?: () => void;
};

const OPEN_MS = 360;

/** A video rendered inline as command output — framed like the image preview,
 *  with a ▶ header and a full-quality YouTube iframe (click to play). Not the
 *  low-fi in-terminal video the spec rules out; this is a real embed. */
export function VideoCard({ id, params, name, active, onDone }: Props) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

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
    const t = window.setTimeout(() => onDoneRef.current?.(), OPEN_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  const src = `https://www.youtube.com/embed/${id}${params ? `?${params}` : ""}`;

  return (
    <figure className="term-video">
      <figcaption className="term-preview-head term-faint">
        <span className="term-accent">▶</span> play: {name}
      </figcaption>
      <div className="term-video-frame">
        <iframe
          className="term-video-iframe"
          src={src}
          title={name}
          loading="lazy"
          allow="autoplay; accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </figure>
  );
}
