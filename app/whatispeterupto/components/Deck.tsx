"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SLIDES } from "./slides";
import { BottomBar } from "./BottomBar";

type DeckContextValue = {
  activeIndex: number;
  total: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  pinBar: () => void;
  immersive: boolean;
  setImmersive: (v: boolean) => void;
};

const DeckContext = createContext<DeckContextValue | null>(null);

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinTick, setPinTick] = useState(0); // BottomBar watches this to re-pin
  const [immersive, setImmersive] = useState(false);
  const initializedRef = useRef(false);

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
  const pinBar = useCallback(() => setPinTick((t) => t + 1), []);

  // Initial hash-based scroll (runs once, before IO fires)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = readHashIndex();
    if (initial > 0) {
      container.scrollTo({ top: initial * container.clientHeight, behavior: "auto" });
      setActiveIndex(initial);
    }
    initializedRef.current = true;
  }, []);

  // IntersectionObserver → drives activeIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // pick the most-visible entry
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

  // Sync hash URL when activeIndex changes (skip first render so we don't stomp the hash we just read)
  useEffect(() => {
    if (!initializedRef.current) return;
    const id = SLIDES[activeIndex]?.id;
    if (!id) return;
    const nextHash = `${HASH_PREFIX}${id}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", nextHash);
    }
  }, [activeIndex]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          t.isContentEditable
        ) {
          return;
        }
      }
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          goTo(activeIndex + 1);
          break;
        case " ":
          e.preventDefault();
          goTo(activeIndex + (e.shiftKey ? -1 : 1));
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goTo(activeIndex - 1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SLIDES.length - 1);
          break;
        case ".":
        case "t":
        case "T":
          setPinTick((v) => v + 1);
          break;
        default: {
          if (/^[1-9]$/.test(e.key)) {
            const n = Number(e.key) - 1;
            if (n < SLIDES.length) {
              e.preventDefault();
              goTo(n);
            }
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, goTo]);

  const ctxValue: DeckContextValue = {
    activeIndex,
    total: SLIDES.length,
    goTo,
    next,
    prev,
    pinBar,
    immersive,
    setImmersive,
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
      <BottomBar
        pinTick={pinTick}
        slides={SLIDES.map((s) => ({ id: s.id, label: s.label }))}
        hidden={immersive}
      />
      <div className="wipu-tpl-hotspot" aria-hidden={immersive}>
        <Link
          href="/whatispeterupto/templates"
          className="wipu-tpl-hotspot-link"
        >
          Templates
        </Link>
      </div>
    </DeckContext.Provider>
  );
}

export function DeckRoot() {
  return <Deck />;
}

export { SLIDES };
