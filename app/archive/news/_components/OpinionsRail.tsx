import type { Story } from "@/lib/stories";
import { TONE_BG } from "@/lib/stories";

export default function OpinionsRail({ opinions }: { opinions: Story[] }) {
  return (
    <aside className="opinions-rail">
      <div className="flex items-baseline justify-between" style={{ marginBottom: 12 }}>
        <h3 className="news-serif italic" style={{ fontSize: 22, margin: 0 }}>
          Opinions
        </h3>
        <a href="#" className="news-meta">More ›</a>
      </div>
      <div className="flex flex-col">
        {opinions.map((op, i) => (
          <div
            key={op.id}
            className="flex gap-3 items-start"
            style={{
              padding: "14px 0",
              borderTop: i === 0 ? "1px solid var(--ink)" : "1px solid var(--rule)",
            }}
          >
            <div
              className="news-image ratio-avatar shrink-0"
              style={{
                backgroundColor:
                  op.tone && op.tone !== "none" ? TONE_BG[op.tone] : "#bfbcb4",
                backgroundImage: `url("https://i.pravatar.cc/128?u=${encodeURIComponent(op.id)}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              aria-hidden
            />
            <div className="min-w-0">
              {op.kicker && (
                <div className="news-kicker" style={{ marginBottom: 4 }}>
                  {op.kicker}
                </div>
              )}
              <h4
                className="news-serif italic"
                style={{ fontSize: 16, lineHeight: 1.25, margin: 0 }}
              >
                {op.headline}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
