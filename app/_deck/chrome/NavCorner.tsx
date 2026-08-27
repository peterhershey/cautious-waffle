"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useDeck, type DeckContextSlide } from "../Deck";
import { nav } from "@/app/content";

/* Page list comes from app/content.ts. Add entries there as new pages
   graduate from the archive. */
type Page = { href: string; label: string; matchPrefix?: string };

function isPageActive(pathname: string, page: Page): boolean {
  if (page.matchPrefix) return pathname.startsWith(page.matchPrefix);
  return pathname === page.href;
}

/* Slide labels in the registry may be styled all-caps for use as on-slide
   eyebrows ("INDEX · 00", "AI · IN PRACTICE · 05"). Case-study names are
   already Title Case — sentence-casing only kicks in when the whole label
   is uppercase, preserving acronyms like "AI". */
const NAV_LABEL_ACRONYMS = new Set(["AI", "UX", "UI", "API", "ML"]);

/* City codes prefixing case-study slide names ("NYC · The signal") —
   chapter context the section header already carries; dropped in the nav. */
const NAV_CITY_CODES = new Set(["NYC", "ZRH", "CA"]);

function sentenceCaseIfShouting(flat: string): string {
  if (flat !== flat.toUpperCase() || flat === flat.toLowerCase()) return flat;
  const cased = flat
    .split(/([\s-])/)
    .map((tok) => (NAV_LABEL_ACRONYMS.has(tok) ? tok : tok.toLowerCase()))
    .join("");
  return cased.charAt(0).toUpperCase() + cased.slice(1);
}

function toNavLabel(raw: string, groupTitle: string | null): string {
  let s = raw.replace(/\s*·\s*\d+\s*$/, ""); // trailing "· NN" index
  const parts = s.split(/\s*·\s*/);
  // Drop a leading city code or a repeat of the group's own title.
  while (parts.length > 1) {
    const head = parts[0];
    if (
      NAV_CITY_CODES.has(head.toUpperCase()) ||
      (groupTitle && head.toLowerCase() === groupTitle.toLowerCase()) ||
      head.toLowerCase() === "prototype"
    ) {
      parts.shift();
      continue;
    }
    break;
  }
  // After stripping context prefixes, the first segment is the title —
  // trailing segments are template descriptors ("Hero · Coding Form").
  s = parts[0];
  return sentenceCaseIfShouting(s);
}

function toGroupTitle(raw: string): string {
  return raw
    .replace(/^Section\s*·\s*/i, "")
    .replace(/\s*·\s*Divider\s*$/i, "");
}

type NavGroup = {
  title: string;
  /** Slide index the header navigates to — the divider slide itself,
      or the first slide of a leading (divider-less) group. */
  jumpIndex: number;
  /** Index of the divider slide, if the group has one. */
  dividerIndex: number | null;
  items: { index: number; label: string; proto: boolean }[];
};

function buildGroups(slides: DeckContextSlide[]): NavGroup[] {
  const groups: NavGroup[] = [];
  let current: NavGroup | null = null;
  slides.forEach((slide, i) => {
    if (slide.kind === "section") {
      if (current) groups.push(current);
      current = {
        title: toGroupTitle(slide.label),
        jumpIndex: i,
        dividerIndex: i,
        items: [],
      };
      return;
    }
    if (!current) {
      current = { title: "Overview", jumpIndex: i, dividerIndex: null, items: [] };
    }
    current.items.push({
      index: i,
      label: toNavLabel(slide.label, current.title),
      proto: slide.kind === "prototype",
    });
  });
  if (current) groups.push(current);
  return groups;
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

  const groups = slides.length > 0 ? buildGroups(slides) : [];

  /* Accordion state is derived, not stored: the group containing the
     active slide (or whose divider IS the active slide) is the open one,
     so arrowing through the deck expands sections as you arrive. */
  const isGroupActive = (g: NavGroup) =>
    g.dividerIndex === activeIndex ||
    g.items.some((it) => it.index === activeIndex);

  /* Flat row counter so the staggered rise animation cascades
     top-to-bottom across groups. */
  let row = nav.pages.length;

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
              {nav.pages.map((page, i) => {
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

          {groups.length > 0 && (
            <div className="wipu-takeover-section">
              <div className="wipu-takeover-section-label">On this page</div>
              <ul className="wipu-navcorner-list wipu-navcorner-groups">
                {groups.map((group) => {
                  const open = isGroupActive(group);
                  const headerRow = row++;
                  return (
                    <li
                      key={`g-${group.jumpIndex}`}
                      className="wipu-navcorner-group"
                      data-open={open ? "true" : undefined}
                      style={{ "--i": headerRow } as CSSProperties}
                    >
                      <button
                        type="button"
                        className="wipu-navcorner-item wipu-navcorner-group-header"
                        data-active={open ? "true" : undefined}
                        aria-expanded={open}
                        onClick={() => goTo(group.jumpIndex)}
                      >
                        <span className="wipu-navcorner-group-title">
                          {group.title}
                        </span>
                        <span
                          className="wipu-navcorner-group-count"
                          aria-label={`${group.items.length} slides`}
                        >
                          {group.items.length}
                        </span>
                      </button>
                      <div className="wipu-navcorner-group-reveal">
                        <ul className="wipu-navcorner-list wipu-navcorner-group-items">
                          {group.items.map((item) => (
                            <li
                              key={item.index}
                              style={{ "--i": open ? row++ : 0 } as CSSProperties}
                            >
                              <button
                                type="button"
                                className="wipu-navcorner-item wipu-navcorner-subitem"
                                data-active={
                                  item.index === activeIndex ? "true" : undefined
                                }
                                aria-current={
                                  item.index === activeIndex ? "step" : undefined
                                }
                                tabIndex={open ? undefined : -1}
                                onClick={() => goTo(item.index)}
                              >
                                <span className="wipu-navcorner-subitem-label">
                                  {item.label}
                                </span>
                                {item.proto && (
                                  <span
                                    className="wipu-navcorner-proto-chip"
                                    aria-label="Interactive prototype"
                                  >
                                    Proto
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
