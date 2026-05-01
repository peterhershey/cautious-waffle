"use client";

type Status = "good" | "poor";

type Props = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  status: Status;
  onChange: (s: Status) => void;
};

/**
 * Labs control for the stream status indicator. Uses the shared
 * proto-experiment pattern so it sits alongside DOSHI under the
 * Experiments label. When enabled, a connection-quality segmented
 * control slides in below the toggle row.
 */
export function StreamControls({
  enabled,
  onEnabledChange,
  status,
  onChange,
}: Props) {
  return (
    <div className="stream-panel">
      <button
        type="button"
        className="proto-experiment"
        data-on={enabled ? "true" : undefined}
        onClick={() => onEnabledChange(!enabled)}
        aria-pressed={enabled}
      >
        <span className="proto-experiment-copy">
          <span className="proto-experiment-label">Stream status</span>
          <span className="proto-experiment-sub">
            Connection quality indicator
          </span>
        </span>
        <span
          className="proto-experiment-switch"
          data-on={enabled ? "true" : undefined}
          aria-hidden
        />
      </button>
      {enabled ? (
        <div
          className="stream-panel-segment"
          role="radiogroup"
          aria-label="Connection"
        >
          <button
            type="button"
            role="radio"
            aria-checked={status === "good"}
            className="stream-panel-chip"
            data-active={status === "good"}
            data-tone="good"
            onClick={() => onChange("good")}
          >
            <span className="stream-panel-swatch" aria-hidden />
            Good · 24fps
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={status === "poor"}
            className="stream-panel-chip"
            data-active={status === "poor"}
            data-tone="poor"
            onClick={() => onChange("poor")}
          >
            <span className="stream-panel-swatch" aria-hidden />
            Poor · 10fps
          </button>
        </div>
      ) : null}
    </div>
  );
}
