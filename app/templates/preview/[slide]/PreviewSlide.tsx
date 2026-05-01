"use client";

import { BY_SLUG, DARK_SLIDES, SELF_CONTAINED } from "../../slides";

export function PreviewSlide({ slug }: { slug: string }) {
  const Slide = BY_SLUG[slug];
  if (!Slide) return null;

  if (SELF_CONTAINED.has(slug)) {
    return <Slide />;
  }

  return (
    <section
      className="wipu-preview-slide"
      data-theme={DARK_SLIDES.has(slug) ? "dark" : undefined}
    >
      <div className="wipu-sample-inner">
        <Slide />
      </div>
    </section>
  );
}
