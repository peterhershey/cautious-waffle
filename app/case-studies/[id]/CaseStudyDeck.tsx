"use client";

import Link from "next/link";
import { type AnimationPlaybackControls } from "framer-motion";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  DeckContext,
  type DeckContextSlide,
  type DeckContextValue,
} from "../../_deck/Deck";
import { DeckChrome } from "../../_deck/chrome/DeckChrome";
import { LOCKED_SPRING } from "../../_deck/scroll/springConfig";
import {
  containerSurface,
  springScrollTo,
} from "../../_deck/scroll/springScroll";
import { isCoarsePointer } from "../../_deck/scroll/touchDetect";

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

/* Scroll-source for descendants like TimelineSample whose pan/progress is
   driven by scroll. Null when not inside a CaseStudyDeck (Storybook etc.) —
   consumers fall back to `window`. */
export const CaseStudyScrollContext =
  createContext<HTMLElement | null>(null);

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

/* Container-relative top of `el` in pixels, rounded to whole pixels —
   sub-pixel targets cause the browser to round-trip on settle, which
   reads as a glitch. */
function topInContainer(el: HTMLElement, container: HTMLElement): number {
  const rectTop = el.getBoundingClientRect().top;
  const containerRectTop = container.getBoundingClientRect().top;
  return Math.round(rectTop - containerRectTop + container.scrollTop);
}

function findNextSnapY(
  container: HTMLElement,
  direction: 1 | -1,
): number | null {
  const targets = Array.from(
    container.querySelectorAll<HTMLElement>(SNAP_SELECTOR),
  );
  if (targets.length === 0) return null;
  const positions = targets
    .map((el) => topInContainer(el, container))
    .sort((a, b) => a - b);

  const current = container.scrollTop;
  const eps = 4;
  if (direction === 1) {
    for (const p of positions) {
      if (p > current + eps) return p;
    }
  } else {
    for (let i = positions.length - 1; i >= 0; i--) {
      if (positions[i] < current - eps) return positions[i];
    }
  }
  return null;
}

/* Unified wheel + key + touch handler that spring-scrolls between snap
   targets within the case-study scroll container. Mirrors the home-deck
   `useDeckScroll` feel by using the same container-scroll surface. */
function useCaseStudySpringNav(
  container: HTMLElement | null,
  bumpNavKey: () => void,
) {
  const animRef = useRef<AnimationPlaybackControls | null>(null);
  const isAnimatingRef = useRef(false);

  const springTo = useCallback(
    (targetY: number) => {
      if (!container) return;
      animRef.current?.stop();
      isAnimatingRef.current = true;
      animRef.current = springScrollTo(containerSurface(container), targetY, {
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      if (!animRef.current) isAnimatingRef.current = false;
    },
    [container],
  );

  // Keyboard nav — listens at document level since focus may be anywhere.
  useEffect(() => {
    if (!container) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      const dir: 1 | -1 | 0 =
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
      const nextY = findNextSnapY(container, dir);
      if (nextY === null) return;
      e.preventDefault();
      bumpNavKey();
      springTo(nextY);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [bumpNavKey, springTo, container]);

  // Wheel hijack on the container — same shape as the home deck.
  useEffect(() => {
    if (!container) return;
    let cooldownUntil = 0;
    let lastFireAt = 0;
    const BREAK_DELTA = 200;
    const BREAK_GAP_MS = 200;

    const onWheel = (e: WheelEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLElement &&
        t.closest(
          "input, textarea, [contenteditable='true'], [data-allow-scroll='true']",
        )
      ) {
        return;
      }

      e.preventDefault();
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (Math.abs(e.deltaY) < 8) return;

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const locked = isAnimatingRef.current || now < cooldownUntil;
      const strong = Math.abs(e.deltaY) >= BREAK_DELTA;
      if (locked && (!strong || now - lastFireAt < BREAK_GAP_MS)) return;

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const nextY = findNextSnapY(container, dir);
      if (nextY === null) return;
      bumpNavKey();
      springTo(nextY);
      lastFireAt = now;
      cooldownUntil = now + LOCKED_SPRING.cooldownMs;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [bumpNavKey, springTo, container]);

  // Touch swipe on the container. Skipped on touch devices — native
  // scroll + CSS scroll-snap (sample.css) does the work, so a finger
  // swipe inside a tall slide doesn't get hijacked into a slide change.
  useEffect(() => {
    if (!container) return;
    if (isCoarsePointer()) return;
    let startY = 0;
    let startT = 0;
    let allow = true;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      startT = Date.now();
      const t = e.target;
      allow =
        !(t instanceof HTMLElement) ||
        !t.closest("[data-allow-scroll='true']");
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!allow) return;
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = endY - startY;
      const dt = Date.now() - startT;
      if (Math.abs(dy) < 60 || dt > 600) return;
      const dir: 1 | -1 = dy < 0 ? 1 : -1;
      const nextY = findNextSnapY(container, dir);
      if (nextY === null) return;
      bumpNavKey();
      springTo(nextY);
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [bumpNavKey, springTo, container]);

  // Stop any in-flight animation on unmount.
  useEffect(() => {
    return () => {
      animRef.current?.stop();
    };
  }, []);

  return { springTo, isAnimatingRef };
}

export function CaseStudyDeck({ slides, meta }: CaseStudyDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [immersive, setImmersive] = useState(false);
  const [lastNavKeyAt, setLastNavKeyAt] = useState(0);
  // Track the container element in state so child contexts and effects
  // re-run after the ref is attached on first mount.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const navSlides: DeckContextSlide[] = useMemo(
    () => slides.map((s, i) => ({ id: `${s.slug}-${i}`, label: s.name })),
    [slides],
  );

  const bumpNavKey = useCallback(() => setLastNavKeyAt(Date.now()), []);

  const { springTo } = useCaseStudySpringNav(container, bumpNavKey);
  useHideChromeForSlide(slides[activeIndex]?.hideChrome === true);

  /* Active-slide detection — IntersectionObserver scoped to the scroll
     container, with a centered trip-line. Whichever slide straddles the
     centerline is "active" for chrome purposes. */
  useEffect(() => {
    if (!container) return;
    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(`[${SLIDE_INDEX_ATTR}]`),
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
      { root: container, rootMargin: "-50% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [container, navSlides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (!container) return;
      const clamped = Math.max(0, Math.min(navSlides.length - 1, index));
      const el = container.querySelector<HTMLElement>(
        `[${SLIDE_INDEX_ATTR}="${clamped}"]`,
      );
      if (!el) return;
      bumpNavKey();
      springTo(topInContainer(el, container));
    },
    [navSlides.length, bumpNavKey, springTo, container],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  /* Play videos on the active slide, pause everywhere else. */
  useEffect(() => {
    if (!container) return;
    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(`[${SLIDE_INDEX_ATTR}]`),
    );
    targets.forEach((el) => {
      const idx = Number(el.getAttribute(SLIDE_INDEX_ATTR));
      const videos = el.querySelectorAll<HTMLVideoElement>("video");
      if (idx === activeIndex) {
        videos.forEach((v) => {
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        });
      } else {
        videos.forEach((v) => {
          if (!v.paused) v.pause();
        });
      }
    });
  }, [activeIndex, container]);

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
      <CaseStudyScrollContext.Provider value={container}>
        <div ref={setContainer} className="wipu-sample-root">
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
      </CaseStudyScrollContext.Provider>
      <DeckChrome />
    </DeckContext.Provider>
  );
}
