"use client";

import { useState } from "react";

function readInitialTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  const root = document.querySelector<HTMLElement>(".wipu-root");
  return (root?.dataset.theme as "dark" | "light") ?? "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">(readInitialTheme);

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
      <span aria-hidden>{theme === "dark" ? "◐" : "◑"}</span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
