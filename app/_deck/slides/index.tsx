"use client";

import type { ReactNode } from "react";
import { FieldNotesSlide } from "./field-notes";
import { MediaMorphSlide, type MediaMorphMedia } from "./media-morph/MediaMorphSlide";
import { TextImageSlide } from "./text-image/TextImageSlide";
import { IntroTemplate } from "../templates/IntroTemplate";
import { StickyCardsTemplate } from "../templates/StickyCardsTemplate";
import { ThreeUpTemplate } from "../templates/ThreeUpTemplate";
import { TypeOnText } from "../templates/TypeOnText";
import { HoverGif } from "../templates/HoverGif";
import {
  hero,
  qualifications,
  aiNative,
  aiInPractice,
  empathy,
  cases,
  closer,
  fieldNotes,
} from "@/app/content";

function HeroSlide() {
  return (
    <IntroTemplate
      emoji={<HoverGif src="/portfolio%20transfer/chocolate%20emoji.gif" />}
      greeting={hero.greeting}
      name={
        <TypeOnText perCharMs={140} wordPauseMs={320}>
          {hero.name}
        </TypeOnText>
      }
      subtitle={hero.subtitle}
    />
  );
}

/* .mp4 files in `public/portfolio transfer/aiart/`. URL-encoded so
   spaces/parens survive. .MOV files excluded (Chrome HEVC support is
   unreliable). */
const AI_ART_VIDEOS: MediaMorphMedia[] = [
  "everest.mp4",
  "harrypottertrain.mp4",
  "oldman.mp4",
  "oldsf.mp4",
  "plasma_audiotest.mp4",
  "Recording 2024-05-04 233025.mp4",
  "sculpture2.0 (1).mp4",
  "sculpture2.0.mp4",
  "svd_xt_1_1-film_3x_00003.mp4",
  "svd_xt-film_3x_00013.mp4",
  "Untitled video - Made with Clipchamp (1).mp4",
  "Untitled video - Made with Clipchamp (3).mp4",
  "wayne.mp4",
].map((name) => ({
  kind: "video",
  src: `/portfolio%20transfer/aiart/${encodeURIComponent(name)}`,
}));

function AiNativeSlide() {
  return (
    <MediaMorphSlide
      side="left"
      eyebrow={aiNative.label}
      title={aiNative.title}
      subtitle={aiNative.subtitle}
      media={AI_ART_VIDEOS}
      phaseMs={4500}
    />
  );
}

function AiInPracticeSlide() {
  const [work, home, realtime] = aiInPractice.blocks;
  return (
    <ThreeUpTemplate
      blocks={[
        {
          ...work,
          image: {
            src: "/portfolio%20transfer/antigravity.jpg",
            alt: "Antigravity — Google DeepMind's agentic IDE",
          },
        },
        {
          ...home,
          image: {
            src: "/portfolio%20transfer/claude-code.webp",
            alt: "Claude Code — pixel-block logo",
            objectPosition: "left center",
          },
        },
        {
          ...realtime,
          video: {
            src: "/portfolio%20transfer/aiart/skulls.mov",
            alt: "Real-time generative AI — pop-art skulls",
          },
        },
      ]}
    />
  );
}

function EmpathySlide() {
  return (
    <TextImageSlide
      side="left"
      eyebrow={empathy.label}
      title={empathy.title}
      subtitle={empathy.subtitle}
      footer={
        <a
          className="wipu-ti-press"
          href={empathy.pressLink.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="wipu-ti-press-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio%20transfer/wapoarticle.avif"
              alt=""
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="wipu-ti-press-meta">
            <span className="wipu-ti-press-source">{empathy.pressLink.source}</span>
            <span className="wipu-ti-press-headline">
              {empathy.pressLink.headline} <span className="wipu-ti-press-arrow" aria-hidden>↗</span>
            </span>
          </div>
        </a>
      }
    >
      <div>
        <div className="wipu-ti-single">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portfolio%20transfer/travel/stp.png"
            alt={empathy.photoAlt}
            draggable={false}
          />
        </div>
        <div className="wipu-ti-single-caption">
          {empathy.photoCaption}
        </div>
      </div>
    </TextImageSlide>
  );
}

function CloserSlide() {
  return (
    <div className="wipu-tpl-intro">
      <div className="wipu-tpl-intro-emoji" aria-hidden>
        {closer.emoji}
      </div>
    </div>
  );
}

function QualificationsSlide() {
  const [previously, currently] = qualifications.blocks;
  return (
    <ThreeUpTemplate
      blocks={[
        {
          ...previously,
          image: {
            src: "/portfolio%20transfer/field%20notes/product/washington-post-homepage.gif",
            alt: "Washington Post homepage redesign",
          },
        },
        {
          ...currently,
          image: {
            src: "/portfolio%20transfer/gemini_visualoverlays_commercial_2.gif",
            alt: "Gemini Visual Overlays — what it feels like when a model can look at what you're looking at.",
          },
        },
      ]}
    />
  );
}

export type SlideDef = {
  id: string;
  label: string;
  scrollable?: boolean;
  render: () => ReactNode;
};

export const SLIDES: SlideDef[] = [
  {
    id: "hero",
    label: hero.label,
    render: () => <HeroSlide />,
  },
  {
    id: "about",
    label: qualifications.label,
    render: () => <QualificationsSlide />,
  },
  {
    id: "field-notes",
    label: fieldNotes.label,
    render: () => <FieldNotesSlide />,
  },
  {
    id: "ai-native",
    label: aiNative.label,
    render: () => <AiNativeSlide />,
  },
  {
    id: "ai-in-practice",
    label: aiInPractice.label,
    render: () => <AiInPracticeSlide />,
  },
  {
    id: "empathy",
    label: empathy.label,
    render: () => <EmpathySlide />,
  },
  {
    id: "cases",
    label: cases.label,
    render: () => (
      <StickyCardsTemplate
        eyebrow={cases.label}
        title={cases.title}
        autoReveal
        blocks={cases.blocks.map((b) => ({ ...b }))}
      />
    ),
  },
  {
    id: "closer",
    label: closer.label,
    render: () => <CloserSlide />,
  },
];
