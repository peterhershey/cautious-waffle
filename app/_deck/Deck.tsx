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
import { useDeckScroll } from "./scroll/useDeckScroll";
import { isCoarsePointer } from "./scroll/touchDetect";

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

export function Deck() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  // Always start at 0 on first render so SSR and the client's first paint
  // agree. The hash-derived index is applied in useLayoutEffect below
  // (synchronously, before paint) so deep links still arrive on the right
  // slide without a hydration mismatch on data-active.
  const [activeIndex, setActiveIndex] = useState(0);
  const [immersive, setImmersive] = useState(false);
  const [lastNavKeyAt, setLastNavKeyAt] = useState(0);

  const bumpNavKey = useCallback(() => setLastNavKeyAt(Date.now()), []);

  const { goTo, isAnimatingRef } = useDeckScroll({
    containerRef,
    total: SLIDES.length,
    activeIndex,
    setActiveIndex,
    bumpNavKey,
  });

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Apply the hash-derived initial slide synchronously before paint, then
  // jump the scroll container to match. Reading the hash here (rather than
  // in useState) keeps SSR and the client's first render in sync so the
  // data-active markers don't trigger a hydration mismatch.
  useLayoutEffect(() => {
    const idx = readHashIndex();
    if (idx === 0) return;
    setActiveIndex(idx);
    const container = containerRef.current;
    const target = slideRefs.current[idx];
    if (container) {
      // Use the slide's actual offsetTop instead of `idx * clientHeight`:
      // on mobile, slides can grow taller than the visible viewport, so
      // index-times-clientHeight lands mid-wrong-slide. offsetTop is
      // correct on both mobile and desktop.
      const top = target ? target.offsetTop : idx * container.clientHeight;
      container.scrollTo({ top, behavior: "auto" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot mount sync only
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (isAnimatingRef.current) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isAnimatingRef is a ref; observer is created once
  }, []);

  useEffect(() => {
    const id = SLIDES[activeIndex]?.id;
    if (!id) return;
    const nextHash = `${HASH_PREFIX}${id}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }, [activeIndex]);

  /* Play videos on the active slide, pause everywhere else. Single
     source of truth — individual templates keep their `autoPlay` markup
     for first-paint behavior; this just gates playback by activeness. */
  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const videos = slide.querySelectorAll<HTMLVideoElement>("video");
      if (i === activeIndex) {
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

  // Touch swipe (vertical). On touch devices we skip this entirely
  // and let native scroll + CSS scroll-snap drive the experience —
  // see the (hover: none) and (pointer: coarse) block in deck.css.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (isCoarsePointer()) return;
    let startY = 0;
    let startT = 0;
    let allow = true;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      startT = Date.now();
      const t = e.target as HTMLElement | null;
      allow = !t?.closest("[data-allow-scroll='true']");
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!allow) return;
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
