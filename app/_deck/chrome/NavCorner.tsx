"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

export function NavCorner() {
  const { activeIndex, goTo, slides } = useDeck();
  const pathname = usePathname() ?? "/";
  const [tapOpen, setTapOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut: 'n' opens panel and focuses first item
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setTapOpen(true);
        const first = rootRef.current?.querySelector<HTMLButtonElement | HTMLAnchorElement>(
          ".wipu-navcorner-item",
        );
        first?.focus();
      } else if (e.key === "Escape" && tapOpen) {
        setTapOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tapOpen]);

  // Tap outside closes (touch-only)
  useEffect(() => {
    if (!tapOpen) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) setTapOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [tapOpen]);

  return (
    <div
      ref={rootRef}
      className="wipu-corner wipu-corner--left"
      data-open={tapOpen ? "true" : undefined}
    >
      <button
        type="button"
        className="wipu-corner-zone"
        aria-label="Open navigator"
        aria-expanded={tapOpen}
        onClick={() => setTapOpen((v) => !v)}
      />
      <span className="wipu-corner-dot" aria-hidden />
      <div className="wipu-corner-panel glass" role="dialog" aria-label="Navigator">
        <div className="wipu-corner-panel-head">
          <span>Pages</span>
        </div>
        <ul className="wipu-navcorner-list">
          {PAGES.map((page) => {
            const active = isPageActive(pathname, page);
            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="wipu-navcorner-item"
                  data-active={active ? "true" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setTapOpen(false)}
                >
                  <span className="wipu-navcorner-num" aria-hidden>
                    →
                  </span>
                  <span>{page.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {slides.length > 0 && (
          <>
            <div className="wipu-corner-panel-head wipu-corner-panel-head--sub">
              <span>Slides</span>
              <span className="wipu-corner-panel-hint">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
            <ul className="wipu-navcorner-list">
              {slides.map((slide, i) => (
                <li key={slide.id}>
                  <button
                    type="button"
                    className="wipu-navcorner-item"
                    data-active={i === activeIndex ? "true" : undefined}
                    aria-current={i === activeIndex ? "step" : undefined}
                    onClick={() => {
                      goTo(i);
                      setTapOpen(false);
                    }}
                  >
                    <span className="wipu-navcorner-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{slide.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
