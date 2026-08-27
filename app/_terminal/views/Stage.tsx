"use client";

import type { Beat } from "../beat-machine";
import { beatLayout, beatMedia } from "../beat-machine";
import { GalleryPanel } from "../media/GalleryPanel";

type StageProps = {
  beat: Beat;
  /** Current carousel frame, or null when the slideshow isn't running. */
  gallerySlide: number | null;
};

/** The media that rides in the sticky stage beside the text column. Returns
 *  null when the active beat is full-width (the shell then collapses the
 *  stage). Pure content — the shell owns the open/close motion. */
export function Stage({ beat, gallerySlide }: StageProps) {
  const layout = beatLayout(beat);
  const media = beatMedia(beat);
  if (!media) return null;

  if (layout === "sxs-image" && media.kind === "image") {
    return (
      <div className="term-aside term-stage-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media.src} alt={media.alt} draggable={false} />
      </div>
    );
  }

  if (layout === "sxs-carousel" && media.kind === "carousel") {
    return (
      <GalleryPanel gallery={media.window} index={gallerySlide ?? 0} showDots />
    );
  }

  return null;
}
