"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTerminal } from "../TerminalContext";
import type { Track } from "../beat-machine";

type Item = { key: string; label: string; sub: string; index: number };
type Group = { title: string; items: Item[] };

const TRACK_NAME: Record<Track, string> = {
  home: "Portfolio",
  gemini: "Teaching Gemini to See",
  veo: "Everyone's a Director",
};

/** The `/` jump palette — context-aware. Inside a case study it lists that
 *  study's sections plus a way out; on the home track it lists the home
 *  landmarks plus the two case studies. Keeps the growing deck navigable. */
export function CommandPalette() {
  const { beats, state, dispatch, setPaletteOpen } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    inputRef.current?.focus();
    return () => restoreRef.current?.focus?.();
  }, []);

  const track: Track = beats[state.index]?.track ?? "home";

  // Build context-appropriate groups.
  const groups = useMemo<Group[]>(() => {
    const idx = (id: string) => beats.findIndex((b) => b.id === id);
    const landmarks: Item[] = beats
      .map((b, index) => ({ b, index }))
      .filter(({ b }) => b.track === track && b.navLabel)
      .map(({ b, index }) => ({
        key: b.id,
        label: b.navLabel as string,
        sub: b.command,
        index,
      }));

    const out: Group[] = [{ title: TRACK_NAME[track], items: landmarks }];

    if (track === "home") {
      const cs: Item[] = [];
      const gi = idx("gemini-hero");
      const vi = idx("veo-hero");
      if (gi >= 0)
        cs.push({ key: "x-gem", label: TRACK_NAME.gemini, sub: "open gemini-live", index: gi });
      if (vi >= 0)
        cs.push({ key: "x-veo", label: TRACK_NAME.veo, sub: "open veo", index: vi });
      out.push({ title: "Case studies", items: cs });
    } else {
      const go: Item[] = [];
      const hi = idx("case-studies");
      if (hi >= 0)
        go.push({ key: "x-home", label: "Portfolio home", sub: "ls ~/case-studies", index: hi });
      const otherId = track === "gemini" ? "veo-hero" : "gemini-hero";
      const oi = idx(otherId);
      if (oi >= 0)
        go.push({
          key: "x-other",
          label: track === "gemini" ? TRACK_NAME.veo : TRACK_NAME.gemini,
          sub: track === "gemini" ? "open veo" : "open gemini-live",
          index: oi,
        });
      out.push({ title: "Go to", items: go });
    }
    return out;
  }, [beats, track]);

  // Filter by query, then flatten for keyboard selection.
  const filtered = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) || it.sub.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, flat.length - 1)));
  }, [flat.length]);

  const close = () => setPaletteOpen(false);
  const jump = (index: number) => {
    dispatch({ type: "JUMP", index });
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelected((s) => Math.min(flat.length - 1, s + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelected((s) => Math.max(0, s - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (flat[selected]) jump(flat[selected].index);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        e.preventDefault();
        break;
    }
  };

  let running = -1; // running flat index for selection highlight

  return (
    <div className="term-palette-overlay" onMouseDown={close}>
      <div
        className="term-palette glass"
        role="dialog"
        aria-label="Jump"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="term-palette-input-row">
          <span className="term-prompt-sym">/</span>
          <input
            ref={inputRef}
            className="term-palette-input"
            value={query}
            placeholder="jump to a section…"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="term-palette-list">
          {flat.length === 0 ? (
            <div className="term-palette-empty term-faint">no matches</div>
          ) : (
            filtered.map((g) => (
              <div key={g.title} className="term-palette-group">
                <div className="term-palette-group-title term-faint">
                  {g.title}
                </div>
                <ul>
                  {g.items.map((it) => {
                    running += 1;
                    const i = running;
                    return (
                      <li
                        key={it.key}
                        className={`term-palette-item ${i === selected ? "is-selected" : ""}`}
                        onMouseEnter={() => setSelected(i)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          jump(it.index);
                        }}
                      >
                        <span className="term-palette-cmd term-accent">
                          {it.label}
                        </span>
                        <span className="term-palette-label term-dim">{it.sub}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
