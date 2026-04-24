import StoryCard from "../_components/StoryCard";
import OpinionsRail from "../_components/OpinionsRail";
import { getStory, getStories } from "@/lib/corpus";

type Props = { ledeId: string; secondaryIds: string[]; opinionIds: string[] };

export default function HeroStandard({ ledeId, secondaryIds, opinionIds }: Props) {
  const lede = getStory(ledeId);
  const secondary = getStories(secondaryIds);
  const opinions = getStories(opinionIds);

  return (
    <section className="hero-row" style={{ padding: "28px 0 36px" }}>
      <div className="hero-grid">
        <div className="hero-secondary">
          {secondary.map((s, i) => (
            <div
              key={s.id}
              style={{
                paddingTop: i === 0 ? 0 : 16,
                marginTop: i === 0 ? 0 : 16,
                borderTop: i === 0 ? "none" : "1px solid var(--rule)",
              }}
            >
              <StoryCard story={s} withImage={false} />
            </div>
          ))}
        </div>

        <div className="hero-lede">
          <StoryCard story={lede} withImage imageRatio="wide" />
        </div>

        <div className="hero-opinions">
          <OpinionsRail opinions={opinions} />
        </div>
      </div>

      <style>{`
        .hero-grid { display: grid; gap: 32px; grid-template-columns: 1fr; }
        .hero-secondary { order: 2; }
        .hero-lede { order: 1; }
        .hero-opinions { order: 3; border-top: 1px solid var(--rule); padding-top: 20px; }
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1fr 2fr 1fr; gap: 36px; }
          .hero-secondary { order: 1; border-right: 1px solid var(--rule); padding-right: 28px; }
          .hero-lede { order: 2; }
          .hero-opinions { order: 3; border-top: none; padding-top: 0; border-left: 1px solid var(--rule); padding-left: 28px; }
        }
      `}</style>
    </section>
  );
}
