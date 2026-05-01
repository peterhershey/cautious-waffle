"use client";

import type { ReactNode } from "react";
import { FieldNotesSlide } from "./field-notes";
import { MediaMorphSlide, type MediaMorphMedia } from "./media-morph/MediaMorphSlide";
import { MovieEmbedSlide } from "./movie-embed/MovieEmbedSlide";
import {
  TextImageSlide,
  TileColor,
  TileImage,
} from "./text-image/TextImageSlide";
import { IntroTemplate } from "../templates/IntroTemplate";
import { QuoteTemplate } from "../templates/QuoteTemplate";
import { StickyCardsTemplate } from "../templates/StickyCardsTemplate";
import { ThreeUpTemplate } from "../templates/ThreeUpTemplate";

function HeroSlide() {
  return (
    <IntroTemplate
      emoji="🍫"
      greeting={<>Hi, I&rsquo;m</>}
      name="Peter Hershey."
      note="No relation to the candy company."
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
      eyebrow="AI-NATIVE · 04"
      title={<>AI native by default.</>}
      subtitle="Always reaching for the next tool that changes the work — not just the workflow."
      media={AI_ART_VIDEOS}
      phaseMs={4500}
    />
  );
}

function AiInPracticeSlide() {
  return (
    <>
    <ThreeUpTemplate
      blocks={[
        {
          eyebrow: "AT WORK",
          title: "Google DeepMind",
          body: "Designing the multimodal future of Gemini — Live Video, Visual Overlays, and the input framework underneath them all.",
          image: {
            src: "/portfolio%20transfer/antigravity.jpg",
            alt: "Antigravity — Google DeepMind's agentic IDE",
          },
        },
        {
          eyebrow: "AT HOME",
          title: "Coding",
          body: "Building with Claude Code — prototypes, weird tools, this site. Code my way to the answer instead of wireframing it.",
          image: {
            src: "/portfolio%20transfer/claude-code.webp",
            alt: "Claude Code — pixel-block logo",
            objectPosition: "left center",
          },
        },
        {
          eyebrow: "REAL-TIME · GENERATIVE",
          title: "TouchDesigner",
          body: "Generative AI as a creative material — interactive scenes, audio-reactive visuals, things that respond to a room.",
          video: {
            src: "/portfolio%20transfer/aiart/skulls.mov",
            alt: "Real-time generative AI — pop-art skulls",
          },
        },
      ]}
    />
      {/* Goal-template-style callout above the rightmost (TouchDesigner)
          tile, with a Manhattan leader dropping down into the image. */}
      <div
        className="wipu-anno-callout"
        style={{
          position: "absolute",
          top: "6vh",
          right: "6vw",
          width: "clamp(220px, 22vw, 300px)",
        }}
        aria-hidden
      >
        Exhibited at Noisebridge & The Gray Area
      </div>
      <svg
        className="wipu-anno-callout-svg"
        style={{
          position: "absolute",
          top: "calc(6vh + 88px)",
          right: "6vw",
          width: 300,
          height: 80,
        }}
        viewBox="0 0 300 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <marker
            id="wipu-anno-callout-arrow-aip"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d="M 106 4 V 36 H 70 V 76"
          markerEnd="url(#wipu-anno-callout-arrow-aip)"
        />
      </svg>
    </>
  );
}

function QualificationsSlide() {
  return (
    <div className="wipu-quals">
      <div className="wipu-quals-blocks">
        <div className="wipu-quals-block">
          <div className="wipu-quals-eyebrow">Currently</div>
          <div className="wipu-quals-title">Senior AI Product Designer</div>
          <div className="wipu-quals-org">@ Google DeepMind</div>
        </div>
        <div className="wipu-quals-block">
          <div className="wipu-quals-eyebrow">Previously</div>
          <div className="wipu-quals-title">Design Lead</div>
          <div className="wipu-quals-org">@ The Washington Post</div>
        </div>
      </div>
      <div className="wipu-quals-path">
        <span>Federal</span>
        <span className="wipu-quals-arrow" aria-hidden>
          →
        </span>
        <span>Journalism</span>
        <span className="wipu-quals-arrow" aria-hidden>
          →
        </span>
        <span>Voice Assistant / Conversation Design</span>
        <span className="wipu-quals-arrow" aria-hidden>
          →
        </span>
        <span>Frontier AI</span>
      </div>
    </div>
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
    label: "INDEX · 00",
    render: () => <HeroSlide />,
  },
  {
    id: "about",
    label: "CAREER · 01",
    render: () => <QualificationsSlide />,
  },
  {
    id: "visual-overlays",
    label: "VISUAL OVERLAYS · 02",
    render: () => (
      <MovieEmbedSlide
        src="/portfolio%20transfer/gemini_visualoverlays_commercial_2.gif"
        alt="Gemini Visual Overlays commercial"
        caption="I design thoughtful, elegant experiences that drive real impact for household names."
      />
    ),
  },
  {
    id: "field-notes",
    label: "FIELD NOTES · 03",
    render: () => <FieldNotesSlide />,
  },
  {
    id: "ai-native",
    label: "AI-NATIVE · 04",
    render: () => <AiNativeSlide />,
  },
  {
    id: "ai-in-practice",
    label: "AI · IN PRACTICE · 05",
    render: () => <AiInPracticeSlide />,
  },
  {
    id: "dc",
    label: "DC YEARS · 06",
    render: () => (
      <TextImageSlide
        side="right"
        eyebrow="DC YEARS · 06"
        title={<>I cut my teeth in Washington, DC.</>}
        subtitle="Where I learned to design in complexity."
      >
        <div className="wipu-ti-cluster wipu-ti-cluster-b">
          <TileColor tone="rose" />
          <TileImage
            src="/portfolio%20transfer/washington-post-homepage.gif"
            alt="Washington Post homepage redesign"
          />
        </div>
      </TextImageSlide>
    ),
  },
  {
    id: "empathy",
    label: "SEEING PEOPLE · 07",
    render: () => (
      <TextImageSlide
        side="left"
        eyebrow="SEEING PEOPLE · 07"
        title={"Design is empathy.\nTravel is practice."}
        subtitle="Nearly fifty countries. Seeing how other people live is the most important thing a designer can do."
      >
        <div>
          <div className="wipu-ti-single">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio%20transfer/Travel/stp.png"
              alt="Three friends in front of Pico Cão Grande, São Tomé"
              draggable={false}
            />
          </div>
          <div className="wipu-ti-single-caption">
            Pico Cão Grande, São Tomé
          </div>
        </div>
      </TextImageSlide>
    ),
  },
  {
    id: "invitation",
    label: "BIG & SCARY · 08",
    render: () => (
      <QuoteTemplate
        quote={<>&ldquo;I love tackling big, scary projects.&rdquo;</>}
        attribution="— Peter, on Mondays"
      />
    ),
  },
  {
    id: "cases",
    label: "CASE STUDIES · 09",
    render: () => (
      <StickyCardsTemplate
        blocks={[
          {
            eyebrow: "2025 · Google DeepMind",
            title: "Teaching Gemini to See",
            body: "Evolving Gemini Live into a multimodal conversational product.",
            tone: "terracotta",
            href: "/case-studies/teaching-gemini-to-see",
          },
          {
            eyebrow: "2025 · Google DeepMind",
            title: "Everyone's a Director",
            body: "Creating the interface for Google's most advanced video generation model.",
            tone: "mint",
            href: "/case-studies/veo-in-gemini",
          },
        ]}
      />
    ),
  },
];
