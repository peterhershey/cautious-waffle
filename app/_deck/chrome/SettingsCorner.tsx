"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDeck } from "../Deck";
import { ThemeToggle } from "../ThemeToggle";

export function SettingsCorner() {
  const { immersive, setImmersive } = useDeck();
  const [tapOpen, setTapOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === ",") {
        e.preventDefault();
        setTapOpen(true);
      } else if (e.key === "Escape" && tapOpen) {
        setTapOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tapOpen]);

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
      className="wipu-corner wipu-corner--right"
      data-open={tapOpen ? "true" : undefined}
    >
      <button
        type="button"
        className="wipu-corner-zone"
        aria-label="Open settings"
        aria-expanded={tapOpen}
        onClick={() => setTapOpen((v) => !v)}
      />
      <span className="wipu-corner-dot" aria-hidden />
      <div className="wipu-corner-panel glass" role="dialog" aria-label="Settings">
        <div className="wipu-corner-panel-head">
          <span>Settings</span>
        </div>

        <div className="wipu-settings-section">
          <div className="wipu-settings-row">
            <span className="wipu-settings-label">Theme</span>
            <ThemeToggle />
          </div>
          <div className="wipu-settings-row">
            <span className="wipu-settings-label">Immersive</span>
            <button
              type="button"
              className="wipu-settings-toggle"
              aria-pressed={immersive}
              onClick={() => setImmersive(!immersive)}
            >
              {immersive ? "On" : "Off"}
            </button>
          </div>
          <div className="wipu-settings-row">
            <span className="wipu-settings-label">Templates</span>
            <Link href="/templates" className="wipu-settings-toggle">
              Open ↗
            </Link>
          </div>
        </div>

        <div className="wipu-settings-section">
          <div className="wipu-corner-panel-head">
            <span>Keys</span>
          </div>
          <div className="wipu-settings-keys">
            <kbd>← →</kbd><span>Prev / Next</span>
            <kbd>1–9</kbd><span>Jump to slide</span>
            <kbd>Home / End</kbd><span>First / Last</span>
            <kbd>n</kbd><span>Open nav</span>
            <kbd>,</kbd><span>Open settings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
