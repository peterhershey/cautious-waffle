"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SLIDES } from "./slides";
import { DeckChrome } from "./chrome/DeckChrome";

export type DeckContextSlide = { id: string; label: string };

export type DeckContextValue = {
  activeIndex: number;
  total: number;
  /** Slide list used by chrome (NavCorner list, DeckFrame TL title). */
  slides: DeckContextSlide[];
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  immersive: boolean;
  setImmersive: (v: boolean) => void;
  /** Timestamp of the last user navigation key — chrome resets idle timers on this. */
  lastNavKeyAt: number;
  bumpNavKey: () => void;
};

export const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used within <Deck>");
  return ctx;
}

const HASH_PREFIX = "#s/";

function readHashIndex(): number {
  if (typeof window === "undefined") return 0;
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return 0;
  const id = hash.slice(HASH_PREFIX.length);
  const i = SLIDES.findIndex((s) => s.id === id);
  return i >= 0 ? i : 0;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Deck() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(readHashIndex);
  const [immersive, setImmersive] = useState(false);
  const [lastNavKeyAt, setLastNavKeyAt] = useState(0);

  const goTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    const target = clamped * container.clientHeight;
    container.scrollTo({
      top: target,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const bumpNavKey = useCallback(() => setLastNavKeyAt(Date.now()), []);

  // Sync the scroll position to the hash-derived initial slide before paint.
  // activeIndex is already initialized from the hash via lazy state; this just
  // moves the scroll container to match.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || activeIndex === 0) return;
    container.scrollTo({
      top: activeIndex * container.clientHeight,
      behavior: "auto",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot mount sync only
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            const idxAttr = (entry.target as HTMLElement).dataset.slideIndex;
            if (idxAttr) bestIdx = Number(idxAttr);
          }
        }
        if (bestIdx >= 0 && bestRatio >= 0.6) {
          setActiveIndex(bestIdx);
        }
      },
      {
        root: container,
        threshold: [0.6, 0.8, 1],
      },
    );
    slideRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = SLIDES[activeIndex]?.id;
    if (!id) return;
    const nextHash = `${HASH_PREFIX}${id}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          bumpNavKey();
          goTo(activeIndex + 1);
          break;
        case " ":
          e.preventDefault();
          bumpNavKey();
          goTo(activeIndex + (e.shiftKey ? -1 : 1));
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          bumpNavKey();
          goTo(activeIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          bumpNavKey();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          bumpNavKey();
          goTo(SLIDES.length - 1);
          break;
        default: {
          if (/^[1-9]$/.test(e.key)) {
            const n = Number(e.key) - 1;
            if (n < SLIDES.length) {
              e.preventDefault();
              bumpNavKey();
              goTo(n);
            }
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo, bumpNavKey]);

  // Touch swipe (vertical) for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let startY = 0;
    let startT = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      startT = Date.now();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const dy = endY - startY;
      const dt = Date.now() - startT;
      if (Math.abs(dy) < 60 || dt > 600) return;
      bumpNavKey();
      if (dy < 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeIndex, goTo, bumpNavKey]);

  const ctxValue: DeckContextValue = {
    activeIndex,
    total: SLIDES.length,
    slides: SLIDES.map((s) => ({ id: s.id, label: s.label })),
    goTo,
    next,
    prev,
    immersive,
    setImmersive,
    lastNavKeyAt,
    bumpNavKey,
  };

  return (
    <DeckContext.Provider value={ctxValue}>
      <div
        ref={containerRef}
        className="wipu-deck"
        role="region"
        aria-label="Portfolio presentation"
      >
        {SLIDES.map((slide, i) => (
          <section
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="wipu-slide"
            data-slide-index={i}
            data-slide-id={slide.id}
            data-active={activeIndex === i ? "true" : "false"}
            aria-label={slide.label}
          >
            {slide.render()}
          </section>
        ))}
      </div>
      <DeckChrome />
    </DeckContext.Provider>
  );
}

export { SLIDES };
