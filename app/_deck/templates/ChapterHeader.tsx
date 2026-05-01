/* Chapter header — quiet section break with a small passport stamp.
   Stamp markup mirrors the floating CityStamp in the archive case-study
   view so it picks up the same .wipu-case-stamp-draw stagger animation
   (rings → ticks → star → rules → plane → text) defined in board.css. */

"use client";

import { useEffect, useRef } from "react";

export type ChapterHeaderProps = {
  chapter: string;
  city: string;
  date: string;
  cityKey: "nyc" | "zurich" | "mxcity";
  stampDate?: string;
  countryCode?: string;
};

export function ChapterHeader({
  chapter,
  city,
  date,
  cityKey,
  stampDate,
  countryCode,
}: ChapterHeaderProps) {
  const stampRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stampRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Replay the draw animation each time the slide returns to view.
          if (e.isIntersecting) el.classList.add("is-revealed");
          else el.classList.remove("is-revealed");
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const arcTopId = `wipu-chapter-arc-top-${cityKey}`;
  const arcBottomId = `wipu-chapter-arc-bottom-${cityKey}`;
  const country =
    countryCode ??
    (cityKey === "nyc"
      ? "USA · JFK"
      : cityKey === "zurich"
        ? "CH · ZRH"
        : "MX · MEX");
  const inner = stampDate ?? date.split(" ").slice(0, 2).join(" · ");

  return (
    <div className="wipu-tpl-chapter">
      <div
        ref={stampRef}
        className={`wipu-case-stamp wipu-tpl-chapter-stamp wipu-tpl-chapter-stamp-${cityKey}`}
        aria-hidden="true"
      >
        <svg
          viewBox="-90 -90 180 180"
          xmlns="http://www.w3.org/2000/svg"
          className="wipu-case-stamp-svg"
        >
          <defs>
            <path
              id={arcTopId}
              d="M -54 -6 A 54 54 0 0 1 54 -6"
              fill="none"
            />
            <path
              id={arcBottomId}
              d="M -50 10 A 50 50 0 0 0 50 10"
              fill="none"
            />
          </defs>
          <circle
            cx="0"
            cy="0"
            r="78"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-outer"
          />
          <circle
            cx="0"
            cy="0"
            r="68"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-mid"
          />
          <circle
            cx="0"
            cy="0"
            r="60"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-inner"
          />
          <g className="wipu-case-stamp-ticks">
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="-78"
                x2="0"
                y2="-69"
                pathLength="1"
                transform={`rotate(${i * 30})`}
                className="wipu-case-stamp-draw wipu-case-stamp-draw-tick"
              />
            ))}
          </g>
          <text className="wipu-case-stamp-text-arc">
            <textPath
              href={`#${arcTopId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {city.toUpperCase()}
            </textPath>
          </text>
          <path
            d="M 0 -32 L 2.3 -26.5 L 8.2 -26 L 3.7 -22 L 5.3 -16.2 L 0 -19.5 L -5.3 -16.2 L -3.7 -22 L -8.2 -26 L -2.3 -26.5 Z"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-star"
          />
          <line
            x1="-32"
            y1="-6"
            x2="32"
            y2="-6"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
          />
          <line
            x1="-28"
            y1="-2"
            x2="28"
            y2="-2"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
          />
          <text
            x="0"
            y="12"
            textAnchor="middle"
            className="wipu-case-stamp-text-date"
          >
            {inner}
          </text>
          <line
            x1="-26"
            y1="22"
            x2="26"
            y2="22"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
          />
          <g
            transform="translate(0 38)"
            className="wipu-case-stamp-plane-group"
          >
            <path
              d="M -11 0 L 11 0 M -9 -3 L 9 -3 L 6 0 L 9 3 L -9 3 L -6 0 Z M 0 -6 L 0 6"
              pathLength="1"
              className="wipu-case-stamp-draw wipu-case-stamp-draw-plane"
            />
          </g>
          <text className="wipu-case-stamp-text-arc wipu-case-stamp-text-arc-bottom">
            <textPath
              href={`#${arcBottomId}`}
              startOffset="50%"
              textAnchor="middle"
            >
              {country}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="wipu-tpl-chapter-meta">
        <div className="wipu-tpl-chapter-eyebrow">CHAPTER · {chapter}</div>
        <h2 className="wipu-tpl-chapter-title">{city}</h2>
        <div className="wipu-tpl-chapter-date">{date}</div>
      </div>
    </div>
  );
}
