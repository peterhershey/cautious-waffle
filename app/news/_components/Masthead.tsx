"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { MASTHEAD_NAV } from "@/lib/stories";

type Props = { dateline?: string; era: string };

export default function Masthead({ dateline, era }: Props) {
  const DATE = dateline ?? "Today's Edition";

  if (era === "1996") return <Masthead1996 />;
  if (era === "2004") return <Masthead2004 dateline={DATE} />;
  if (era === "2014") return <Masthead2014 dateline={DATE} />;
  return <Masthead2026 dateline={DATE} />;
}

function Masthead1996() {
  return (
    <header className="era1996-masthead">
      <div className="era1996-wordmark">The National Ledger</div>
      <div className="era1996-tagline">
        <a href="#">click here</a> to make us your homepage
      </div>
      <form className="era1996-nav" onSubmit={(e) => e.preventDefault()}>
        <select className="era1996-select" defaultValue="">
          <option value="" disabled>
            Select a Section
          </option>
          {MASTHEAD_NAV.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <button type="submit" className="era1996-go">
          Go
        </button>
      </form>
    </header>
  );
}

function Masthead2004({ dateline }: { dateline: string }) {
  return (
    <header className="era2004-masthead">
      <div className="era2004-date">{dateline}</div>
      <div className="era2004-wordmark news-wordmark">The National Ledger</div>
      <div className="era2004-tagline news-serif italic">Democracy in Daylight</div>
      <nav className="era2004-nav">
        {MASTHEAD_NAV.map((n, i) => (
          <a key={n} href="#" className={i === MASTHEAD_NAV.length - 1 ? "accent" : undefined}>
            {n}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Masthead2014({ dateline }: { dateline: string }) {
  return (
    <header className="era2014-masthead">
      <div className="era2014-topbar">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <button
            aria-label="Sections"
            type="button"
            style={{
              width: 26,
              height: 22,
              display: "inline-flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
              padding: 0,
              background: "transparent",
              border: 0,
              cursor: "pointer",
            }}
          >
            <span style={{ display: "block", height: 2, background: "#222" }} />
            <span style={{ display: "block", height: 2, background: "#222" }} />
            <span style={{ display: "block", height: 2, background: "#222" }} />
          </button>
          <span className="era2014-date">{dateline}</span>
        </span>
        <span className="era2014-utils">
          <a href="#">Subscribe</a> · <a href="#">Sign in</a> ·{" "}
          <a href="#">🔍</a>
        </span>
      </div>
      <div className="era2014-wordmark news-wordmark">The National Ledger</div>
      <div className="era2014-tagline">Democracy in Daylight</div>
      <nav className="era2014-nav">
        {MASTHEAD_NAV.map((n, i) => (
          <a key={n} href="#" className={i === MASTHEAD_NAV.length - 1 ? "accent" : undefined}>
            {n}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Masthead2026({ dateline }: { dateline: string }) {
  const { scrollY } = useScroll();
  const wordmarkScale = useTransform(scrollY, [0, 140], [1, 0.5]);
  const wordmarkY = useTransform(scrollY, [0, 140], [0, -14]);
  const taglineOpacity = useTransform(scrollY, [0, 70], [1, 0]);
  const dateOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "var(--paper)",
        borderBottom: "1px solid var(--rule)",
        paddingTop: 14,
        paddingBottom: 6,
      }}
    >
      <div className="news-container">
        <motion.div
          style={{ opacity: dateOpacity }}
          className="flex items-center justify-between news-meta"
        >
          <span>{dateline}</span>
          <span className="hidden sm:inline">Subscribe · Sign in · peter.hershey</span>
        </motion.div>

        <motion.div
          style={{
            scale: wordmarkScale,
            y: wordmarkY,
            transformOrigin: "center center",
            willChange: "transform",
          }}
          className="flex flex-col items-center py-2"
        >
          <h1 className="news-wordmark text-center" style={{ fontSize: "clamp(34px, 6vw, 68px)" }}>
            The National Ledger
          </h1>
          <motion.p style={{ opacity: taglineOpacity }} className="news-serif italic text-center">
            Democracy in Daylight
          </motion.p>
        </motion.div>

        <nav className="news-nav-strip" style={{ borderTop: "1px solid var(--rule)" }}>
          {MASTHEAD_NAV.map((label, i) => (
            <a
              key={label}
              href="#"
              className={i === MASTHEAD_NAV.length - 1 ? "accent" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
