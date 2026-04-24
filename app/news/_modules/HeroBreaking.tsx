import { getStory, getStories } from "@/lib/corpus";

type Props = {
  ledeId: string;
  secondaryIds: string[];
  updates?: { time: string; text: string }[];
};

export default function HeroBreaking({ ledeId, secondaryIds, updates }: Props) {
  const lede = getStory(ledeId);
  const secondary = getStories(secondaryIds);

  return (
    <section className="hero-breaking" style={{ margin: "16px -20px 36px", padding: "28px 20px 32px", background: "#13151a", color: "#f2f2f2" }}>
      <div className="news-container" style={{ padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className="news-live-dot" style={{ background: "#e44457" }} />
          <span style={{ textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 11, fontWeight: 700, color: "#e44457" }}>
            Live · Breaking news
          </span>
        </div>

        <div className="hb-grid">
          <div className="hb-lede">
            <h1 className="news-serif" style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02, margin: 0, color: "#f8f8f8" }}>
              {lede.headline}
            </h1>
            {lede.dek && (
              <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.45, color: "#d3d4d6", maxWidth: "52ch" }}>
                {lede.dek}
              </p>
            )}
            {lede.byline && (
              <p style={{ marginTop: 14, fontSize: 12, color: "#8c8f94", letterSpacing: "0.02em" }}>
                {lede.byline}
              </p>
            )}
          </div>

          <div className="hb-secondaries">
            {secondary.map((s, i) => (
              <div
                key={s.id}
                style={{
                  paddingTop: i === 0 ? 0 : 14,
                  marginTop: i === 0 ? 0 : 14,
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div style={{ color: "#f2f2f2" }}>
                  <h3 className="news-serif" style={{ fontSize: 18, lineHeight: 1.2, margin: 0 }}>
                    {s.headline}
                  </h3>
                  {s.dek && <p style={{ fontSize: 13.5, color: "#c4c6c9", marginTop: 6, lineHeight: 1.45 }}>{s.dek}</p>}
                  {s.bullets && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0" }}>
                      {s.bullets.map((b) => (
                        <li key={b} style={{ position: "relative", paddingLeft: 14, fontSize: 13, color: "#c4c6c9", marginTop: 5, lineHeight: 1.45 }}>
                          <span style={{ position: "absolute", left: 0, top: 9, width: 8, height: 1, background: "#8c8f94" }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {updates && updates.length > 0 && (
          <div className="hb-updates" style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 16 }}>
            <div style={{ textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 10, fontWeight: 700, color: "#a4a7ac", marginBottom: 10 }}>
              Latest updates
            </div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {updates.map((u) => (
                <div key={u.time + u.text} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 11, color: "#8c8f94", minWidth: 42 }}>
                    {u.time}
                  </span>
                  <span style={{ fontSize: 13.5, color: "#e8e9eb", lineHeight: 1.4 }}>
                    {u.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hb-grid { display: grid; gap: 28px; grid-template-columns: 1fr; }
        @media (min-width: 900px) {
          .hb-grid { grid-template-columns: 2fr 1fr; gap: 40px; }
          .hb-secondaries { border-left: 1px solid rgba(255,255,255,0.18); padding-left: 24px; }
        }
      `}</style>
    </section>
  );
}
