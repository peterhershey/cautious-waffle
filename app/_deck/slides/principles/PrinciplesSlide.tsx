"use client";

/* Peter's Principles — /anthropic deck only.
   A left-aligned header over a three-up of hand-drawn principle icons:
   note cards (be prolific), a compass (flying blind), a sprout (build
   for change). Styles live in principles.css under .wipu-principles-*. */

import type { ReactNode } from "react";
import { principles } from "@/app/content";

const ICONS: Record<string, ReactNode> = {
  prolific: <NoteCardsIcon />,
  blind: <CompassIcon />,
  change: <CattailIcon />,
};

export function PrinciplesSlide() {
  return (
    <div className="wipu-principles">
      <header className="wipu-principles-head">
        <p className="wipu-principles-eyebrow">{principles.eyebrow}</p>
        <h1 className="wipu-principles-title">{principles.title}</h1>
      </header>

      <ul className="wipu-principles-grid">
        {principles.items.map((item) => (
          <li key={item.key} className="wipu-principles-item">
            <div className="wipu-principles-icon" aria-hidden>
              {ICONS[item.key]}
            </div>
            <h3 className="wipu-principles-item-title">{item.title}</h3>
            <p className="wipu-principles-item-body">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Be prolific: a little deck of note cards. At rest the front card
      smiles; on hover it cycles — blank card draws a smile, then deals
      itself to the back as the next card fronts up. Built as HTML divs
      (not SVG) so the cards can truly restack via z-index. ── */
const NOTE_CARDS = [
  { card: 0, tone: "mint" },
  { card: 1, tone: "mustard" },
  { card: 2, tone: "rose" },
] as const;

function NoteCardsIcon() {
  return (
    <div className="wipu-principles-cards">
      {NOTE_CARDS.map(({ card, tone }) => (
        <div
          key={card}
          className="wipu-principles-card"
          data-card={card}
          data-tone={tone}
        >
          <svg viewBox="0 0 44 44" aria-hidden>
            <g fill="none" strokeWidth="2.6" strokeLinecap="round">
              <circle className="wipu-principles-eye" cx="16" cy="19" r="0.4" />
              <circle className="wipu-principles-eye" cx="28" cy="19" r="0.4" />
              <path
                className="wipu-principles-mouth"
                d="M15 27 q7 6.5 14 0"
                pathLength={100}
              />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ── We are all flying blind: a Safari-style compass, needle tilted
      off true north because none of us actually have it. ── */
function CompassIcon() {
  return (
    <svg viewBox="0 0 120 120" className="wipu-principles-svg" role="img">
      <circle cx="60" cy="60" r="40" fill="var(--wipu-navy)" />
      <circle
        cx="60"
        cy="60"
        r="40"
        fill="none"
        stroke="#5b71ee"
        strokeWidth="2"
      />
      <circle cx="60" cy="60" r="31" fill="#3551e6" />
      {/* Resting tilt + hover thrash both live in CSS so they share an
          origin — see .wipu-principles-needle in principles.css. */}
      <g className="wipu-principles-needle">
        {/* north half — light */}
        <path d="M60 34 L66 60 L54 60 Z" fill="#eef1ff" />
        {/* south half — red */}
        <path d="M60 86 L66 60 L54 60 Z" fill="var(--wipu-terracotta)" />
      </g>
      <circle cx="60" cy="60" r="3" fill="#eef1ff" />
    </svg>
  );
}

/* ── Build for change: a cattail reed rooted in a ground line. Rigid
      until the wind hits, then it bends dramatically and springs back —
      lightweight things adapt. ── */
function CattailIcon() {
  return (
    <svg viewBox="0 0 120 120" className="wipu-principles-svg" role="img">
      <g className="wipu-principles-reed">
        {/* slender blade leaf */}
        <path
          d="M58 96 C42 82 38 60 49 45"
          fill="none"
          stroke="#3f9e63"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* main stalk */}
        <path
          d="M61 98 C59 80 60 64 62 50"
          fill="none"
          stroke="#3f9e63"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* cattail seed head */}
        <rect x="56.5" y="23" width="11" height="30" rx="5.5" fill="#7a5230" />
        {/* tip spike */}
        <line
          x1="62"
          y1="23"
          x2="62"
          y2="11"
          stroke="#3f9e63"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
      {/* ground line */}
      <line
        x1="40"
        y1="98"
        x2="84"
        y2="98"
        stroke="var(--wipu-ink-faint)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
