"use client";

import Link from "next/link";
import { TEMPLATES } from "../meta";
import { BY_SLUG, DARK_SLIDES, SELF_CONTAINED } from "../slides";

export function SampleDeck() {
  return (
    <div className="wipu-sample-root">
      {TEMPLATES.map((t) => {
        const Slide = BY_SLUG[t.slug];
        if (!Slide) return null;

        if (SELF_CONTAINED.has(t.slug)) {
          return <Slide key={t.slug} />;
        }

        return (
          <section
            key={t.slug}
            id={`slide-${t.slug}`}
            className="wipu-sample-slide"
            data-theme={DARK_SLIDES.has(t.slug) ? "dark" : undefined}
          >
            <div className="wipu-sample-slide-label">
              <strong>{t.slug}</strong> {t.name}
            </div>
            <div className="wipu-sample-inner">
              <Slide />
            </div>
          </section>
        );
      })}

      <Link href="/templates" className="wipu-sample-back">
        ← Back to templates catalog
      </Link>
    </div>
  );
}
