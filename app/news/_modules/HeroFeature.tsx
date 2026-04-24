import StoryCard from "../_components/StoryCard";
import OpinionsRail from "../_components/OpinionsRail";
import { getStory, getStories } from "@/lib/corpus";

type Props = { featureId: string; briefIds: string[]; opinionIds: string[] };

export default function HeroFeature({ featureId, briefIds, opinionIds }: Props) {
  const feature = getStory(featureId);
  const briefs = getStories(briefIds);
  const opinions = getStories(opinionIds);

  return (
    <section className="hero-feature" style={{ padding: "28px 0 40px" }}>
      <div className="hf-grid">
        <div className="hf-main">
          <StoryCard story={feature} withImage imageRatio="wide" />
        </div>
        <div className="hf-side">
          <div className="news-kicker" style={{ marginBottom: 12 }}>
            Morning Briefing
          </div>
          {briefs.map((b, i) => (
            <div
              key={b.id}
              style={{
                paddingTop: i === 0 ? 0 : 14,
                marginTop: i === 0 ? 0 : 14,
                borderTop: i === 0 ? "none" : "1px solid var(--rule)",
              }}
            >
              <StoryCard story={b} withImage={false} />
            </div>
          ))}
        </div>
        <div className="hf-rail">
          <OpinionsRail opinions={opinions} />
        </div>
      </div>

      <style>{`
        .hf-grid { display: grid; gap: 32px; grid-template-columns: 1fr; }
        .hf-main { order: 1; }
        .hf-side { order: 2; }
        .hf-rail { order: 3; border-top: 1px solid var(--rule); padding-top: 20px; }
        @media (min-width: 900px) {
          .hf-grid { grid-template-columns: 2.2fr 1fr 1fr; gap: 36px; }
          .hf-side { border-left: 1px solid var(--rule); padding-left: 28px; }
          .hf-rail { border-top: none; padding-top: 0; border-left: 1px solid var(--rule); padding-left: 28px; }
        }
      `}</style>
    </section>
  );
}
