"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./quicknav.css";

type NavItem = { label: string; href: string };
type NavGroup = { group: string; items: NavItem[] };

const LINKS: NavGroup[] = [
  {
    group: "Portfolio",
    items: [
      { label: "whatispeterup.to", href: "/whatispeterupto" },
      { label: "Templates catalog", href: "/whatispeterupto/templates" },
      { label: "Templates sample", href: "/whatispeterupto/templates/sample" },
      { label: "Design system", href: "/whatispeterupto/design-system" },
    ],
  },
  {
    group: "Case studies",
    items: [
      {
        label: "Teaching Gemini to See",
        href: "/whatispeterupto/case-studies/teaching-gemini-to-see",
      },
    ],
  },
  {
    group: "Prototypes",
    items: [
      { label: "All prototypes", href: "/prototypes" },
      { label: "Voice chat", href: "/prototypes/voice-chat" },
      { label: "Video generation", href: "/prototypes/video-generation" },
    ],
  },
];

export function QuickNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Click-outside + Escape to close
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="quicknav"
      data-open={open ? "true" : "false"}
    >
      <button
        type="button"
        className="quicknav-trigger"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="quicknav-burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav className="quicknav-panel" aria-label="Quick navigation">
        {LINKS.map((group) => (
          <div key={group.group} className="quicknav-group">
            <div className="quicknav-group-head">{group.group}</div>
            <ul className="quicknav-list">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="quicknav-link"
                      data-active={isActive ? "true" : "false"}
                      onClick={() => setOpen(false)}
                    >
                      <span className="quicknav-link-dot" aria-hidden />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
