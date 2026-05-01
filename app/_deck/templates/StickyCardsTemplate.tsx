/* Template — Sticky Cards (progressive text-only three-up).
   Text-only variant of the three-up. Each card reveals one at a time
   on arrow-key advance — keyboard handler runs at capture phase and
   stops propagation until all cards are revealed, then falls through
   to the deck's slide nav. Cards are tinted, slightly rotated, and
   staggered diagonally for a hand-pinned corkboard feel.

   Good for any beat that lists 2–3 short ideas you want the audience
   to absorb one by one — reflections, principles, constraints,
   takeaways. */

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type StickyCardTone =
  | "terracotta"
  | "mint"
  | "mustard"
  | "rose"
  | "navy";

export type StickyCardBlock = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Card tint. Defaults cycle through terracotta → mustard → mint. */
  tone?: StickyCardTone;
  /** When set, the entire card becomes a Link to this href. */
  href?: string;
};

export type StickyCardsTemplateProps = {
  blocks: StickyCardBlock[];
  /** Show a pin glyph on each card. Default true. */
  pin?: boolean;
};

const DEFAULT_TONES: StickyCardTone[] = ["terracotta", "mustard", "mint"];
const PINS = ["📌", "📍", "🖇️"];

export function StickyCardsTemplate({
  blocks,
  pin = true,
}: StickyCardsTemplateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const totalSteps = blocks.length + 1;

  /* Capture-phase keyboard nav — consume arrow keys to reveal cards
     one-by-one before the deck's slide handler advances to the next
     slide. Mirrors the GoalTemplate pattern. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isActive = rect.top <= vh / 2 && rect.bottom >= vh / 2;
      if (!isActive) return;

      const dir =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
          ? 1
          : e.key === "ArrowUp" ||
              e.key === "ArrowLeft" ||
              e.key === "PageUp" ||
              (e.key === " " && e.shiftKey)
            ? -1
            : 0;
      if (dir === 0) return;

      if (dir === 1 && step < totalSteps - 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStep(step + 1);
      } else if (dir === -1 && step > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setStep(step - 1);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [step, totalSteps]);

  return (
    <div ref={containerRef} className="wipu-tpl-sticky" data-step={step}>
      <div
        className="wipu-tpl-sticky-board"
        style={{
          gridTemplateColumns: `repeat(${blocks.length}, minmax(0, 1fr))`,
          maxWidth: `min(${Math.min(blocks.length, 3) * 380 + 120}px, 92vw)`,
        }}
      >
        {blocks.map((b, i) => {
          const tone = b.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length];
          const revealed = step > i;
          const sharedProps = {
            className: "wipu-tpl-sticky-card",
            "data-tone": tone,
            "data-revealed": revealed,
            "data-card-idx": i,
          };
          const inner = (
            <>
              {pin && (
                <span className="wipu-tpl-sticky-pin" aria-hidden>
                  {PINS[i % PINS.length]}
                </span>
              )}
              {b.eyebrow && (
                <div className="wipu-tpl-sticky-eyebrow">{b.eyebrow}</div>
              )}
              <h3 className="wipu-tpl-sticky-title">{b.title}</h3>
              {b.body && <p className="wipu-tpl-sticky-body">{b.body}</p>}
            </>
          );
          if (b.href) {
            return (
              <Link key={i} href={b.href} {...sharedProps} data-link="true">
                {inner}
              </Link>
            );
          }
          return (
            <div key={i} {...sharedProps}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
