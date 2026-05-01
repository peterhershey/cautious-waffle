import type { TickerTone } from "@/lib/editions";

type Props = { items: string[]; tone: TickerTone };

const TONE_STYLES: Record<TickerTone, { bg: string; fg: string; accent: string; label: string }> = {
  neutral: { bg: "#e9e6dd", fg: "#111", accent: "#6b6a65", label: "Now" },
  warn: { bg: "#2a2e33", fg: "#f7efe0", accent: "#e0a94e", label: "Alert" },
  critical: { bg: "#7a0f1e", fg: "#fff3ef", accent: "#ffd6c7", label: "Crisis" },
};

export default function TickerStrip({ items, tone }: Props) {
  const s = TONE_STYLES[tone];
  return (
    <div
      className="ticker-strip"
      style={{
        margin: "0 -20px",
        background: s.bg,
        color: s.fg,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        overflow: "hidden",
        fontSize: 12.5,
        letterSpacing: "0.04em",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          fontSize: 10,
          fontWeight: 800,
          background: s.accent,
          color: s.bg,
          padding: "3px 8px",
          borderRadius: 2,
        }}
      >
        {s.label}
      </span>
      <div style={{ display: "flex", gap: 28, overflowX: "auto", scrollbarWidth: "none", whiteSpace: "nowrap", flex: 1 }}>
        {items.map((it, i) => (
          <span key={i} style={{ fontVariantNumeric: "tabular-nums" }}>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
