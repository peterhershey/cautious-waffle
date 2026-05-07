"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useDeck } from "../Deck";

/* Cross-page nav. Hard-coded for now — the portfolio's surface area is
   small enough that a registry would be overkill. Add entries here as
   pages graduate from the archive. */
const PAGES: { href: string; label: string; matchPrefix?: string }[] = [
  { href: "/", label: "Home" },
  {
    href: "/case-studies/teaching-gemini-to-see",
    label: "Teaching Gemini to See",
    matchPrefix: "/case-studies/teaching-gemini-to-see",
  },
  {
    href: "/case-studies/veo-in-gemini",
    label: "Everyone's a Director",
    matchPrefix: "/case-studies/veo-in-gemini",
  },
  { href: "/templates", label: "Templates", matchPrefix: "/templates" },
  { href: "/archive", label: "Archive", matchPrefix: "/archive" },
];

function isPageActive(pathname: string, page: (typeof PAGES)[number]): boolean {
  if (page.matchPrefix) return pathname.startsWith(page.matchPrefix);
  return pathname === page.href;
}

/* Slide labels in the registry are styled all-caps for use as on-slide
   eyebrows ("INDEX · 00", "AI · IN PRACTICE · 05"). The nav wants the
   same identity in sentence case without the index suffix — preserving
   acronyms like "AI". */
const NAV_LABEL_ACRONYMS = new Set(["AI", "UX", "UI", "API", "ML"]);

function toNavLabel(raw: string): string {
  const stripped = raw.replace(/\s*·\s*\d+\s*$/, "");
  const flat = stripped.replace(/\s*·\s*/g, " ");
  const cased = flat
    .split(/([\s-])/)
    .map((tok) => (NAV_LABEL_ACRONYMS.has(tok) ? tok : tok.toLowerCase()))
    .join("");
  return cased.charAt(0).toUpperCase() + cased.slice(1);
}

export function NavCorner() {
  const { activeIndex, goTo, slides } = useDeck();
  const pathname = usePathname() ?? "/";
  /* CSS :hover and :focus-within drive visibility. `kbdOpen` only opens
     the panel via the 'n' keyboard shortcut; pointer interaction relies
     entirely on hover state, so leaving the trigger area + sidebar
     closes the panel naturally without Escape or click-outside logic. */
  const [kbdOpen, setKbdOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      )
        return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setKbdOpen(true);
        const first = rootRef.current?.querySelector<
          HTMLButtonElement | HTMLAnchorElement
        >(".wipu-navcorner-item");
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={rootRef}
      className="wipu-corner wipu-corner--left wipu-corner--takeover"
      data-open={kbdOpen ? "true" : undefined}
      onPointerLeave={() => setKbdOpen(false)}
    >
      <button
        type="button"
        className="wipu-corner-zone"
        aria-label="Open navigator"
        aria-expanded={kbdOpen}
      />
      <span className="wipu-corner-dot" aria-hidden />
      <div
        className="wipu-corner-takeover"
        role="dialog"
        aria-label="Navigator"
      >
        <div className="wipu-takeover-inner">
          <div className="wipu-takeover-section">
            <div className="wipu-takeover-section-label">Pages</div>
            <ul className="wipu-navcorner-list">
              {PAGES.map((page, i) => {
                const active = isPageActive(pathname, page);
                return (
                  <li
                    key={page.href}
                    style={{ "--i": i } as CSSProperties}
                  >
                    <Link
                      href={page.href}
                      className="wipu-navcorner-item"
                      data-active={active ? "true" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      {page.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {slides.length > 0 && (
            <div className="wipu-takeover-section">
              <div className="wipu-takeover-section-label">On this page</div>
              <ul className="wipu-navcorner-list">
                {slides.map((slide, i) => (
                  <li key={slide.id} style={{ "--i": i } as CSSProperties}>
                    <button
                      type="button"
                      className="wipu-navcorner-item"
                      data-active={i === activeIndex ? "true" : undefined}
                      aria-current={i === activeIndex ? "step" : undefined}
                      onClick={() => goTo(i)}
                    >
                      {toNavLabel(slide.label)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
