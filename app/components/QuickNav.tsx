"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./quicknav.css";

type NavItem = { label: string; href: string };
type NavGroup = { group: string; items: NavItem[] };

const LINKS: NavGroup[] = [
  {
    group: "Prototypes",
    items: [
      { label: "Voice chat", href: "/prototypes/voice-chat" },
      { label: "Video generation", href: "/prototypes/video-generation" },
    ],
  },
];

export function QuickNav({ inline = false }: { inline?: boolean }) {
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
      data-inline={inline ? "true" : undefined}
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
