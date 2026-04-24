/* Template 04 — Three-Up.
   Three parallel concepts side-by-side. Each block is a placeholder
   image area on top with text below — no card background, content
   sits directly on the slide.
   Used by:
   - sample presentation slide 04 (ThreeUpSlide) */

import type { ReactNode } from "react";

export type ThreeUpBlock = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Optional real image. If absent, the slot renders as a flat placeholder. */
  image?: { src: string; alt: string };
};

export type ThreeUpTemplateProps = {
  blocks: ThreeUpBlock[];
};

export function ThreeUpTemplate({ blocks }: ThreeUpTemplateProps) {
  return (
    <div className="wipu-tpl-threeup">
      {blocks.map((b, i) => (
        <div key={i} className="wipu-tpl-threeup-block">
          <div className="wipu-tpl-threeup-image">
            {b.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.image.src} alt={b.image.alt} loading="lazy" />
            ) : null}
          </div>
          {b.eyebrow && (
            <div className="wipu-tpl-threeup-eyebrow">{b.eyebrow}</div>
          )}
          <h3 className="wipu-tpl-threeup-title">{b.title}</h3>
          {b.body && <p className="wipu-tpl-threeup-body">{b.body}</p>}
        </div>
      ))}
    </div>
  );
}
