import { getStories } from "@/lib/corpus";

type Props = { title: string; storyIds: string[] };

export default function BriefsList({ title, storyIds }: Props) {
  const briefs = getStories(storyIds);
  return (
    <section
      style={{
        borderTop: "2px solid var(--ink)",
        paddingTop: 20,
        paddingBottom: 40,
        marginTop: 16,
      }}
    >
      <div className="flex items-baseline justify-between" style={{ marginBottom: 18 }}>
        <h2 className="news-section-label">{title}</h2>
        <span className="news-meta">Short reads</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "18px 28px",
        }}
      >
        {briefs.map((b) => (
          <article key={b.id} style={{ paddingTop: 4 }}>
            {b.kicker && <div className="news-kicker" style={{ marginBottom: 6 }}>{b.kicker}</div>}
            <h3 className="news-serif" style={{ fontSize: 16, lineHeight: 1.25, margin: 0 }}>
              {b.headline}
            </h3>
            {b.meta && <p className="news-meta" style={{ marginTop: 6 }}>{b.meta}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
