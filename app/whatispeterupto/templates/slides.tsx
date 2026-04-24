"use client";

import type { ComponentType } from "react";
import {
  TextImageSlide,
  TileColor,
} from "../components/slides/text-image/TextImageSlide";
import { IntroTemplate } from "./components/IntroTemplate";
import { ThreeUpTemplate } from "./components/ThreeUpTemplate";
import { TimelineSample } from "./sample/TimelineSample";

const LIPSUM_MED =
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";
const LIPSUM_LONG =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

/* Each slide component renders template content only. Outer layout
   (full-viewport container, optional label) is provided by the parent
   — SlideWrapper on the sample page, PreviewShell on the preview route. */

export function IntroSlide() {
  return (
    <IntroTemplate
      emoji="🍫"
      greeting={<>Hi, I&apos;m</>}
      name="Lorem Ipsum."
      note="Consectetur adipiscing elit — sed do eiusmod tempor."
    />
  );
}

export function QuoteSlide() {
  return (
    <p className="wipu-sample-quote">
      &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit.&rdquo;
      <span className="wipu-sample-quote-attr">— Lorem Ipsum, 2026</span>
    </p>
  );
}

export function InfoSlide() {
  return (
    <div className="wipu-sample-info-grid">
      <div>
        <h2 className="wipu-sample-info-title">
          Consectetur adipiscing elit, sed do eiusmod.
        </h2>
        <p className="wipu-sample-info-kicker">
          Ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="wipu-sample-info-body">
        <p>{LIPSUM_MED}</p>
        <p>{LIPSUM_LONG}</p>
      </div>
    </div>
  );
}

export function ThreeUpSlide() {
  return (
    <ThreeUpTemplate
      blocks={[
        { eyebrow: "Lorem 01", title: "Ipsum dolor", body: LIPSUM_MED },
        { eyebrow: "Lorem 02", title: "Sit amet", body: LIPSUM_MED },
        { eyebrow: "Lorem 03", title: "Consectetur", body: LIPSUM_MED },
      ]}
    />
  );
}

export function MediaLeftSlide() {
  return (
    <TextImageSlide
      side="right"
      eyebrow="Lorem · 05"
      title={<>Ipsum dolor sit amet consectetur.</>}
      subtitle="Adipiscing elit — sed do eiusmod tempor incididunt."
    >
      <div className="wipu-ti-cluster wipu-ti-cluster-b">
        <TileColor tone="rose" />
        <TileColor tone="terracotta" />
      </div>
    </TextImageSlide>
  );
}

export function MediaRightSlide() {
  return (
    <TextImageSlide
      side="left"
      eyebrow="Lorem · 06"
      title={<>Tempor incididunt ut labore et dolore.</>}
      subtitle="Magna aliqua — ut enim ad minim veniam."
    >
      <div className="wipu-ti-cluster wipu-ti-cluster-c">
        <TileColor tone="mint" />
        <TileColor tone="mustard" />
        <TileColor tone="navy" />
      </div>
    </TextImageSlide>
  );
}

export function TimelineSlide() {
  return <TimelineSample />;
}

export function DesignExplorationsSlide() {
  const tints = [
    "terracotta",
    "mint",
    "mustard",
    "rose",
    "navy",
    "terracotta",
    "mustard",
    "mint",
    "rose",
  ] as const;
  return (
    <div className="wipu-sample-explore">
      {tints.map((tint, i) => (
        <div
          key={i}
          className="wipu-sample-explore-tile"
          data-tint={tint}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function HeroMetricSlide() {
  return (
    <div className="wipu-sample-heroMetric">
      <span className="wipu-sample-heroMetric-n">42M</span>
      <div className="wipu-sample-heroMetric-lbl">
        Lorem ipsum dolor sit amet
      </div>
      <p className="wipu-sample-heroMetric-note">{LIPSUM_MED}</p>
    </div>
  );
}

export function MetricsCollectionSlide() {
  const metrics = [
    { n: "42M", lbl: "Lorem ipsum dolor", tone: "terracotta" as const },
    { n: "3.2×", lbl: "Sit amet consectetur", tone: "mint" as const },
    { n: "98%", lbl: "Adipiscing elit tempor", tone: "mustard" as const },
  ];
  return (
    <div className="wipu-sample-metrics">
      <h2 className="wipu-sample-metrics-title">
        Consectetur adipiscing elit.
      </h2>
      {metrics.map((m) => (
        <div key={m.n}>
          <span className="wipu-sample-metric-n" data-tone={m.tone}>
            {m.n}
          </span>
          <div className="wipu-sample-metric-lbl">{m.lbl}</div>
        </div>
      ))}
    </div>
  );
}

export function PrototypeSlide() {
  return (
    <div className="wipu-sample-proto-frame">
      <iframe
        src="/prototypes/voice-chat"
        title="Voice chat prototype"
        className="wipu-sample-proto-iframe"
        loading="lazy"
        allow="autoplay; encrypted-media"
      />
    </div>
  );
}

export function ArchiveGallerySlide() {
  return (
    <div className="wipu-sample-archive">
      <button type="button" className="wipu-sample-archive-trigger">
        <span className="wipu-sample-archive-icon" aria-hidden>
          📁
        </span>
        <span className="wipu-sample-archive-lbl">Lorem archive</span>
      </button>
      <p className="wipu-sample-archive-caption">
        Click expands to a draggable canvas of tiles (mock — no expansion on
        this sample).
      </p>
    </div>
  );
}

/* Slide slugs that render as a full custom section (no SlideWrapper /
   PreviewShell centering — they manage their own viewport). */
export const SELF_CONTAINED = new Set(["07"]);

export const BY_SLUG: Record<string, ComponentType> = {
  "01": IntroSlide,
  "02": QuoteSlide,
  "03": InfoSlide,
  "04": ThreeUpSlide,
  "05": MediaLeftSlide,
  "06": MediaRightSlide,
  "07": TimelineSlide,
  "08": DesignExplorationsSlide,
  "09": HeroMetricSlide,
  "10": MetricsCollectionSlide,
  "11": PrototypeSlide,
  "12": ArchiveGallerySlide,
};
