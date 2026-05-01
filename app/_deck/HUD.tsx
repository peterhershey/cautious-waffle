"use client";

import { useEffect, useState } from "react";

export function HUD() {
  return (
    <div className="wipu-hud">
      <div className="wipu-hud-left" aria-hidden />
      <div className="wipu-hud-right">
        <ThemeToggle />
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".wipu-root");
    setTheme((root?.dataset.theme as "dark" | "light") ?? "dark");
    setMounted(true);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.querySelector<HTMLElement>(".wipu-root");
    if (root) root.dataset.theme = next;
    try {
      localStorage.setItem("wipu-theme", next);
    } catch {}
  };
  return (
    <button
      type="button"
      className="wipu-theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span aria-hidden>{mounted && theme === "dark" ? "◐" : "◑"}</span>
      <span>{mounted ? (theme === "dark" ? "Dark" : "Light") : "Theme"}</span>
    </button>
  );
}
