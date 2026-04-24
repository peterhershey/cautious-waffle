import Link from "next/link";
import { HUD } from "../../components/HUD";
import { SceneBackground, SceneEffects } from "../../components/Scene";
import type {
  CaseStudyDetail,
  CaseStudyImageWell,
  CaseStudySection,
  CaseStudyStat,
  CaseStudyToneKey,
} from "../../content";
import type { ReactNode } from "react";
import { GeminiTimeline } from "./GeminiTimeline";
import { LiveVideoEmbed } from "./LiveVideoEmbed";
import { ZurichScroller } from "./ZurichScroller";

const TONE_VAR: Record<CaseStudyToneKey, string> = {
  mint: "var(--wipu-mint)",
  mustard: "var(--wipu-mustard)",
  terracotta: "var(--wipu-terracotta)",
  rose: "var(--wipu-rose)",
  navy: "var(--wipu-navy)",
  ink: "var(--wipu-ink)",
  "ink-dim": "var(--wipu-ink-dim)",
  "ink-faint": "var(--wipu-ink-faint)",
};

function CityStamp({
  city,
  stampCity,
  stampDate,
  countryCode,
}: {
  city: "nyc" | "zurich" | "mxcity";
  stampCity: string;
  stampDate: string;
  countryCode?: string;
}) {
  const arcTopId = `stamp-arc-top-${city}`;
  const arcBottomId = `stamp-arc-bottom-${city}`;
  const country =
    countryCode ??
    (city === "nyc" ? "USA · JFK" : city === "zurich" ? "CH · ZRH" : "MX · MEX");

  return (
    <div
      className={`wipu-case-stamp wipu-case-stamp-${city}`}
      aria-hidden="true"
      data-reveal
    >
      <svg
        viewBox="-90 -90 180 180"
        xmlns="http://www.w3.org/2000/svg"
        className="wipu-case-stamp-svg"
      >
        <defs>
          {/* Top arc — reads left-to-right above center */}
          <path
            id={arcTopId}
            d="M -54 -6 A 54 54 0 0 1 54 -6"
            fill="none"
          />
          {/* Bottom arc — reads left-to-right below center */}
          <path
            id={arcBottomId}
            d="M -50 10 A 50 50 0 0 0 50 10"
            fill="none"
          />
        </defs>

        {/* Outer ring */}
        <circle
          cx="0"
          cy="0"
          r="78"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-outer"
        />
        {/* Mid ring */}
        <circle
          cx="0"
          cy="0"
          r="68"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-mid"
        />
        {/* Inner ring */}
        <circle
          cx="0"
          cy="0"
          r="60"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-ring-inner"
        />

        {/* Perimeter tick marks — 12 at 30° intervals between outer and mid rings */}
        <g className="wipu-case-stamp-ticks">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-78"
              x2="0"
              y2="-69"
              pathLength="1"
              transform={`rotate(${i * 30})`}
              className="wipu-case-stamp-draw wipu-case-stamp-draw-tick"
            />
          ))}
        </g>

        {/* Top arc text — city name */}
        <text className="wipu-case-stamp-text-arc">
          <textPath href={`#${arcTopId}`} startOffset="50%" textAnchor="middle">
            {stampCity}
          </textPath>
        </text>

        {/* Star between arc and center content */}
        <path
          d="M 0 -32 L 2.3 -26.5 L 8.2 -26 L 3.7 -22 L 5.3 -16.2 L 0 -19.5 L -5.3 -16.2 L -3.7 -22 L -8.2 -26 L -2.3 -26.5 Z"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-star"
        />

        {/* Double horizontal rule above date */}
        <line
          x1="-32"
          y1="-6"
          x2="32"
          y2="-6"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
        />
        <line
          x1="-28"
          y1="-2"
          x2="28"
          y2="-2"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
        />

        {/* Date — horizontal, centered */}
        <text
          x="0"
          y="12"
          textAnchor="middle"
          className="wipu-case-stamp-text-date"
        >
          {stampDate}
        </text>

        {/* Rule below date */}
        <line
          x1="-26"
          y1="22"
          x2="26"
          y2="22"
          pathLength="1"
          className="wipu-case-stamp-draw wipu-case-stamp-draw-rule"
        />

        {/* Small airplane glyph bottom-center */}
        <g
          transform="translate(0 38)"
          className="wipu-case-stamp-plane-group"
        >
          <path
            d="M -11 0 L 11 0 M -9 -3 L 9 -3 L 6 0 L 9 3 L -9 3 L -6 0 Z M 0 -6 L 0 6"
            pathLength="1"
            className="wipu-case-stamp-draw wipu-case-stamp-draw-plane"
          />
        </g>

        {/* Bottom arc text — country / airport code */}
        <text className="wipu-case-stamp-text-arc wipu-case-stamp-text-arc-bottom">
          <textPath
            href={`#${arcBottomId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {country}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

function InlineEmphasis({ text }: { text: string }) {
  // Render a short allowlist: <em>...</em> for blue-underline emphasis.
  // Splits on <em>/</em> tags and wraps the inside in a real <em>.
  const parts = text.split(/(<em>.*?<\/em>)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^<em>(.*)<\/em>$/);
        if (m) return <em key={i}>{m[1]}</em>;
        // Preserve newlines as line breaks.
        return part.split("\n").map((seg, j, arr) => (
          <span key={`${i}-${j}`}>
            {seg}
            {j < arr.length - 1 ? <br /> : null}
          </span>
        ));
      })}
    </>
  );
}

function ImageWell({ well }: { well: CaseStudyImageWell }) {
  const aspect = well.aspect ?? "wide";
  return (
    <div
      className={`wipu-case-image-well is-${aspect}`}
      aria-hidden="true"
      role="presentation"
    >
      <span className="wipu-case-image-well-glyph">◻</span>
      <span className="wipu-case-image-well-caption">{well.caption}</span>
    </div>
  );
}

function StatBlock({ stat }: { stat: CaseStudyStat }) {
  return (
    <div className="wipu-pullnum">
      <span
        className="wipu-pullnum-n"
        style={{ color: TONE_VAR[stat.tone] }}
      >
        {stat.value}
      </span>
      <span className="wipu-pullnum-lbl">{stat.label}</span>
    </div>
  );
}

function ProseSection({
  section,
}: {
  section: Extract<CaseStudySection, { kind: "prose" }>;
}) {
  return (
    <section className="wipu-slide">
      <span
        className="wipu-slide-label"
        style={{ color: TONE_VAR[section.labelTone] }}
      >
        {section.label}
      </span>
      <div className="wipu-slide-inner">
        <div className="wipu-layout-twocol">
          <div>
            <h2 className="wipu-longform-title">
              <InlineEmphasis text={section.title} />
            </h2>
            {section.kicker ? (
              <p className="wipu-longform-kicker">{section.kicker}</p>
            ) : null}
          </div>
          <div className="wipu-longform-body">
            {section.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {section.stats && section.stats.length > 0 ? (
          <div className="wipu-case-statrow">
            {section.stats.map((s, i) => (
              <StatBlock key={i} stat={s} />
            ))}
          </div>
        ) : null}

        {section.imageWell ? <ImageWell well={section.imageWell} /> : null}
      </div>
    </section>
  );
}

function ActSection({
  section,
  slotAfterBody,
  imageOverride,
}: {
  section: Extract<CaseStudySection, { kind: "act" }>;
  slotAfterBody?: ReactNode;
  imageOverride?: ReactNode;
}) {
  return (
    <section className={`wipu-slide wipu-slide-${section.tone}`}>
      <span className="wipu-slide-label">{section.label}</span>
      {section.city && section.stamp ? (
        <CityStamp
          city={section.city}
          stampCity={section.stamp.city}
          stampDate={section.stamp.date}
        />
      ) : null}
      <div className="wipu-slide-inner">
        <div className="wipu-case-act-inner">
          <div className="wipu-case-act-head">
            <p className="wipu-case-actnum">{section.act}</p>
            <h2 className="wipu-case-act-title">{section.title}</h2>
            <p className="wipu-case-act-setup">{section.setup}</p>
          </div>
          <div className="wipu-case-act-body">
            {section.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {slotAfterBody}

        {section.pullQuote ? (
          <p className="wipu-case-pullquote">
            <InlineEmphasis text={section.pullQuote} />
          </p>
        ) : null}

        {imageOverride ??
          (section.imageWell ? <ImageWell well={section.imageWell} /> : null)}
      </div>
    </section>
  );
}

function ImpactSection({
  section,
}: {
  section: Extract<CaseStudySection, { kind: "impact" }>;
}) {
  return (
    <section className="wipu-slide">
      <span
        className="wipu-slide-label"
        style={{ color: TONE_VAR[section.labelTone] }}
      >
        {section.label}
      </span>
      <div className="wipu-slide-inner">
        <h2 className="wipu-longform-title" style={{ marginBottom: 48 }}>
          <InlineEmphasis text={section.title} />
        </h2>

        <div className="wipu-case-impactgrid">
          {section.stats.map((s, i) => (
            <StatBlock key={i} stat={s} />
          ))}
        </div>

        <div className="wipu-case-pressgrid">
          {section.pressQuotes.map((q, i) => (
            <div
              key={i}
              className={`wipu-case-press wipu-tone-${q.tone}`}
            >
              <p className="wipu-case-press-quote">
                <InlineEmphasis text={`"${q.quote}"`} />
              </p>
              <p className="wipu-case-press-attribution">— {q.attribution}</p>
            </div>
          ))}
        </div>

        {section.notes && section.notes.length > 0 ? (
          <ul className="wipu-case-notes">
            {section.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        ) : null}

        {section.honest ? (
          <p className="wipu-case-honest">{section.honest}</p>
        ) : null}
      </div>
    </section>
  );
}

function ReflectionsSection({
  section,
}: {
  section: Extract<CaseStudySection, { kind: "reflections" }>;
}) {
  return (
    <section className="wipu-slide">
      <span
        className="wipu-slide-label"
        style={{ color: TONE_VAR[section.labelTone] }}
      >
        {section.label}
      </span>
      <div className="wipu-slide-inner">
        <h2 className="wipu-longform-title">
          <InlineEmphasis text={section.title} />
        </h2>

        <ol className="wipu-case-reflections">
          {section.items.map((item, i) => (
            <li key={i} className="wipu-case-reflection">
              <span className="wipu-case-reflection-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="wipu-case-reflection-heading">
                  {item.heading}
                </h3>
                <p className="wipu-case-reflection-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CaseSection({ section }: { section: CaseStudySection }) {
  switch (section.kind) {
    case "prose":
      return <ProseSection section={section} />;
    case "act":
      return <ActSection section={section} />;
    case "impact":
      return <ImpactSection section={section} />;
    case "reflections":
      return <ReflectionsSection section={section} />;
  }
}

function CaseHero({
  hero,
  meta,
}: {
  hero: CaseStudyDetail["hero"];
  meta: CaseStudyDetail["meta"];
}) {
  return (
    <section className="wipu-slide">
      <span
        className="wipu-slide-label"
        style={{ color: "var(--wipu-ink-faint)" }}
      >
        {hero.kicker}
      </span>
      <div className="wipu-slide-inner wipu-case-hero">
        {hero.glyphs && hero.glyphs.length > 0 ? (
          <p
            className="wipu-case-hero-glyphs"
            aria-hidden="true"
            data-reveal
          >
            {hero.glyphs.map((g, i) => (
              <span key={i} className="wipu-case-hero-glyph">
                {g}
              </span>
            ))}
          </p>
        ) : null}
        <h1 className="wipu-case-hero-title" data-reveal data-reveal-delay="1">
          <InlineEmphasis text={hero.title} />
        </h1>
        <p
          className="wipu-case-hero-subtitle"
          data-reveal
          data-reveal-delay="2"
        >
          {hero.subtitle}
        </p>

        <div className="wipu-case-meta">
          <div className="wipu-case-meta-col">
            <span className="wipu-case-meta-label">Role</span>
            <span className="wipu-case-meta-value">{meta.role}</span>
          </div>
          <div className="wipu-case-meta-col">
            <span className="wipu-case-meta-label">Team</span>
            <span className="wipu-case-meta-value">{meta.team}</span>
          </div>
          <div className="wipu-case-meta-col">
            <span className="wipu-case-meta-label">Shipped</span>
            <span className="wipu-case-meta-value">{meta.shipped}</span>
          </div>
          <div className="wipu-case-meta-col">
            <span className="wipu-case-meta-label">Platforms</span>
            <span className="wipu-case-meta-value">{meta.platforms}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudyView({ detail }: { detail: CaseStudyDetail }) {
  return (
    <>
      <a href="#main" className="wipu-skip">
        Skip to content
      </a>
      <SceneBackground />
      <SceneEffects />
      <HUD />
      <main id="main" className="wipu-main">
        <CaseHero hero={detail.hero} meta={detail.meta} />
        {detail.slug === "teaching-gemini-to-see" ? <GeminiTimeline /> : null}
        {detail.sections.map((s, i) => {
          const isZurich =
            detail.slug === "teaching-gemini-to-see" &&
            s.kind === "act" &&
            s.city === "zurich";
          if (isZurich && s.kind === "act") {
            return (
              <ActSection
                key={i}
                section={s}
                slotAfterBody={<ZurichScroller />}
                imageOverride={<LiveVideoEmbed />}
              />
            );
          }
          return <CaseSection key={i} section={s} />;
        })}
        <footer className="wipu-case-footer">
          <Link href="/whatispeterupto" className="wipu-case-back">
            ← Back to what Peter is up to
          </Link>
        </footer>
      </main>
    </>
  );
}
