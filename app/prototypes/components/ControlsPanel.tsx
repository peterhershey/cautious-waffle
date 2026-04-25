"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { QuickNav } from "@/app/components/QuickNav";
import type { Prototype, Scenario } from "@/lib/prototypes";

type ControlsPanelProps = {
  prototype: Prototype;
  activeScenarioId: string;
  onScenarioChange: (id: string) => void;
  status: "idle" | "playing" | "paused" | "ended";
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  children?: ReactNode;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function ControlsPanel({
  prototype,
  activeScenarioId,
  onScenarioChange,
  status,
  onPlay,
  onPause,
  onRestart,
  children,
  mobileOpen,
  onMobileClose,
}: ControlsPanelProps) {
  const isPlaying = status === "playing";
  const playLabel = status === "ended" ? "Replay" : isPlaying ? "Playing" : "Play";

  return (
    <aside
      className="proto-panel"
      data-mobile-open={mobileOpen ? "true" : undefined}
    >
      {onMobileClose ? (
        <button
          type="button"
          className="proto-panel-close"
          aria-label="Close controls"
          onClick={onMobileClose}
        >
          <span className="proto-panel-close-x" aria-hidden>
            ✕
          </span>
        </button>
      ) : null}
      <div className="proto-panel-section">
        <div className="proto-panel-kicker-row">
          <QuickNav inline />
          <span className="proto-panel-kicker">Prototype</span>
        </div>
        <h1 className="proto-panel-title">{prototype.title}</h1>
        <div className="proto-panel-meta">
          <span>{prototype.year}</span>
        </div>
        <p className="proto-panel-summary">{prototype.summary}</p>
        {prototype.caseStudyHref ? (
          <Link href={prototype.caseStudyHref} className="proto-case-link">
            {prototype.caseStudyLabel ?? "Read the case study"} →
          </Link>
        ) : null}
      </div>

      <div className="proto-panel-section">
        <span className="proto-panel-kicker">Scenario</span>
        <div className="proto-scenario-list" role="radiogroup" aria-label="Scenario">
          {prototype.scenarios.map((s: Scenario) => {
            const active = s.id === activeScenarioId;
            return (
              <button
                key={s.id}
                type="button"
                className="proto-scenario-item"
                data-active={active}
                role="radio"
                aria-checked={active}
                onClick={() => onScenarioChange(s.id)}
              >
                <span className="proto-scenario-dot" aria-hidden />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="proto-panel-section">
        <span className="proto-panel-kicker">Playback</span>
        <div className="proto-transport">
          {isPlaying ? (
            <button
              type="button"
              className="proto-transport-btn"
              data-variant="primary"
              onClick={onPause}
            >
              Pause
            </button>
          ) : (
            <button
              type="button"
              className="proto-transport-btn"
              data-variant="primary"
              onClick={onPlay}
            >
              {playLabel}
            </button>
          )}
          <button
            type="button"
            className="proto-transport-btn"
            onClick={onRestart}
            disabled={status === "idle"}
          >
            Restart
          </button>
        </div>
      </div>

      {children}
    </aside>
  );
}
