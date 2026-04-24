"use client";

import { BY_SLUG, SELF_CONTAINED } from "../../slides";

export function PreviewSlide({ slug }: { slug: string }) {
  const Slide = BY_SLUG[slug];
  if (!Slide) return null;

  if (SELF_CONTAINED.has(slug)) {
    return <Slide />;
  }

  return (
    <section className="wipu-preview-slide">
      <div className="wipu-sample-inner">
        <Slide />
      </div>
    </section>
  );
}
