"use client";

import { useState, type ReactNode } from "react";

export type MultimodalCase = {
  tone: "terracotta" | "mint" | "mustard" | "rose" | "navy";
  emoji: string;
  category: ReactNode;
  query: ReactNode;
  reply: ReactNode;
};

export type MultimodalCarouselProps = {
  cases: MultimodalCase[];
};

/* Click-to-advance horizontal carousel. The active card sits centered;
   prev sits left, next sits right, both blurred and scaled down — same
   depth-of-field treatment as the Veo hero. The whole stage is the
   click target (no buttons, no dots). */
export function MultimodalCarousel({ cases }: MultimodalCarouselProps) {
  const [active, setActive] = useState(0);
  const n = cases.length;
  const advance = () => setActive((i) => (i + 1) % n);

  return (
    <div
      className="wpd-multimodal-uc-stage"
      role="button"
      tabIndex={0}
      aria-label={`Use case ${active + 1} of ${n}. Click to advance.`}
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance();
        }
      }}
    >
      {cases.map((c, i) => {
        const offset = (i - active + n) % n;
        const position =
          offset === 0 ? "active" : offset === 1 ? "next" : "prev";
        return (
          <div
            key={i}
            className="wpd-multimodal-uc-card"
            data-tone={c.tone}
            data-position={position}
            aria-hidden={position !== "active"}
          >
            <div className="wpd-multimodal-uc-head">
              <span className="wpd-multimodal-uc-emoji" aria-hidden>
                {c.emoji}
              </span>
              <h3 className="wpd-multimodal-uc-cat">{c.category}</h3>
            </div>
            <div className="wpd-multimodal-uc-thread">
              <div className="wpd-multimodal-uc-bubble is-user">{c.query}</div>
              <span className="wpd-multimodal-uc-ai-label">Gemini</span>
              <div className="wpd-multimodal-uc-bubble is-ai">{c.reply}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
