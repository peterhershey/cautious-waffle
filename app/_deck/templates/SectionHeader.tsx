/* Section header — three-up section list with a passport stamp.
   The active section is full-bright; others are dimmed. Stamp position
   and color are keyed off `cityKey` and the stamp draw animation reuses
   the .wipu-case-stamp-* classes from board.css. */

"use client";

import { useEffect, useRef } from "react";

export type SectionHeaderItem = {
  num: string;
  title: string;
  meta?: string;
};

export type SectionHeaderCityKey = "nyc" | "california" | "zurich";

export type SectionHeaderProps = {
  current: 1 | 2 | 3;
  sections: [SectionHeaderItem, SectionHeaderItem, SectionHeaderItem];
  cityKey: SectionHeaderCityKey;
  stampCity: string;
  stampDate: string;
  countryCode?: string;
};

const DEFAULT_COUNTRY: Record<SectionHeaderCityKey, string> = {
  nyc: "USA · JFK",
  california: "USA · SFO",
  zurich: "CH · ZRH",
};

export function SectionHeader({
  current,
  sections,
  cityKey,
  stampCity,
  stampDate,
  countryCode,
}: SectionHeaderProps) {
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
          if (e.isIntersecting) el.classList.add("is-revealed");
          else el.classList.remove("is-revealed");
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const arcTopId = `wipu-section-arc-top-${cityKey}`;
  const arcBottomId = `wipu-section-arc-bottom-${cityKey}`;
  const country = countryCode ?? DEFAULT_COUNTRY[cityKey];

  return (
    <div className="wipu-tpl-section">
      <div
        ref={stampRef}
        className={`wipu-case-stamp wipu-tpl-section-stamp wipu-tpl-section-stamp-${cityKey}`}
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
              {stampCity.toUpperCase()}
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
            {stampDate}
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
      <ol className="wipu-tpl-section-list">
        {sections.map((s, i) => {
          const idx = (i + 1) as 1 | 2 | 3;
          const active = idx === current;
          return (
            <li
              key={s.num}
              className="wipu-tpl-section-item"
              data-active={active ? "true" : "false"}
            >
              <span className="wipu-tpl-section-num" aria-hidden>
                {s.num.padStart(2, "0")}
              </span>
              <div className="wipu-tpl-section-body">
                <span className="wipu-tpl-section-title">{s.title}</span>
                {active && s.meta ? (
                  <span className="wipu-tpl-section-meta">{s.meta}</span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
