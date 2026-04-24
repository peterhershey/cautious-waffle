"use client";

import { useEffect, useRef, useState } from "react";

const STOPS = [
  {
    src: "/gemini-timeline/stop-1.webp",
    alt: "Gemini app launch on iOS and Android — home screen with suggestion chips",
    date: "Feb 2024",
    label: "App Launch",
  },
  {
    src: "/gemini-timeline/stop-2.gif",
    alt: "Gemini Screen Context — sharing the current phone screen with Gemini",
    date: "May 2024",
    label: "Screen Context",
  },
  {
    src: "/gemini-timeline/stop-3.webp",
    alt: "Gemini Live — voice-only dark screen with waveform bloom and Hold/End controls",
    date: "Aug 2024",
    label: "Live",
  },
  {
    src: "/gemini-timeline/stop-4.png",
    alt: "Gemini Live Video Streaming — live camera sharing with Gemini",
    date: "Feb 2025",
    label: "Video Streaming",
  },
  {
    src: "/gemini-timeline/stop-5.gif",
    alt: "Gemini Live Visual Cues — bounding-box overlays referencing objects in frame",
    date: "Oct 2025",
    label: "Visual Cues",
  },
] as const;

/**
 * Scroll-pinned horizontal timeline for the "Teaching Gemini to See" case
 * study. The outer <section> is 300vh tall; inside, a sticky pin holds a
 * single viewport in place while vertical scroll is translated into horizontal
 * pan across three reference images. rAF-throttled to match Scene.tsx.
 *
 * On prefers-reduced-motion and narrow viewports, CSS collapses the track to
 * a vertical stack — no JS branching needed here.
 */
export function GeminiTimeline() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!section || !track || !fill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 820px)");
    const isFallback = () => reduced.matches || narrow.matches;

    let raf = 0;
    let lastIdx = -1;

    const update = () => {
      raf = 0;
      if (isFallback()) {
        track.style.transform = "";
        fill.style.width = "";
        if (lastIdx !== 0) {
          setActive(0);
          lastIdx = 0;
        }
        return;
      }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const pannable = rect.height - vh;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / pannable));
      const panVw = progress * (STOPS.length - 1) * 100;
      track.style.transform = `translate3d(${-panVw}vw, 0, 0)`;
      fill.style.width = `${progress * 100}%`;
      const idx = Math.min(
        STOPS.length - 1,
        Math.round(progress * (STOPS.length - 1))
      );
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="wipu-timeline"
      aria-label="How Gemini learned to see — a three-step visual timeline"
    >
      {STOPS.map((_, i) => (
        <div
          key={`snap-${i}`}
          className="wipu-timeline-snap"
          style={{ top: `${i * 100}vh` }}
          aria-hidden="true"
        />
      ))}
      <div className="wipu-timeline-pin">
        <div
          ref={trackRef}
          className="wipu-timeline-track"
          aria-hidden="true"
        >
          {STOPS.map((stop, i) => (
            <div
              key={stop.src}
              className={`wipu-timeline-stop${active === i ? " is-active" : ""}`}
            >
              <figure className="wipu-timeline-figure">
                <img
                  src={stop.src}
                  alt={stop.alt}
                  className="wipu-timeline-image"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <figcaption className="wipu-timeline-stop-caption">
                  <span className="wipu-timeline-stop-label">{stop.label}</span>
                  <span className="wipu-timeline-stop-date">{stop.date}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        <div className="wipu-timeline-progress" aria-hidden="true">
          <div className="wipu-timeline-progress-rail">
            <span
              ref={fillRef}
              className="wipu-timeline-progress-fill"
            />
            {STOPS.map((stop, i) => (
              <div
                key={stop.date}
                className={`wipu-timeline-tick${
                  active >= i ? " is-reached" : ""
                }${active === i ? " is-active" : ""}`}
                style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
              >
                <span className="wipu-timeline-tick-dot" />
                <span className="wipu-timeline-tick-label">{stop.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
