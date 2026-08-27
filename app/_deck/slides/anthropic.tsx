"use client";

/* The /anthropic deck — a trimmed intro cut for the Anthropic interview.
   Same engine + chrome as the home deck, but: hero drops its contact
   links, only the career / AI-toolkit / travel slides are kept, and a
   dedicated Peter's Principles slide lands right before a case-studies
   slide that closes the deck with a jump-off to the work. */

import type { SlideDef } from "./index";
import {
  HeroSlide,
  QualificationsSlide,
  AiInPracticeSlide,
  EmpathySlide,
  CasesSlide,
} from "./index";
import { PrinciplesSlide } from "./principles/PrinciplesSlide";

// Labels are written fresh here (not pulled from content) so the deck
// frame's "NN  LABEL" numbering stays sequential for this trimmed cut —
// the home labels carry their own "· NN" suffixes that no longer apply.
export const ANTHROPIC_SLIDES: SlideDef[] = [
  {
    id: "hero",
    label: "HERO",
    render: () => <HeroSlide contacts={[]} />,
  },
  {
    id: "about",
    label: "CAREER",
    render: () => <QualificationsSlide />,
  },
  {
    id: "ai-in-practice",
    label: "AI IN PRACTICE",
    render: () => <AiInPracticeSlide />,
  },
  {
    id: "empathy",
    label: "EMPATHY",
    render: () => <EmpathySlide />,
  },
  {
    id: "principles",
    label: "PRINCIPLES",
    render: () => <PrinciplesSlide />,
  },
  {
    id: "cases",
    label: "CASE STUDIES",
    render: () => <CasesSlide eyebrow="CASE STUDIES" title="Selected work." />,
  },
];
