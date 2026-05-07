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

function HeroSlide() {
  return (
    <IntroTemplate
      emoji={<HoverGif src="/portfolio%20transfer/chocolate%20emoji.gif" />}
      greeting={<>Hi, I&rsquo;m</>}
      name={
        <TypeOnText perCharMs={140} wordPauseMs={320}>
          Peter Hershey
        </TypeOnText>
      }
      subtitle="AI Product Designer & Creator"
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
    <>
      <MediaMorphSlide
        side="left"
        eyebrow="AI-NATIVE · 04"
        title={<>🤖 AI native by default.</>}
        subtitle="Designing with the most advanced AI tools available. Building the ones that don't exist yet."
        media={AI_ART_VIDEOS}
        phaseMs={4500}
      />
      {/* Goal-template-style callout below the morphing media's bottom-left
          corner, with a Manhattan leader rising up into the media. */}
      <div
        className="wipu-anno-callout"
        style={{
          position: "absolute",
          bottom: "8vh",
          left: "48vw",
          width: "clamp(220px, 22vw, 300px)",
        }}
        aria-hidden
      >
        Shown at Noisebridge & The Gray Area
      </div>
      <svg
        className="wipu-anno-callout-svg"
        style={{
          position: "absolute",
          bottom: "calc(8vh + 60px)",
          left: "48vw",
          width: 300,
          height: 100,
        }}
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <marker
            id="wipu-anno-callout-arrow-ain"
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
          d="M 80 96 V 60 H 220 V 4"
          markerEnd="url(#wipu-anno-callout-arrow-ain)"
        />
      </svg>
    </>
  );
}

function AiInPracticeSlide() {
  return (
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
  );
}

function EmpathySlide() {
  return (
    <TextImageSlide
      side="left"
      eyebrow="SEEING PEOPLE · 07"
      title={"Design is empathy.\nTravel is practice."}
      subtitle="Nearly fifty countries. Seeing how other people live is the most important thing a designer can do."
      footer={
        <a
          className="wipu-ti-press"
          href="https://www.washingtonpost.com/travel/tips/digital-nomad-visa-tips/"
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
            <span className="wipu-ti-press-source">The Washington Post · Travel</span>
            <span className="wipu-ti-press-headline">
              My Digital Nomad Visa Tips <span className="wipu-ti-press-arrow" aria-hidden>↗</span>
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
            alt="Three friends in front of Pico Cão Grande, São Tomé"
            draggable={false}
          />
        </div>
        <div className="wipu-ti-single-caption">
          Pico Cão Grande, São Tomé
        </div>
      </div>
    </TextImageSlide>
  );
}

function QualificationsSlide() {
  return (
    <ThreeUpTemplate
      blocks={[
        {
          eyebrow: "PREVIOUSLY",
          title: "Design Lead @ The Washington Post",
          body: "Led product design across the homepage, article reading experience, and the editorial tools that fed them.",
          image: {
            src: "/portfolio%20transfer/field%20notes/product/washington-post-homepage.gif",
            alt: "Washington Post homepage redesign",
          },
        },
        {
          eyebrow: "CURRENTLY",
          title: "Senior AI Product Designer @ Google DeepMind",
          body: "Designing the multimodal future of Gemini — Live Video, Visual Overlays, and the input framework underneath them all.",
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
    label: "INDEX · 00",
    render: () => <HeroSlide />,
  },
  {
    id: "about",
    label: "CAREER · 01",
    render: () => <QualificationsSlide />,
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
    id: "empathy",
    label: "SEEING PEOPLE · 07",
    render: () => <EmpathySlide />,
  },
  {
    id: "cases",
    label: "CASE STUDIES · 09",
    render: () => (
      <StickyCardsTemplate
        eyebrow="CASE STUDIES · 09"
        title="Selected work."
        autoReveal
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
