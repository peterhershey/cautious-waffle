/* Movie-embed slide — 16:9 framed media with an ambient glow behind it.
   Same visual treatment as the YouTube embed in the templates sample,
   but rendered with an <img> so it works for GIFs (or any still). The
   glow is the same image scaled past the frame and heavily blurred. */

"use client";

import type { ReactNode } from "react";

export type MovieEmbedSlideProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
};

export function MovieEmbedSlide({ src, alt, caption }: MovieEmbedSlideProps) {
  return (
    <figure className="wipu-movie-embed">
      <div className="wipu-movie-embed-stage">
        <div
          className="wipu-movie-embed-glow"
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden
        />
        <div className="wipu-movie-embed-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" draggable={false} />
        </div>
      </div>
      {caption && (
        <figcaption className="wipu-movie-embed-title">{caption}</figcaption>
      )}
    </figure>
  );
}
