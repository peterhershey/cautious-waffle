"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDeck } from "./Deck";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  pinTick: number;
  slides: { id: string; label: string }[];
  hidden?: boolean;
};

const PEEK_ZONE_PX = 80;
const AUTO_HIDE_MS = 2000;
const INDEX_FLASH_MS = 1500;
const LEAVE_HIDE_MS = 300;

export function BottomBar({ pinTick, slides, hidden = false }: Props) {
  const { activeIndex, total, goTo, next, prev } = useDeck();
  const [shown, setShown] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const showFor = useCallback((ms: number) => {
    clearTimer();
    setShown(true);
    hideTimer.current = window.setTimeout(() => setShown(false), ms);
  }, []);

  const showSticky = useCallback(() => {
    clearTimer();
    setShown(true);
  }, []);

  const hideSoon = useCallback((ms: number) => {
    clearTimer();
    hideTimer.current = window.setTimeout(() => setShown(false), ms);
  }, []);

  // Cursor in bottom 80px → peek
  useEffect(() => {
    let rafId = 0;
    let queued = false;
    const onMove = (e: MouseEvent) => {
      if (queued) return;
      queued = true;
      rafId = requestAnimationFrame(() => {
        queued = false;
        if (window.innerHeight - e.clientY <= PEEK_ZONE_PX) {
          showFor(AUTO_HIDE_MS);
        }
      });
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [showFor]);

  // Pin request (keyboard . / T)
  useEffect(() => {
    if (pinTick === 0) return;
    showFor(AUTO_HIDE_MS);
  }, [pinTick, showFor]);

  // Flash on slide change for orientation
  useEffect(() => {
    showFor(INDEX_FLASH_MS);
  }, [activeIndex, showFor]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), []);

  if (hidden) return null;

  return (
    <div
      className="wipu-bottombar"
      data-shown={shown ? "true" : "false"}
      onMouseEnter={showSticky}
      onMouseLeave={() => hideSoon(LEAVE_HIDE_MS)}
      role="toolbar"
      aria-label="Presentation controls"
    >
      <div className="wipu-bottombar-inner">
        <button
          type="button"
          className="wipu-bottombar-btn"
          onClick={prev}
          aria-label="Previous slide"
          disabled={activeIndex === 0}
        >
          ←
        </button>

        <div className="wipu-bottombar-progress" aria-label="Slide progress">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="wipu-bottombar-dot"
              data-active={i === activeIndex ? "true" : "false"}
              aria-current={i === activeIndex ? "step" : undefined}
              aria-label={`Go to ${s.label}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="wipu-bottombar-label" aria-live="polite">
          <span className="wipu-bottombar-count">
            {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="wipu-bottombar-section">{slides[activeIndex]?.label}</span>
        </div>

        <button
          type="button"
          className="wipu-bottombar-btn"
          onClick={next}
          aria-label="Next slide"
          disabled={activeIndex === total - 1}
        >
          →
        </button>

        <div className="wipu-bottombar-sep" aria-hidden />

        <ThemeToggle />
      </div>
    </div>
  );
}
