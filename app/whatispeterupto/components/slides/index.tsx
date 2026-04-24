"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CreatorSlide } from "./creator";
import {
  TextImageSlide,
  Placeholder as ImagePlaceholder,
  TileColor,
  TileImage,
} from "./text-image/TextImageSlide";
import { IntroTemplate } from "../../templates/components/IntroTemplate";

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

function AiNativeSlide() {
  return (
    <div className="wipu-ainative">
      <div className="wipu-ainative-blocks">
        <div className="wipu-ainative-block">
          <div className="wipu-ainative-eyebrow">Big three</div>
          <div className="wipu-ainative-title">
            Figma · Claude Code · Antigravity
          </div>
        </div>
        <div className="wipu-ainative-block">
          <div className="wipu-ainative-eyebrow">Also</div>
          <div className="wipu-ainative-title wipu-ainative-title--md">
            AI Studio · Wispr · TouchDesigner · Real-time generative AI
          </div>
        </div>
        <div className="wipu-ainative-block">
          <div className="wipu-ainative-eyebrow">Played around with</div>
          <div className="wipu-ainative-title wipu-ainative-title--sm">
            ComfyUI · Huggingface · LeonardoAI · RunwayML · Midjourney · ElevenLabs
          </div>
        </div>
      </div>
      <div className="wipu-ainative-tagline">
        <p>
          the tools change{" "}
          <span className="wipu-ainative-arrow" aria-hidden>
            →
          </span>{" "}
          the process doesn&rsquo;t
        </p>
      </div>
    </div>
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

function Placeholder({
  num,
  title,
  hint,
  children,
}: {
  num: string;
  title: string;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <div className="wipu-slide-placeholder">
      <div className="wipu-slide-placeholder-num">{num}</div>
      <div className="wipu-slide-placeholder-title">{title}</div>
      {hint && <div className="wipu-slide-placeholder-hint">{hint}</div>}
      {children}
    </div>
  );
}

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
    id: "creator",
    label: "ALWAYS A CREATOR · 02",
    render: () => <CreatorSlide />,
  },
  {
    id: "ai-native",
    label: "AI-NATIVE · 03",
    render: () => <AiNativeSlide />,
  },
  {
    id: "dc",
    label: "DC YEARS · 04",
    render: () => (
      <TextImageSlide
        side="right"
        eyebrow="DC YEARS · 04"
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
    label: "SEEING PEOPLE · 05",
    render: () => (
      <TextImageSlide
        side="left"
        eyebrow="SEEING PEOPLE · 05"
        title={"Design is empathy.\nTravel is practice."}
        subtitle="Nearly fifty countries. Seeing how other people live is the most important thing a designer can do."
      >
        <div className="wipu-ti-cluster wipu-ti-cluster-c">
          <TileImage
            src="/portfolio%20transfer/me/IMG_0077.jpeg"
            alt="Peter"
          />
          <TileImage
            src="/portfolio%20transfer/Travel/IMG_0167.JPG"
            alt="Travel"
          />
          <TileImage
            src="/portfolio%20transfer/Travel/IMG_2083.JPG"
            alt="Travel"
          />
        </div>
      </TextImageSlide>
    ),
  },
  {
    id: "invitation",
    label: "BIG & SCARY · 06",
    render: () => (
      <Placeholder
        num="07"
        title="I love tackling big scary projects"
        hint="Phase 1 placeholder"
      />
    ),
  },
  {
    id: "cases",
    label: "CASE STUDIES · 07",
    render: () => (
      <Placeholder num="08" title="Case studies" hint="Phase 1 placeholder">
        <div className="wipu-slide-placeholder-links">
          <Link
            className="wipu-slide-placeholder-link"
            href="/whatispeterupto/case-studies/teaching-gemini-to-see"
          >
            Teaching Gemini to See →
          </Link>
        </div>
      </Placeholder>
    ),
  },
];
