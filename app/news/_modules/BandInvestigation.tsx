import { getStory } from "@/lib/corpus";
import { TONE_BG } from "@/lib/stories";

type Props = { title: string; storyId: string };

export default function BandInvestigation({ title, storyId }: Props) {
  const story = getStory(storyId);
  const bg =
    story.tone && story.tone !== "none" ? TONE_BG[story.tone] : "#3a3d42";

  return (
    <section
      style={{
        margin: "16px -20px 36px",
        padding: "0",
        background: "#171717",
        color: "#f1ece3",
        border: "1px solid #1f1f1f",
      }}
    >
      <div className="news-container" style={{ padding: "28px 20px" }}>
        <div
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontSize: 11,
            fontWeight: 700,
            color: "#c8a877",
            marginBottom: 18,
          }}
        >
          {title}
        </div>

        <div className="bi-grid">
          <div
            className="bi-image"
            style={{
              backgroundColor: bg,
              backgroundImage: `url("https://picsum.photos/seed/${encodeURIComponent(story.id)}/900/1100")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: "5 / 6",
              width: "100%",
            }}
            aria-hidden
          />
          <div className="bi-body">
            {story.kicker && (
              <div className="news-kicker" style={{ color: "#c8a877", marginBottom: 10 }}>
                {story.kicker}
              </div>
            )}
            <h2
              className="news-serif"
              style={{
                fontSize: "clamp(30px, 3.4vw, 48px)",
                lineHeight: 1.04,
                margin: 0,
                color: "#f7f2e8",
              }}
            >
              {story.headline}
            </h2>
            {story.dek && (
              <p className="news-serif italic" style={{ marginTop: 16, fontSize: 19, lineHeight: 1.4, color: "#d6cfc0", maxWidth: "48ch" }}>
                {story.dek}
              </p>
            )}
            {story.bullets && (
              <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0 0" }}>
                {story.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      position: "relative",
                      paddingLeft: 20,
                      fontSize: 14.5,
                      color: "#e3dcca",
                      marginTop: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, top: 11, width: 12, height: 1, background: "#c8a877" }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {story.byline && (
              <p style={{ marginTop: 18, fontSize: 12, color: "#a09b8d", letterSpacing: "0.02em" }}>
                {story.byline}
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bi-grid { display: grid; gap: 28px; grid-template-columns: 1fr; }
        @media (min-width: 900px) {
          .bi-grid { grid-template-columns: 1.1fr 1.4fr; gap: 40px; align-items: center; }
        }
      `}</style>
    </section>
  );
}
