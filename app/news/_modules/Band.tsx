import StoryCard from "../_components/StoryCard";
import { getStory, getStories } from "@/lib/corpus";

type Props = {
  title: string;
  variant: "wide" | "split" | "list";
  leadId: string;
  secondaryIds: string[];
  tailIds: string[];
};

export default function Band({ title, variant, leadId, secondaryIds, tailIds }: Props) {
  const lead = getStory(leadId);
  const secondaries = getStories(secondaryIds);
  const tail = getStories(tailIds);

  return (
    <section
      className="section-band"
      style={{
        borderTop: "2px solid var(--ink)",
        paddingTop: 20,
        paddingBottom: 40,
        marginTop: 16,
      }}
    >
      <div className="band-head flex items-baseline justify-between" style={{ marginBottom: 20 }}>
        <h2 className="news-section-label">{title}</h2>
        <a href="#" className="news-meta">All {title} ›</a>
      </div>

      <div className={`band-grid variant-${variant}`}>
        <div className="band-lead">
          <StoryCard
            story={lead}
            withImage
            imageRatio={variant === "split" ? "portrait" : "wide"}
          />
        </div>

        <div className="band-secondaries">
          {secondaries.map((s, i) => (
            <div
              key={s.id}
              style={{
                paddingTop: i === 0 ? 0 : 14,
                marginTop: i === 0 ? 0 : 14,
                borderTop: i === 0 ? "none" : "1px solid var(--rule)",
              }}
            >
              <StoryCard story={s} withImage={s.size === "medium"} imageRatio="wide" />
            </div>
          ))}
        </div>

        {tail.length > 0 && (
          <div className="band-tail">
            <div className="news-kicker" style={{ marginBottom: 10 }}>
              More in {title}
            </div>
            {tail.map((s, i) => (
              <div
                key={s.id}
                style={{
                  paddingTop: i === 0 ? 0 : 10,
                  marginTop: i === 0 ? 0 : 10,
                  borderTop: i === 0 ? "none" : "1px solid var(--rule)",
                }}
              >
                <StoryCard story={s} withImage={false} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .band-grid { display: grid; gap: 28px; grid-template-columns: 1fr; }
        @media (min-width: 720px) {
          .band-grid { grid-template-columns: 1fr 1fr; }
          .band-tail { grid-column: 1 / -1; border-top: 1px solid var(--rule); padding-top: 18px; }
        }
        @media (min-width: 1024px) {
          .band-grid.variant-wide { grid-template-columns: 2fr 1.2fr 1fr; }
          .band-grid.variant-wide .band-tail { grid-column: auto; border-top: none; padding-top: 0; padding-left: 24px; border-left: 1px solid var(--rule); }
          .band-grid.variant-split { grid-template-columns: 1.2fr 1.6fr 1fr; }
          .band-grid.variant-split .band-tail { grid-column: auto; border-top: none; padding-top: 0; padding-left: 24px; border-left: 1px solid var(--rule); }
          .band-grid.variant-list { grid-template-columns: 2fr 1fr 1fr; }
          .band-grid.variant-list .band-tail { grid-column: auto; border-top: none; padding-top: 0; padding-left: 24px; border-left: 1px solid var(--rule); }
          .band-secondaries { border-left: 1px solid var(--rule); padding-left: 24px; }
        }
      `}</style>
    </section>
  );
}
