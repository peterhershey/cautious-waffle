"use client";

import { useEffect, useRef, useState } from "react";

type Stop = {
  tint: "terracotta" | "mint" | "mustard" | "rose" | "navy";
  title: string;
  date: string;
};

const STOPS: Stop[] = [
  { tint: "terracotta", title: "Lorem Ipsum", date: "FEB 2024" },
  { tint: "mustard", title: "Dolor Sit Amet", date: "MAY 2024" },
  { tint: "mint", title: "Consectetur", date: "AUG 2024" },
  { tint: "rose", title: "Adipiscing Elit", date: "FEB 2025" },
  { tint: "navy", title: "Tempor Incididunt", date: "OCT 2025" },
];

/**
 * Scroll-pinned horizontal timeline sample. Outer section is
 * STOPS.length * 100svh tall. A sticky pin holds a single viewport
 * while vertical scroll is translated into horizontal pan across the
 * stops. rAF-throttled. Mirrors the Teaching Gemini to See pattern.
 */
export function TimelineSample() {
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
      className="wipu-sample-tl"
      aria-label="Scroll-pinned timeline sample"
    >
      {STOPS.map((_, i) => (
        <div
          key={`snap-${i}`}
          className="wipu-sample-tl-snap"
          style={{ top: `${i * 100}svh` }}
          aria-hidden="true"
        />
      ))}
      <div className="wipu-sample-tl-pin">
        <div className="wipu-sample-slide-label">
          <strong>07</strong> Timeline
        </div>
        <div
          ref={trackRef}
          className="wipu-sample-tl-track"
          aria-hidden="true"
        >
          {STOPS.map((stop, i) => (
            <div
              key={i}
              className={`wipu-sample-tl-stop${
                active === i ? " is-active" : ""
              }`}
            >
              <figure className="wipu-sample-tl-figure">
                <div
                  className="wipu-sample-tl-image"
                  data-tint={stop.tint}
                  role="img"
                  aria-label={`${stop.title}, ${stop.date}`}
                />
                <figcaption className="wipu-sample-tl-stop-caption">
                  <span className="wipu-sample-tl-stop-label">
                    {stop.title}
                  </span>
                  <span className="wipu-sample-tl-stop-date">{stop.date}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>

        <div className="wipu-sample-tl-progress" aria-hidden="true">
          <div className="wipu-sample-tl-rail">
            <span ref={fillRef} className="wipu-sample-tl-fill" />
            {STOPS.map((stop, i) => (
              <div
                key={stop.date}
                className={`wipu-sample-tl-tick${
                  active >= i ? " is-reached" : ""
                }${active === i ? " is-active" : ""}`}
                style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
              >
                <span className="wipu-sample-tl-tick-dot" />
                <span className="wipu-sample-tl-tick-label">{stop.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
