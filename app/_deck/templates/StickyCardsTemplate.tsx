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
  /** Optional small eyebrow line above the heading. */
  eyebrow?: ReactNode;
  /** Optional h1 heading rendered above the cards. */
  title?: ReactNode;
  /** When true, cards reveal themselves on a timer once the slide
      is centered in the viewport. Manual key nav still works. */
  autoReveal?: boolean;
  /** Delay between auto-reveal steps in ms. Default 650. */
  autoRevealMs?: number;
  /** Delay before the first card appears in ms. Default 350. */
  autoRevealStartMs?: number;
};

const DEFAULT_TONES: StickyCardTone[] = ["terracotta", "mustard", "mint"];
const PINS = ["📌", "📍", "🖇️"];

export function StickyCardsTemplate({
  blocks,
  pin = true,
  eyebrow,
  title,
  autoReveal = false,
  autoRevealMs = 650,
  autoRevealStartMs = 350,
}: StickyCardsTemplateProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  /* In manual mode, start at step=1 so the first card is already visible
     on slide load. In autoReveal mode, start at 0 so all cards animate in
     on a timer once the slide is centered in the viewport. Subsequent
     arrow presses reveal additional cards in either mode, then fall
     through to the deck's slide nav. */
  const [step, setStep] = useState(autoReveal ? 0 : 1);
  const totalSteps = blocks.length + 1;

  /* Auto-reveal: each time the slide enters the viewport, reset to 0
     and walk `step` up on a timer. Leaving the viewport clears the
     pending timers and resets so the next entry replays the animation. */
  useEffect(() => {
    if (!autoReveal) return;
    const el = containerRef.current;
    if (!el) return;

    let active = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const clear = () => {
      for (const t of timers) clearTimeout(t);
      timers = [];
    };
    const start = () => {
      clear();
      setStep(0);
      const target = blocks.length;
      for (let i = 1; i <= target; i++) {
        timers.push(
          setTimeout(
            () => setStep((s) => (s < i ? i : s)),
            autoRevealStartMs + (i - 1) * autoRevealMs,
          ),
        );
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const visible =
            entry.isIntersecting && entry.intersectionRatio >= 0.5;
          if (visible && !active) {
            active = true;
            start();
          } else if (!visible && active && entry.intersectionRatio < 0.1) {
            active = false;
            clear();
            setStep(0);
          }
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clear();
    };
  }, [autoReveal, autoRevealMs, autoRevealStartMs, blocks.length]);

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
      {(eyebrow || title) && (
        <div className="wipu-tpl-sticky-head">
          {eyebrow && <div className="wipu-tpl-sticky-head-eyebrow">{eyebrow}</div>}
          {title && <h1 className="wipu-tpl-sticky-head-title">{title}</h1>}
        </div>
      )}
      <div
        className="wipu-tpl-sticky-board"
        style={{
          gridTemplateColumns: `repeat(${blocks.length}, minmax(0, 1fr))`,
          maxWidth: `min(${Math.min(blocks.length, 3) * 460 + 120}px, 92vw)`,
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
