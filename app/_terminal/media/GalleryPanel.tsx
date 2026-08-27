"use client";

import type { MediaWindow } from "./types";

type Props = {
  gallery: MediaWindow;
  index: number;
  /** Show paging dots beneath the caption (used in the sticky stage). */
  showDots?: boolean;
};

/** The right column of a gallery slide: a framed box that fills the stage. The
 *  image is centered and contained; the per-frame TEXT lives in the left column
 *  (no duplication here). The only chrome is a terminal-style position readout:
 *  an ASCII dot counter + an n/total count. */
export function GalleryPanel({ gallery, index, showDots }: Props) {
  const item = gallery.items[index];
  const total = gallery.items.length;
  return (
    <aside className="term-aside term-gallery">
      <div className="term-gallery-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={item.alt} draggable={false} />
      </div>
      {showDots && total > 1 ? (
        <div className="term-gallery-cap">
          <span className="term-gallery-track" aria-hidden="true">
            <span className="term-faint">[</span>
            {gallery.items.map((it, i) => (
              <span
                key={it.name}
                className={i === index ? "term-accent" : "term-faint"}
              >
                {i === index ? "●" : "·"}
              </span>
            ))}
            <span className="term-faint">]</span>
          </span>
          <span className="term-gallery-num term-dim">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </aside>
  );
}
