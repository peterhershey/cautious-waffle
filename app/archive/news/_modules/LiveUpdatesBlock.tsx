type Props = {
  title: string;
  items: { time: string; text: string; emphasis?: boolean }[];
};

export default function LiveUpdatesBlock({ title, items }: Props) {
  return (
    <section
      className="live-updates"
      style={{
        borderTop: "2px solid var(--ink)",
        paddingTop: 20,
        paddingBottom: 40,
        marginTop: 16,
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 18 }}>
        <h2 className="news-section-label">
          <span className="news-live-dot" />
          {title}
        </h2>
        <span className="news-meta">Live · updating</span>
      </div>

      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          borderLeft: "2px solid var(--rule-strong)",
          paddingLeft: 20,
        }}
      >
        {items.map((u) => (
          <li
            key={u.time + u.text}
            style={{
              position: "relative",
              padding: "12px 0 12px 0",
              borderTop: "1px solid var(--rule)",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: -27,
                top: 18,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: u.emphasis ? "var(--accent)" : "var(--ink)",
                border: "2px solid var(--paper)",
              }}
            />
            <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
              <span
                style={{
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 12,
                  color: "var(--muted)",
                  letterSpacing: "0.04em",
                  minWidth: 48,
                }}
              >
                {u.time}
              </span>
              <span
                className="news-serif"
                style={{
                  fontSize: u.emphasis ? 20 : 17,
                  lineHeight: 1.25,
                  color: "var(--ink)",
                  flex: 1,
                }}
              >
                {u.text}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
