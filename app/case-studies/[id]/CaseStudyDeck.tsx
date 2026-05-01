"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  DeckContext,
  type DeckContextSlide,
  type DeckContextValue,
} from "../../_deck/Deck";
import { DeckChrome } from "../../_deck/chrome/DeckChrome";

export type CaseStudySlide = {
  /** Template slug (matches `app/templates/meta.ts`) — used for the corner label only. */
  slug: string;
  /** Display name shown next to the slug in the corner label. */
  name: string;
  /** Slide content as ReactNode (must be serializable across the server/client boundary). */
  content: ReactNode;
  /** Self-contained slides manage their own viewport (no centered inner wrap, no label). */
  selfContained?: boolean;
  /** Force-dark slides redeclare dark tokens regardless of root theme. */
  dark?: boolean;
  /** Hide the SiteFrame chrome while this slide is active. Used by prototype
      slides where the embedded iframe should own the entire viewport. */
  hideChrome?: boolean;
};

export type CaseStudyMeta = {
  title: string;
  /** Path to return to on close. Defaults to "/". */
  backHref?: string;
  backLabel?: string;
};

export type CaseStudyDeckProps = {
  slides: CaseStudySlide[];
  meta: CaseStudyMeta;
};

export type CaseStudyDeckEntry = {
  meta: CaseStudyMeta;
  slides: CaseStudySlide[];
};

/* Selectors that mark a scroll-snap target. Each is one arrow-key step.
   Regular slides contribute one each; the timeline contributes one per
   internal stop. */
const SNAP_SELECTOR = [
  ".wipu-sample-slide",
  ".wipu-sample-tl-snap",
  ".wipu-sample-proto",
].join(", ");

/* Top-level slide marker — one entry per case-study slide regardless of
   how many internal snap targets the slide owns. Drives DeckChrome's
   active-slide detection and goTo(). */
const SLIDE_INDEX_ATTR = "data-cs-slide-index";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* Body-level chrome toggle, driven off the active slide. Slides that
   set `hideChrome: true` (e.g. prototypes) fade the SiteFrame and
   pull the DeckChrome corners off the page so its 64×64 corner-zone
   buttons stop intercepting clicks intended for the embedded iframe. */
function useHideChromeForSlide(hide: boolean) {
  useEffect(() => {
    if (hide) {
      document.body.dataset.hideSiteFrame = "true";
      document.body.dataset.hideDeckChrome = "true";
    } else {
      delete document.body.dataset.hideSiteFrame;
      delete document.body.dataset.hideDeckChrome;
    }
    return () => {
      delete document.body.dataset.hideSiteFrame;
      delete document.body.dataset.hideDeckChrome;
    };
  }, [hide]);
}

function useArrowSnapNav(bumpNavKey: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
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

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(SNAP_SELECTOR),
      );
      if (targets.length === 0) return;
      const positions = targets
        .map((el) => el.getBoundingClientRect().top + window.scrollY)
        .sort((a, b) => a - b);

      const current = window.scrollY;
      const eps = 4;
      let nextY: number | null = null;
      if (dir === 1) {
        for (const p of positions) {
          if (p > current + eps) {
            nextY = p;
            break;
          }
        }
      } else {
        for (let i = positions.length - 1; i >= 0; i--) {
          if (positions[i] < current - eps) {
            nextY = positions[i];
            break;
          }
        }
      }
      if (nextY === null) return;
      e.preventDefault();
      bumpNavKey();
      window.scrollTo({
        top: nextY,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bumpNavKey]);
}

export function CaseStudyDeck({ slides, meta }: CaseStudyDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [immersive, setImmersive] = useState(false);
  const [lastNavKeyAt, setLastNavKeyAt] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const navSlides: DeckContextSlide[] = useMemo(
    () => slides.map((s, i) => ({ id: `${s.slug}-${i}`, label: s.name })),
    [slides],
  );

  const bumpNavKey = useCallback(() => setLastNavKeyAt(Date.now()), []);

  useArrowSnapNav(bumpNavKey);
  useHideChromeForSlide(slides[activeIndex]?.hideChrome === true);

  /* Active-slide detection — IntersectionObserver with a viewport
     center trip-line. Whichever slide straddles the centerline is
     "active" for chrome purposes. */
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(`[${SLIDE_INDEX_ATTR}]`),
    );
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute(SLIDE_INDEX_ATTR));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [navSlides.length]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(navSlides.length - 1, index));
      const el = document.querySelector<HTMLElement>(
        `[${SLIDE_INDEX_ATTR}="${clamped}"]`,
      );
      if (!el) return;
      bumpNavKey();
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },
    [navSlides.length, bumpNavKey],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  const ctxValue: DeckContextValue = {
    activeIndex,
    total: navSlides.length,
    slides: navSlides,
    goTo,
    next,
    prev,
    immersive,
    setImmersive,
    lastNavKeyAt,
    bumpNavKey,
  };

  const backHref = meta.backHref ?? "/";
  const backLabel = meta.backLabel ?? "← Back to portfolio";

  return (
    <DeckContext.Provider value={ctxValue}>
      <div ref={containerRef} className="wipu-sample-root">
        {slides.map((s, i) => {
          if (s.selfContained) {
            return (
              <div key={`${s.slug}-${i}`} {...{ [SLIDE_INDEX_ATTR]: i }}>
                {s.content}
              </div>
            );
          }
          return (
            <section
              key={`${s.slug}-${i}`}
              id={`slide-${s.slug}-${i}`}
              className="wipu-sample-slide"
              data-theme={s.dark ? "dark" : undefined}
              {...{ [SLIDE_INDEX_ATTR]: i }}
            >
              <div className="wipu-sample-inner">{s.content}</div>
            </section>
          );
        })}
        <Link href={backHref} className="wipu-sample-back">
          {backLabel}
        </Link>
      </div>
      <DeckChrome />
    </DeckContext.Provider>
  );
}
