import type { Story, Tone } from "@/lib/stories";
import { TONE_BG } from "@/lib/stories";

type Props = {
  story: Story;
  withImage?: boolean;
  imageRatio?: "wide" | "portrait" | "square";
  className?: string;
};

const HEADLINE_SIZE: Record<Story["size"], string> = {
  lede: "clamp(30px, 3.4vw, 44px)",
  large: "clamp(22px, 2.2vw, 30px)",
  medium: "20px",
  small: "17px",
  text: "15px",
};

function toneBg(tone?: Tone) {
  if (!tone || tone === "none") return undefined;
  return TONE_BG[tone];
}

export default function StoryCard({
  story,
  withImage,
  imageRatio = "wide",
  className,
}: Props) {
  const showImage =
    withImage ?? (story.size === "lede" || story.size === "large");
  const bg = toneBg(story.tone);

  return (
    <article className={className}>
      {showImage && (() => {
        const dims =
          imageRatio === "portrait"
            ? [900, 1125]
            : imageRatio === "square"
            ? [900, 900]
            : [1200, 750];
        const src = `https://picsum.photos/seed/${encodeURIComponent(story.id)}/${dims[0]}/${dims[1]}`;
        return (
          <div
            className={`news-image ratio-${imageRatio}`}
            style={{
              backgroundColor: bg ?? "#d3d0c8",
              backgroundImage: `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: 12,
            }}
            aria-hidden
          />
        );
      })()}

      {story.kicker && (
        <div className={`news-kicker ${story.live ? "accent" : ""}`} style={{ marginBottom: 6 }}>
          {story.live && <span className="news-live-dot" />}
          {story.kicker}
        </div>
      )}

      <h2
        className="news-serif"
        style={{
          fontSize: HEADLINE_SIZE[story.size],
          lineHeight: story.size === "lede" ? 1.02 : 1.15,
          margin: 0,
        }}
      >
        {story.headline}
      </h2>

      {story.dek && <p className="news-dek" style={{ marginTop: 8 }}>{story.dek}</p>}

      {story.bullets && (
        <ul className="news-bullets">
          {story.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      {(story.byline || story.meta) && (
        <p className="news-meta" style={{ marginTop: 10 }}>
          {story.byline}
          {story.byline && story.meta ? " · " : ""}
          {story.meta}
        </p>
      )}

      {story.subStories && story.subStories.length > 0 && (
        <div className="news-sub">
          {story.subStories.map((s) => (
            <StoryCard key={s.id} story={s} withImage={false} />
          ))}
        </div>
      )}
    </article>
  );
}
