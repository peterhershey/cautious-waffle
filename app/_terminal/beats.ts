/* The ordered beats for the terminal. Copy is pulled from app/content.ts and
 * the Gemini case study (teaching-gemini-to-see.tsx) and given terminal
 * framing here — neither source file is modified.
 *
 * Sections:
 *   HOME    — kickoff → whoami → career → ai-native → travels → menu
 *   GEMINI  — first half of "Teaching Gemini to See" (open gemini-live →
 *             shipped → premise → timeline → Project Dashi research → goal)
 * The second half (Multimodal Launcher, Zürich Realtime Video, results,
 * reflections) is appended in the next pass. */

import { createElement } from "react";
import {
  hero,
  qualifications,
  aiNative,
  aiInPractice,
  empathy,
  cases,
} from "../content";
import type { Beat, OutputBlock } from "./beat-machine";
import { AsciiTitle } from "./kickoff/AsciiTitle";
import { EyeTitle } from "./gemini/EyeTitle";
import { InlinePreview } from "./media/InlinePreview";
import { VideoCard } from "./media/VideoCard";
import { Attribution } from "./media/Attribution";
import { LinkLine } from "./media/LinkLine";
import { DividerSlide } from "./views/DividerSlide";
import type { CarouselItem, MediaWindow } from "./media/types";
import type { Track } from "./beat-machine";

// ── helpers ──────────────────────────────────────────────────────────
type Media = {
  src: string;
  alt: string;
  name: string;
  width: number;
  height: number;
};

const line = (text: string, className?: string): OutputBlock => ({
  kind: "line",
  text,
  className,
});
const gap = (): OutputBlock => ({ kind: "gap" });
const preview = (key: string, m: Media): OutputBlock => ({
  kind: "node",
  key,
  render: ({ active, onDone }) =>
    createElement(InlinePreview, { ...m, active, onDone }),
});
const linkLine = (key: string, label: string, href: string): OutputBlock => ({
  kind: "node",
  key,
  render: ({ active, onDone }) =>
    createElement(LinkLine, { label, href, active, onDone }),
});
const video = (
  key: string,
  id: string,
  name: string,
  params = "rel=0&playsinline=1&autoplay=1&mute=1",
): OutputBlock => ({
  kind: "node",
  key,
  render: ({ active, onDone }) =>
    createElement(VideoCard, { id, name, params, active, onDone }),
});

// A section-break "slide": clears the screen and shows an ASCII divider with a
// title/meta. The command still types (it's a real terminal), then the screen
// wipes to the breather. `windowTitle` updates the title bar like a new tab.
function divider(opts: {
  id: string;
  command: string;
  title: string;
  meta?: string;
  windowTitle?: string;
  navLabel?: string;
}): Beat {
  return {
    id: opts.id,
    label: opts.command,
    navLabel: opts.navLabel,
    command: opts.command,
    register: "graphical",
    clear: true,
    title: opts.windowTitle,
    output: [
      {
        kind: "node",
        key: `${opts.id}-divider`,
        render: ({ active, onDone }) =>
          createElement(DividerSlide, {
            title: opts.title,
            meta: opts.meta,
            active,
            onDone,
          }),
      },
    ],
  };
}

// Decode the base64 email parts (same value on server + client) into an
// obfuscated, un-scrapeable form — honoring content.ts's anti-harvest intent.
function obfuscatedEmail(): string {
  const dec = (s: string) =>
    typeof atob === "function"
      ? atob(s)
      : Buffer.from(s, "base64").toString("utf8");
  const email = hero.contacts.find((c) => "email" in c) as
    | { email: { user: string; domain: string } }
    | undefined;
  if (!email) return "";
  return `${dec(email.email.user)} [at] ${dec(email.email.domain)}`;
}

// ════════════════════════════ HOME ═══════════════════════════════════

// ── kickoff ──────────────────────────────────────────────────────────
const kickoff: Beat = {
  id: "kickoff",
  label: "Kickoff",
  command: "./portfolio",
  bootLines: [
    "initializing portfolio runtime…",
    "loading content.ts … ok",
    "mounting case studies … ok",
  ],
  register: "graphical",
  aside: {
    src: "/portfolio%20transfer/chocolate%20emoji.gif",
    alt: "A chocolate bar shattering — no, not that Hershey.",
  },
  output: [
    {
      kind: "node",
      key: "title",
      render: ({ active, onDone }) =>
        createElement(AsciiTitle, { active, onDone }),
    },
    gap(),
    line(`${hero.greeting} Peter Hershey.`, "term-dim"),
    line(hero.subtitle, "term-dim"),
    gap(),
    line("press space to begin · / to jump", "term-faint"),
  ],
};

// ── whoami ───────────────────────────────────────────────────────────
const whoami: Beat = {
  id: "whoami",
  label: "whoami",
  navLabel: "whoami",
  command: "whoami",
  register: "plain",
  // Color-coded by the tone each contact carries in content.ts.
  output: [
    line("Peter Hershey — AI Product Designer & Creator"),
    gap(),
    line("Instagram   instagram.com/peterhershey", "term-accent"),
    line("LinkedIn    linkedin.com/in/peter-hershey", "term-link"),
    line(`Email       ${obfuscatedEmail()}`, "term-ok"),
  ],
};

// ── cat career.md ────────────────────────────────────────────────────
// Inline preview per block, matching the homepage QualificationsSlide
// pairing (Washington Post → PREVIOUSLY, Gemini Visual Overlays → CURRENTLY).
const careerMedia: Media[] = [
  {
    src: "/portfolio%20transfer/field%20notes/product/washington-post-homepage.gif",
    alt: "Washington Post homepage redesign",
    name: "washington-post-homepage.gif",
    width: 1200,
    height: 592,
  },
  {
    src: "/portfolio%20transfer/gemini_visualoverlays_commercial_2.gif",
    alt: "Gemini Visual Overlays — what it feels like when a model can look at what you're looking at.",
    name: "gemini-visual-overlays.gif",
    width: 960,
    height: 564,
  },
];

const careerOutput: OutputBlock[] = [];
qualifications.blocks.forEach((b, i) => {
  if (i > 0) careerOutput.push(gap());
  careerOutput.push(line(`## ${b.eyebrow}`, "term-head"));
  careerOutput.push(line(b.title));
  careerOutput.push(line(b.body, "term-dim"));
  if (careerMedia[i]) careerOutput.push(preview(`career-img-${i}`, careerMedia[i]));
});
careerOutput.push(gap());
careerOutput.push(line("› next: ./ai-native", "term-faint"));

const career: Beat = {
  id: "career",
  label: "cat career.md",
  navLabel: "Career",
  command: "cat career.md",
  bootLines: ["reading career.md…"],
  register: "plain",
  output: careerOutput,
};

// ── ./ai-native ──────────────────────────────────────────────────────
const aiNativeOutput: OutputBlock[] = [
  line(aiNative.title, "term-accent"),
  line(aiNative.subtitle, "term-dim"),
  gap(),
  line(`# ${aiInPractice.title}`, "term-faint"),
];
aiInPractice.blocks.forEach((b) => {
  aiNativeOutput.push(line(`## ${b.eyebrow}`, "term-head"));
  aiNativeOutput.push(line(b.title, "term-accent"));
  aiNativeOutput.push(line(b.body, "term-dim"));
  aiNativeOutput.push(gap());
});
// A video walking through the toolkit, framed as command output (click to play).
aiNativeOutput.push(video("ai-native-video", "3uGLjmrPorg", "ai-toolkit.mov", "rel=0&playsinline=1&start=17"));
aiNativeOutput.push(gap());
aiNativeOutput.push(line("› next: open ~/travels", "term-faint"));

const aiNativeBeat: Beat = {
  id: "ai-native",
  label: "./ai-native",
  command: "./ai-native",
  bootLines: ["probing the model frontier…"],
  register: "plain",
  output: aiNativeOutput,
};

// ── open ~/travels ───────────────────────────────────────────────────
// The Washington Post piece opens as a secondary pop-up window — "oh, you can
// actually read the thing I wrote." The hero is the article's own lead photo.
// Article fields mirror the published piece so the window reads like the real
// thing; WaPo blocks framing + paywalls the body, so "continue reading" opens
// the live article. (empathy.pressLink stays the short label used elsewhere.)
const WAPO_ARTICLE: MediaWindow = {
  title: "washingtonpost.com",
  variant: "article",
  items: [
    {
      src: "/press/wapo-digital-nomad.jpg",
      alt: "Lead photo: a laptop on a sunlit balcony overlooking a city",
      name: "washington-post.article",
      width: 1440,
      height: 1068,
      kicker: "Perspective · The Washington Post",
      title: "I’ve worked remotely from 14 countries. Here’s what I learned.",
      dek: "Consider my lessons your beginner’s guide to being a digital nomad.",
      byline: "By Peter Hershey · Sept. 14, 2022",
      href: empathy.pressLink.url,
      cta: "Continue reading on washingtonpost.com →",
    },
  ],
};

const travels: Beat = {
  id: "travels",
  label: "open ~/travels",
  navLabel: "Travels",
  command: "open ~/travels",
  bootLines: ["opening travels…"],
  register: "graphical",
  // Secondary pop-up: the published WaPo article.
  layout: "popup",
  gallery: WAPO_ARTICLE,
  output: [
    line(empathy.title),
    line(empathy.subtitle, "term-dim"),
    gap(),
    preview("travel-stp", {
      src: "/portfolio%20transfer/travel/stp.png",
      alt: empathy.photoAlt,
      name: "pico-cao-grande.png",
      width: 2006,
      height: 1570,
    }),
    line(empathy.photoCaption, "term-faint"),
    gap(),
  ],
};

// ── ls ~/case-studies (the handoff) ──────────────────────────────────
const TONE_CLASS: Record<string, string> = {
  terracotta: "term-accent",
  mint: "term-ok",
  mustard: "term-head",
};
const menuOutput: OutputBlock[] = [line(cases.title, "term-dim"), gap()];
cases.blocks.forEach((b) => {
  const dir = b.href.replace(/^\/case-studies\//, "");
  menuOutput.push(line(`${dir}/`, TONE_CLASS[b.tone] ?? "term-accent"));
  menuOutput.push(line(`   ${b.title} — ${b.body}`, "term-dim"));
});
menuOutput.push(gap());
menuOutput.push(line("› open gemini-live to dive in", "term-faint"));

const menu: Beat = {
  id: "case-studies",
  label: "ls ~/case-studies",
  navLabel: "Case studies",
  command: "ls ~/case-studies",
  register: "plain",
  output: menuOutput,
};

// Three sections: experience (career) → tools (ai-native) → travels, bookended
// by the intro and the case-study menu.
const HOME_BEATS: Beat[] = [
  kickoff,
  whoami,
  career,
  aiNativeBeat,
  travels,
  menu,
];

// ═══════════════════ GEMINI LIVE — first half ════════════════════════

// ── open gemini-live (hero · ASCII eye) ──────────────────────────────
const geminiHero: Beat = {
  id: "gemini-hero",
  label: "open gemini-live",
  navLabel: "Overview",
  command: "open gemini-live",
  bootLines: ["loading case study…", "rendering eye … ok"],
  register: "graphical",
  clear: true,
  title: "gemini-live — case study",
  output: [
    {
      kind: "node",
      key: "eye",
      render: ({ active, onDone }) =>
        createElement(EyeTitle, { active, onDone }),
    },
    gap(),
    line("CASE STUDY · 2025", "term-faint"),
    line("Teaching Gemini to See.", "term-accent"),
    line(
      "Evolving Gemini Live into a multimodal conversational product.",
      "term-dim",
    ),
    line(
      "role: lead visual designer (Live Video) · sole UX designer (Visual Overlays)",
      "term-faint",
    ),
  ],
};

// ── ls ~/gemini/shipped ──────────────────────────────────────────────
const geminiShipped: Beat = {
  id: "gemini-shipped",
  label: "ls ~/shipped",
  command: "ls ~/gemini/shipped",
  register: "plain",
  output: [
    line("# what I've shipped at Gemini · 2024–2025", "term-faint"),
    gap(),
    line("🚀 gemini-app-launch"),
    line("🎥 gemini-live-video       ← this case study", "term-accent"),
    line("✨ visual-overlays"),
    line("🧩 multimodal-launcher"),
    line("📱 android-screen-context"),
    line("🎤 voice-selection"),
    line("🎬 veo-video-generation"),
    line("🎧 audio-overviews"),
    line("🥂 monthly-ai-salon"),
  ],
};

// ── cat premise.md (early computing) ─────────────────────────────────
const geminiPremise: Beat = {
  id: "gemini-premise",
  label: "cat premise.md",
  command: "cat premise.md",
  register: "graphical",
  output: [
    line("## EARLY COMPUTING", "term-head"),
    line("Teach computers to talk like humans. Not the other way around."),
    line(
      "For decades, using a computer meant learning its language. The promise of conversational AI is the inverse: software that meets people where they already are.",
      "term-dim",
    ),
    gap(),
    {
      kind: "node",
      key: "early-computing-video",
      render: ({ active, onDone }) =>
        createElement(VideoCard, {
          id: "YnnGbcM-H8c",
          params: "rel=0&playsinline=1&start=127&autoplay=1&mute=1",
          name: "early-computing.mov",
          active,
          onDone,
        }),
    },
  ],
};

// ── ./timeline (evolution → Live) ────────────────────────────────────
// The old Gemini/Assistant shots open in a floating carousel window — a
// pacing change from the inline text, and true to how Quick Look behaves.
const TIMELINE_GALLERY: CarouselItem[] = [
  {
    src: "/gemini-timeline/google-assistant.jpg",
    alt: "Google Assistant — “Hi, how can I help?”",
    name: "google-assistant.jpg",
    width: 1200,
    height: 630,
    title: "Google Assistant",
    date: "2016–2024",
    note: "A decade of voice assistance — where it started.",
  },
  {
    src: "/portfolio%20transfer/case%20study%20live%20video/ss_gemini.png",
    alt: "Gemini app launch on iOS and Android",
    name: "ss_gemini.png",
    width: 2642,
    height: 1470,
    title: "Gemini App Launch",
    date: "Feb 2024",
    note: "Earned a T rating for transformative impact.",
  },
  {
    src: "/gemini-timeline/stop-2.gif",
    alt: "Gemini Screen Context — sharing the current phone screen with Gemini",
    name: "screen-context.gif",
    width: 992,
    height: 1612,
    title: "Screen Context",
    date: "May 2024",
    note: "2 patents for the Screen Context UI framework.",
  },
  {
    src: "/gemini-timeline/stop-3.webp",
    alt: "Gemini Live — voice-only dark screen with waveform bloom and Hold/End controls",
    name: "gemini-live.webp",
    width: 2400,
    height: 1600,
    title: "Gemini Live",
    date: "Aug 2024",
    note: "Voice-first, multimodal. The surface I led.",
  },
];

const geminiTimeline: Beat = {
  id: "gemini-timeline",
  label: "./timeline",
  command: "./timeline --since 2016",
  bootLines: ["plotting milestones…"],
  register: "graphical",
  output: [
    line("# from Google Assistant to Gemini Live", "term-faint"),
    gap(),
    line("2016–2024   Assistant", "term-dim"),
    line("FEB 2024    Gemini App Launch"),
    line("            ↳ earned a T rating for transformative impact", "term-head"),
    line("MAY 2024    Screen Context"),
    line("            ↳ 2 patents for the Screen Context UI framework", "term-head"),
    line("AUG 2024    Live  ← voice-first, the surface I led", "term-accent"),
    line("next?       …", "term-faint"),
  ],
  gallery: { title: "gemini-timeline.gallery", items: TIMELINE_GALLERY },
};

// ── Project Dashi · section divider ──────────────────────────────────
const dashiDivider = divider({
  id: "gemini-dashi-divider",
  command: "cd ~/dashi",
  title: "Project Dashi",
  meta: "New York · November 2023",
  windowTitle: "gemini-live — project dashi",
  navLabel: "Project Dashi",
});

// ── cat vision.txt (the vision · pull quote) ─────────────────────────
// A "big" beat: it gets breathing room and scrolls the history out of view.
const geminiDashi: Beat = {
  id: "gemini-dashi",
  label: "cat vision.txt",
  command: "cat vision.txt",
  register: "graphical",
  feature: true,
  output: [
    line(
      "“What I'm hoping for by 2024 […] a simplified product I can interact with much more naturally — easily switch between talking, typing, pointing it at something and asking questions.”",
      "term-dim",
    ),
    gap(),
    {
      kind: "node",
      key: "sundar",
      render: ({ active, onDone }) =>
        createElement(Attribution, {
          name: "Sundar Pichai",
          avatarSrc: "/assets/sundar-avatar.png",
          active,
          onDone,
        }),
    },
  ],
};

// ── cat research/signal.md (the signal) ──────────────────────────────
const geminiSignal: Beat = {
  id: "gemini-signal",
  label: "cat signal.md",
  command: "cat research/signal.md",
  bootLines: ["// the signal"],
  register: "graphical",
  output: [
    line("20–30%", "term-stat"),
    line("of phone calls in the U.S. are already video", "term-dim"),
    line(
      "↳ Project Astra showed video input meaningfully extends session length vs. voice-only.",
      "term-faint",
    ),
    gap(),
    line(
      "“I'm looking for a certain type of heel, but I don't know what it's called. I have to do a lot of work to figure it out myself instead of it leading me where I might want to go.”",
      "term-dim",
    ),
    line("— Study Participant 13", "term-accent"),
  ],
};

// ── ls research/use-cases/ ───────────────────────────────────────────
const USE_CASES: { emoji: string; category: string; query: string; reply: string; tone: string }[] = [
  {
    emoji: "🎨",
    category: "Creative Collaboration",
    query: "What are some ways I can make this space feel less cluttered?",
    reply: "Analyzes the space, suggests strategies, proposes ideas.",
    tone: "term-accent",
  },
  {
    emoji: "🪴",
    category: "Visual Troubleshooting & Guidance",
    query: "Why does my plant look so droopy?",
    reply: "Analyzes the problem, asks clarifying questions, suggests solutions.",
    tone: "term-ok",
  },
  {
    emoji: "📚",
    category: "In-Context Learning & Skill Development",
    query: "What are these socks made of, and how do I wash them?",
    reply: "Analyzes visual characteristics, gives relevant explanations and actionable guidance.",
    tone: "term-head",
  },
];
const useCasesOutput: OutputBlock[] = [
  line("Where do users want multimodal assistance?"),
  gap(),
];
USE_CASES.forEach((c, i) => {
  if (i > 0) useCasesOutput.push(gap());
  useCasesOutput.push(line(`${c.emoji} ${c.category}`, c.tone));
  useCasesOutput.push(line(`   “${c.query}”`, "term-dim"));
  useCasesOutput.push(line(`   ↳ ${c.reply}`, "term-faint"));
});

const geminiUseCases: Beat = {
  id: "gemini-use-cases",
  label: "ls use-cases/",
  command: "ls research/use-cases/",
  register: "plain",
  output: useCasesOutput,
};

// ── cat goal.md (the thesis — end of part one) ───────────────────────
const geminiGoal: Beat = {
  id: "gemini-goal",
  label: "cat goal.md",
  command: "cat goal.md",
  bootLines: ["// the thesis"],
  register: "plain",
  output: [
    line("🎯 GOAL", "term-head"),
    gap(),
    line(
      "Design a conversational AI product that lets users seamlessly switch between modalities.",
      "term-quote",
    ),
    gap(),
    line("## speak", "term-accent"),
    line(
      "Gemini Live is a voice-first product, not a search bar. The UI has to support open-ended, back-and-forth dialogue where the AI remembers context across turns.",
      "term-dim",
    ),
    gap(),
    line("## see", "term-accent"),
    line(
      "Video, voice, and text aren't three separate features. They're three inputs to one conversation. The challenge is making them feel unified, not bolted together.",
      "term-dim",
    ),
    gap(),
    line("## remember", "term-accent"),
    line(
      "Users shouldn't have to stop, change modes, or restart. Turning on the camera mid-conversation should feel as natural as holding something up to a friend on a video call.",
      "term-dim",
    ),
  ],
};

// ══════════════ GEMINI LIVE — second half ════════════════════════════

// ── Multimodal Launcher ──────────────────────────────────────────────
const mlDivider = divider({
  id: "gemini-ml-divider",
  command: "cd ~/multimodal-launcher",
  title: "Multimodal Launcher",
  meta: "California · 2024",
  windowTitle: "gemini-live — multimodal launcher",
  navLabel: "Multimodal Launcher",
});

const mlInitial: Beat = {
  id: "gemini-ml-initial",
  label: "cat initial.md",
  command: "cat initial.md",
  register: "graphical",
  // Full-width column with the screenshot riding inline in the flow.
  layout: "inline",
  output: [
    line("Initial integration attempt."),
    line(
      "The first effort to bring camera input and image upload into the Gemini Live flow.",
      "term-dim",
    ),
    gap(),
    preview("ml-initial-img", {
      src: "/portfolio%20transfer/case%20study%20live%20video/multimodal-launcher-initial-integration.png",
      alt: "Three-screen flow — first attempt to bring camera capture and image upload into Gemini Live",
      name: "ml-initial-integration.png",
      width: 2306,
      height: 1824,
    }),
  ],
};

const mlIssues: Beat = {
  id: "gemini-ml-issues",
  label: "cat issues.md",
  command: "cat issues.md",
  bootLines: ["// what didn't work"],
  register: "graphical",
  output: [
    line("## Increased UI complexity", "term-head"),
    line(
      "The design introduced multiple fragmented states, which proved confusing to users.",
      "term-dim",
    ),
    gap(),
    line("## Feature overload", "term-head"),
    line(
      "Trying to handle complex features like podcasts and legal disclosures in the same interface made for a convoluted experience.",
      "term-dim",
    ),
    gap(),
    preview("ml-issues-img", {
      src: "/portfolio%20transfer/case%20study%20live%20video/mml.png",
      alt: "Multimodal Launcher interface",
      name: "multimodal-launcher.png",
      width: 1714,
      height: 1242,
    }),
  ],
};

const mlUnpacked: Beat = {
  id: "gemini-ml-unpacked",
  label: "play unpacked.mov",
  command: "play unpacked.mov",
  bootLines: ["// Samsung Galaxy Unpacked 2025"],
  register: "graphical",
  output: [
    video(
      "ml-unpacked-video",
      "SAWOLJRjBt0",
      "samsung-unpacked-2025.mov",
      "rel=0&playsinline=1&start=291&autoplay=1&mute=1",
    ),
  ],
};

// ── Realtime Video (Zürich) ──────────────────────────────────────────
const rvDivider = divider({
  id: "gemini-rv-divider",
  command: "cd ~/realtime-video",
  title: "Realtime Video",
  meta: "Zürich · January 2025",
  windowTitle: "gemini-live — realtime video",
  navLabel: "Realtime Video",
});

const rvLearnings: Beat = {
  id: "gemini-rv-learnings",
  label: "cat learnings.md",
  command: "cat learnings.md",
  register: "plain",
  output: [
    line("What have we learned?", "term-quote"),
    gap(),
    line("## FROM PROJECT DASHI — friction kills the magic", "term-head"),
    line(
      "Users were frustrated by small frictions — tapping send after speaking, unlocking the phone. They expected to just point and talk, and have the system understand everything else.",
      "term-dim",
    ),
    gap(),
    line("## FROM MULTIMODAL LAUNCHER — too many concepts", "term-head"),
    line(
      "The launcher was a trial run that put too many concepts into one interface — a fragmented experience where users weren't sure what state they were in.",
      "term-dim",
    ),
  ],
};

const MENTAL_MODELS: MediaWindow = {
  title: "mental-models.gallery",
  items: [
    {
      src: "/portfolio%20transfer/case%20study%20live%20video/telegram.png",
      alt: "Telegram — record and send mental model",
      name: "telegram.png",
      width: 677,
      height: 1251,
      title: "Record & Send",
      note: "Asynchronous · discrete · user-initiated — Snapchat, Telegram.",
    },
    {
      src: "/portfolio%20transfer/case%20study%20live%20video/lens.png",
      alt: "Google Lens — point and scan mental model",
      name: "lens.png",
      width: 677,
      height: 1251,
      title: "Point & Scan",
      note: "Synchronous · transactional · momentary — Google Lens.",
    },
    {
      src: "/portfolio%20transfer/case%20study%20live%20video/facetime.png",
      alt: "FaceTime — continuous stream mental model",
      name: "facetime.png",
      width: 677,
      height: 1251,
      title: "Continuous Stream",
      note: "Synchronous · persistent · always-on — FaceTime.",
    },
  ],
};

const rvMentalModels: Beat = {
  id: "gemini-rv-mental-models",
  label: "ls mental-models/",
  command: "ls mental-models/",
  register: "plain",
  output: [
    line("Three mental models for camera-on-a-phone:", "term-dim"),
    line("telegram/   lens/   facetime/", "term-faint"),
  ],
  gallery: MENTAL_MODELS,
};

const ZRH_EXPLORATIONS: MediaWindow = {
  title: "zrh-explorations.gallery",
  items: (
    [
      ["zrh_explorations_1", "Icon placement & grouping"],
      ["zrh_explorations_2", "Mic treatment"],
      ["zrh_explorations_3", "Arrangement & Z-index"],
      ["zrh_explorations_4", "Gel placement"],
      ["zrh_explorations_5", "Entrypoints"],
    ] as const
  ).map(([file, title]) => ({
    src: `/portfolio%20transfer/case%20study%20live%20video/${file}.png`,
    alt: `Zürich exploration — ${title}`,
    name: `${file}.png`,
    width: 3456,
    height: 1704,
    title,
    date: "Zürich · 2025",
  })),
};

const rvExplorations: Beat = {
  id: "gemini-rv-explorations",
  label: "open explorations",
  command: "open zrh-explorations.gallery",
  register: "plain",
  output: [line("Designing the realtime-video surface — explorations.", "term-dim")],
  // Wide landscape frames — open them in a floating second window rather than
  // the narrow side stage. Same paging; different presentation.
  layout: "popup",
  gallery: ZRH_EXPLORATIONS,
};

const rvPrototype: Beat = {
  id: "gemini-rv-prototype",
  label: "open prototype",
  command: "open voice-chat.proto",
  bootLines: ["launching prototype…"],
  register: "graphical",
  output: [
    linkLine(
      "gemini-rv-proto-link",
      "voice-chat prototype",
      "/archive/prototypes/voice-chat?embed=1",
    ),
  ],
};

// ── Results ──────────────────────────────────────────────────────────
const resultsDivider = divider({
  id: "gemini-results-divider",
  command: "./results",
  title: "📈 The Results",
  meta: "shipped, featured, measured",
  windowTitle: "gemini-live — results",
  navLabel: "Results",
});

const GEMINI_LAUNCH: MediaWindow = {
  title: "launch.gallery",
  items: [
    {
      src: "/portfolio%20transfer/case%20study%20live%20video/samsungunpacked.png",
      alt: "Samsung Unpacked 2025 — Gemini Live Video featured",
      name: "samsung-unpacked.png",
      width: 3546,
      height: 1922,
      title: "Samsung Unpacked 2025",
      date: "Jan 2025",
      note: "Shipped in time for and featured at Unpacked.",
    },
    {
      src: "/portfolio%20transfer/case%20study%20live%20video/googleio.png",
      alt: "Google I/O 2025 — Gemini Live Video featured",
      name: "google-io.png",
      width: 1346,
      height: 728,
      title: "Google I/O 2025",
      date: "May 2025",
      note: "Featured prominently at I/O.",
    },
    {
      src: "/portfolio%20transfer/gemini_vss_commercial_lindsaylohan.gif",
      alt: "Samsung Q2 2025 campaign — Gemini Visual Cues commercial featuring Lindsay Lohan",
      name: "samsung-campaign.gif",
      width: 500,
      height: 894,
      title: "Samsung campaign refresh",
      date: "Q2 2025",
      note: "Hero feature of a multimillion-dollar campaign refresh.",
    },
  ],
};

const resultsLaunch: Beat = {
  id: "gemini-results-launch",
  label: "ls launch/",
  command: "ls launch/",
  register: "plain",
  output: [line("Launch & visibility.", "term-dim")],
  gallery: GEMINI_LAUNCH,
};

const resultsRetention: Beat = {
  id: "gemini-results-retention",
  label: "cat retention.md",
  command: "cat retention.md",
  bootLines: ["// causal impact"],
  register: "graphical",
  output: [
    line("+17%", "term-stat"),
    line("Week-over-week retention, causal.", "term-dim"),
  ],
};

const resultsNumbers: Beat = {
  id: "gemini-results-numbers",
  label: "cat impact.md",
  command: "cat impact.md",
  register: "graphical",
  output: [
    line("## IN-PRODUCT IMPACT", "term-head"),
    line("+13%", "term-stat"),
    line("Gemini Live DAU lift.", "term-dim"),
    gap(),
    line("97%", "term-stat"),
    line("Positive-to-neutral initial reactions.", "term-dim"),
    gap(),
    line("## EXTERNAL RECOGNITION — 2025 MWC, Barcelona", "term-head"),
    line("🏆 Android Authority — Best of MWC", "term-dim"),
    line("🏆 GLOMO — Breakthrough Device Innovation", "term-dim"),
    line("🏆 House of Technology — Best AI Innovation of MWC", "term-dim"),
    line("🏆 Wired — Top New Gadgets", "term-dim"),
    gap(),
    video("gemini-mx-video", "2qT9EDkLfC0", "mexico-city.mov", "rel=0&playsinline=1&autoplay=1&mute=1"),
  ],
};

const reflections: Beat = {
  id: "gemini-reflections",
  label: "cat reflections.md",
  navLabel: "Reflections",
  command: "cat reflections.md",
  register: "plain",
  output: [
    line("## 01 — Design with the grain of the model.", "term-head"),
    line(
      "Good design here starts with a deep understanding of what the model can actually do. That understanding is what makes real restraint possible.",
      "term-dim",
    ),
    gap(),
    line("## 02 — Discoverability in conversational AI is unsolved.", "term-head"),
    line(
      "Invisible features need a surface to live on, but every solution on the shelf violates the minimalism that makes these products work. The tension I most want to keep pulling on.",
      "term-dim",
    ),
    gap(),
    line("› next: open veo", "term-faint"),
  ],
};

const GEMINI_BEATS: Beat[] = [
  geminiHero,
  geminiShipped,
  geminiPremise,
  geminiTimeline,
  dashiDivider,
  geminiDashi,
  geminiSignal,
  geminiUseCases,
  geminiGoal,
  mlDivider,
  mlInitial,
  mlIssues,
  mlUnpacked,
  rvDivider,
  rvLearnings,
  rvMentalModels,
  rvExplorations,
  rvPrototype,
  resultsDivider,
  resultsLaunch,
  resultsRetention,
  resultsNumbers,
  reflections,
];

// ════════════════════════ VEO — Everyone's a Director ════════════════
const veoHero: Beat = {
  id: "veo-hero",
  label: "open veo",
  navLabel: "Overview",
  command: "open veo",
  bootLines: ["loading case study…", "rendering frame … ok"],
  register: "graphical",
  clear: true,
  title: "veo — case study",
  aside: {
    src: "/portfolio%20transfer/veo/hero/7kaDt3rWZgSMERJ.webp",
    alt: "A frame generated by Veo 2",
  },
  output: [
    line("CASE STUDY · 2025", "term-faint"),
    line("Everyone's a Director.", "term-accent"),
    line(
      "Designing the interface for Veo — Google's most advanced video generation model.",
      "term-dim",
    ),
    line("role: sole interaction designer", "term-faint"),
  ],
};

const veoGlance: Beat = {
  id: "veo-glance",
  label: "cat project.md",
  navLabel: "At a glance",
  command: "cat project.md",
  register: "plain",
  output: [
    line("## PROJECT AT A GLANCE", "term-head"),
    line("team        Google DeepMind · Gemini", "term-dim"),
    line("timeline    Jan 2025 → Apr 2025 ship", "term-dim"),
    line("platforms   iOS · Android · Web", "term-dim"),
    line("scope       End-to-end video generation experience", "term-dim"),
    line("role        Sole interaction designer", "term-accent"),
    line("core team   1 PM · 1 tPGM · 2 engineers", "term-dim"),
    line("partners    Legal · Research · Marketing", "term-dim"),
  ],
};

const veoLandscape: Beat = {
  id: "veo-landscape",
  label: "cat landscape.md",
  command: "cat landscape.md",
  register: "graphical",
  output: [
    line("## THE LANDSCAPE", "term-head"),
    line("The competitive landscape."),
    line(
      "OpenAI dominated the conversation, but the media-gen ecosystem was wide and changing fast — new players, new modalities, new flows shipping every month.",
      "term-dim",
    ),
    gap(),
    preview("veo-landscape-img", {
      src: "/portfolio%20transfer/veo/competitive%20landscape/251006-Sora-2-openai-aa-237-1e9e42.jpg",
      alt: "OpenAI Sora 2 announcement",
      name: "sora-2.jpg",
      width: 1500,
      height: 1000,
    }),
  ],
};

const veoCapabilities: Beat = {
  id: "veo-capabilities",
  label: "cat capabilities.md",
  command: "cat capabilities.md",
  register: "graphical",
  output: [
    line("## THE MODEL", "term-head"),
    line("The capabilities."),
    line(
      "Inside Google DeepMind, a new video model — Veo 2 — had moved past research into a state-of-the-art capability ready for a consumer surface.",
      "term-dim",
    ),
    gap(),
    preview("veo-capability-img", {
      src: "/portfolio%20transfer/veo/veo2_stage.webp",
      alt: "Veo 2 — Google DeepMind's state-of-the-art video generation model",
      name: "veo2.webp",
      width: 1024,
      height: 682,
    }),
  ],
};

const veoGoal: Beat = {
  id: "veo-goal",
  label: "cat goal.md",
  navLabel: "Goal",
  command: "cat goal.md",
  bootLines: ["// the thesis"],
  register: "plain",
  output: [
    line("🎯 GOAL", "term-head"),
    gap(),
    line("Ship the world's best video gen model — fast.", "term-quote"),
    gap(),
    line("## best", "term-accent"),
    line(
      "Veo 2 leads on motion quality, physics, and prompt adherence — a genuine step change in what video gen can do.",
      "term-dim",
    ),
    gap(),
    line("## fast", "term-accent"),
    line(
      "SOTA doesn't last forever — speed to market is the difference between defining the category and chasing it.",
      "term-dim",
    ),
  ],
};

const veoApproach: Beat = {
  id: "veo-approach",
  label: "ls explorations/",
  navLabel: "Approach",
  command: "ls explorations/",
  register: "plain",
  output: [
    line("What guided my explorations?"),
    gap(),
    line("## 01 — Understanding the landscape", "term-head"),
    line(
      "Independent research on the media-gen space — how competitors structured flows, what users expected, where existing products created friction.",
      "term-dim",
    ),
    gap(),
    line("## 02 — Navigating technical constraints", "term-head"),
    line(
      "Video gen has hard constraints image gen doesn't: longer waits, larger files, complex preview states. Lean and intuitive within them — immediate user value, not a feature-complete suite.",
      "term-dim",
    ),
    gap(),
    line("## 03 — Sharing as the growth engine", "term-head"),
    line(
      "A generated video is shareable in a way a text response never is. I designed download/share as a first-class feature — the data validated it: 34% of generations downloaded vs. 11% for image.",
      "term-dim",
    ),
  ],
};

const veoPrototype: Beat = {
  id: "veo-prototype",
  label: "open prototype",
  command: "open video-generation.proto",
  bootLines: ["launching prototype…"],
  register: "graphical",
  output: [
    linkLine(
      "veo-proto-link",
      "video-generation prototype",
      "/archive/prototypes/video-generation?embed=1",
    ),
  ],
};

const veoResultsDivider = divider({
  id: "veo-results-divider",
  command: "./results",
  title: "📈 The Results",
  meta: "the conversation, taken back",
  windowTitle: "veo — results",
  navLabel: "Results",
});

const veoLaunch: Beat = {
  id: "veo-launch",
  label: "cat launch.md",
  command: "cat launch.md",
  register: "graphical",
  output: [
    line("## LAUNCH & VISIBILITY", "term-head"),
    line("46%", "term-stat"),
    line("Of I/O 2025 social mentions.", "term-dim"),
    gap(),
    line("+19%", "term-stat"),
    line("Share of voice vs. ChatGPT.", "term-dim"),
    gap(),
    line(
      "Veo dominated the conversation at I/O 2025 — taking the video-gen narrative back from ChatGPT's Sora.",
      "term-dim",
    ),
  ],
};

const veoAdoption: Beat = {
  id: "veo-adoption",
  label: "cat adoption.md",
  command: "cat adoption.md",
  register: "graphical",
  output: [
    line("## ADOPTION & ENGAGEMENT", "term-head"),
    line("+230%", "term-stat"),
    line("DAU growth, first month.", "term-dim"),
    gap(),
    line("1M", "term-stat"),
    line("Highly-engaged weekly users.", "term-dim"),
    gap(),
    line("~40%", "term-stat"),
    line("Day-2 return on Veo 3.", "term-dim"),
    gap(),
    line("3×", "term-stat"),
    line("More downloads than image gen.", "term-dim"),
  ],
};

const veoPress: Beat = {
  id: "veo-press",
  label: "echo reaction",
  navLabel: "Reaction",
  command: 'echo "$REACTION"',
  register: "plain",
  feature: true,
  output: [
    line(
      "💬 Users praised Veo 2's exceptional quality and intuitive simplicity.",
      "term-quote",
    ),
    gap(),
    line("— gUP User Insights", "term-faint"),
  ],
};

const VEO_BEATS: Beat[] = [
  veoHero,
  veoGlance,
  veoLandscape,
  veoCapabilities,
  veoGoal,
  veoApproach,
  veoPrototype,
  veoResultsDivider,
  veoLaunch,
  veoAdoption,
  veoPress,
];

// ── Assembly: tag each beat with its track ───────────────────────────
const withTrack = (beats: Beat[], track: Track): Beat[] =>
  beats.map((b) => ({ ...b, track }));

export const BEATS: Beat[] = [
  ...withTrack(HOME_BEATS, "home"),
  ...withTrack(GEMINI_BEATS, "gemini"),
  ...withTrack(VEO_BEATS, "veo"),
];
