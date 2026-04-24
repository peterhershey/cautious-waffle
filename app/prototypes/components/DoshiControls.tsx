"use client";

type Props = {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
};

/**
 * DOSHI experimental mode toggle. Rendered inside the shared
 * "Experiments" section using the proto-experiment pattern so it
 * matches the other prototype's labs drawer.
 */
export function DoshiControls({ enabled, onEnabledChange }: Props) {
  return (
    <button
      type="button"
      className="proto-experiment"
      data-on={enabled ? "true" : undefined}
      onClick={() => onEnabledChange(!enabled)}
      aria-pressed={enabled}
    >
      <span className="proto-experiment-copy">
        <span className="proto-experiment-label">DOSHI</span>
        <span className="proto-experiment-sub">
          Full-bleed experimental redesign
        </span>
      </span>
      <span
        className="proto-experiment-switch"
        data-on={enabled ? "true" : undefined}
        aria-hidden
      />
    </button>
  );
}
