// whatispeterupto — content.
// Five slides, then two case-study cards, then a CTA.

// ——— 01. HERO ———
export const hero = {
  label: "INDEX · 00",
  emoji: "🍫",
  greeting: "Hi, I'm",
  name: "Peter Hershey.",
  bio: [
    "I grew up in Lancaster, Pennsylvania. These days I live in California, where I work as a Senior AI Product Designer at Google DeepMind — helping make state-of-the-art AI accessible to over 750 million people around the world.",
    "And no, not related to the candy company. Same corner of Pennsylvania, different family. I get asked a lot.",
  ],
};

// ——— 02. CREATOR ———
export const creator = {
  label: "ALWAYS A CREATOR · 01",
  title: "A creator,\nbefore anything else.",
  kicker: "The tools keep changing. The instinct doesn't.",
  body: [
    "I've been making things my whole life.",
    "As a kid I was shooting stop-motion films with my Playmobil castle. At 15 I talked the local paper into letting me draw a weekly cartoon. I've been playing violin for over 30 years. In college I flew to Myanmar and Thailand to make a documentary. Every few years the medium shifts: photography, generative art in TouchDesigner, now AI. Each time it feels like learning a new instrument.",
    "The creative impulse is the same one it's always been. What keeps it exciting is that the way you express it never stays still.",
  ],
};

// ——— 03. EMPATHY / TRAVEL ———
export const empathy = {
  label: "SEEING PEOPLE CLEARLY · 02",
  title: "Design is empathy.\nTravel is practice.",
  countryCount: "~50",
  countryLabel: "countries",
  body: [
    "I've been to almost 50 countries. Not to collect stamps, but because I think seeing how other people live is the most important thing a designer can do.",
    "Good design comes from understanding people who aren't like you. What they need, how they think, what their day actually looks like. You can learn that in a village in Myanmar or on a street corner in your own city. The distance doesn't matter. What matters is paying attention and not assuming you already know.",
    "That instinct sits underneath everything I design. The best work I've done has come from listening closely to people whose lives look nothing like mine and building something that actually fits.",
  ],
};

// ——— 04. DC ———
export const dc = {
  label: "DC YEARS · 03",
  title: "I cut my teeth\nin Washington, DC.",
  kicker: "Where I learned to design in complexity.",
  body: [
    "My first real design job was at Accenture Federal, building digital experiences for the US Postal Service, the USDA, and other federal agencies. Government work means working within serious constraints: legacy systems, layered stakeholders, regulatory requirements at every turn. It taught me how to move forward when nothing is simple.",
    "From there I went to the Washington Post, where I helped lead the first homepage redesign in a decade for one of the most-read sites in American journalism. On the side, I was shooting freelance photography on Capitol Hill and working my way through DC's restaurant scene — a city where a Michelin-starred tasting menu and the best half-smoke of your life can be ten minutes apart.",
    "DC is where I learned to thrive in ambiguity — and it shows up in everything I've done since.",
  ],
};

export const dcLogos = [
  { id: "wapo",      display: "The Washington Post", weight: "serif" as const },
  { id: "accenture", display: "accenture",           weight: "brand" as const },
  { id: "usps",      display: "USPS",                weight: "brand" as const },
  { id: "usda",      display: "USDA",                weight: "brand" as const },
];

// ——— 05. THE INVITATION ———
export const invitation = {
  label: "WHAT I DO BEST · 04",
  title: "Let's tackle something\nbig and scary.",
  kicker: "I'm at my best when the stakes are high and the path forward isn't clear yet.",
  body: [
    "There's a pattern in the work I keep getting pulled into: a large organization reaches a point where the old approach no longer works and the new one hasn't been figured out yet.",
    "At the Washington Post, that meant rethinking the homepage for a fundamentally different news cycle. At Google, it meant helping transition a billion users from the Assistant era into Gemini. I pitched the apps that shipped, shaped Gemini Live, and contributed to Veo. Two patents came out of that work.",
    "I love these problems. The bigger and scarier, the better.",
  ],
  footer: "Below are two case studies that show what that looks like up close.",
};

// ——— CASE STUDIES ———
export type CaseStudy = {
  id: string;
  kicker: string;
  title: string;
  blurb: string;
  tone: "rose" | "navy";
  accent: "mint" | "mustard" | "terracotta";
  href?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-wapo",
    kicker: "CASE STUDY · 2014",
    title: "Washington Post Homepage",
    blurb: "A homepage redesign for a fundamentally different news cycle.",
    tone: "rose",
    accent: "mustard",
  },
  {
    id: "cs-gemini",
    kicker: "CASE STUDY · 2025",
    title: "Teaching Gemini to See",
    blurb:
      "Gemini Live Video & Visual Overlays — designing what it feels like when a model can see what you're talking about.",
    tone: "navy",
    accent: "mint",
    href: "/whatispeterupto/case-studies/teaching-gemini-to-see",
  },
];

// ——— CASE STUDY DETAIL (full long-form page) ———
export type CaseStudyToneKey =
  | "mint"
  | "mustard"
  | "terracotta"
  | "rose"
  | "navy"
  | "ink"
  | "ink-dim"
  | "ink-faint";

export type CaseStudyStat = {
  value: string;
  label: string;
  tone: CaseStudyToneKey;
};

export type CaseStudyImageWell = {
  caption: string;
  aspect?: "wide" | "phone" | "square";
};

export type CaseStudyPressQuote = {
  quote: string;
  attribution: string;
  tone: "mint" | "mustard" | "terracotta" | "rose" | "navy" | "paper";
};

export type CaseStudySection =
  | {
      kind: "prose";
      label: string;
      labelTone: CaseStudyToneKey;
      title: string;
      kicker?: string;
      body: string[];
      stats?: CaseStudyStat[];
      imageWell?: CaseStudyImageWell;
    }
  | {
      kind: "act";
      label: string;
      tone: "rose" | "navy" | "mustard" | "mint" | "terracotta";
      act: string;
      title: string;
      setup: string;
      body: string[];
      pullQuote?: string;
      imageWell?: CaseStudyImageWell;
      city?: "nyc" | "zurich" | "mxcity";
      stamp?: { city: string; date: string };
    }
  | {
      kind: "impact";
      label: string;
      labelTone: CaseStudyToneKey;
      title: string;
      stats: CaseStudyStat[];
      pressQuotes: CaseStudyPressQuote[];
      notes?: string[];
      honest?: string;
    }
  | {
      kind: "reflections";
      label: string;
      labelTone: CaseStudyToneKey;
      title: string;
      items: { heading: string; body: string }[];
    };

export type CaseStudyDetail = {
  id: string;
  slug: string;
  meta: {
    role: string;
    team: string;
    shipped: string;
    platforms: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    glyphs?: string[];
  };
  sections: CaseStudySection[];
};

export const caseStudyDetails: CaseStudyDetail[] = [
  {
    id: "cs-gemini",
    slug: "teaching-gemini-to-see",
    meta: {
      role: "Lead visual designer (Live Video) · sole UX designer (Visual Overlays)",
      team: "Google DeepMind · Gemini",
      shipped: "March 2025 (Live Video) · Summer 2025 (Visual Overlays)",
      platforms: "iOS · Android",
    },
    hero: {
      kicker: "CASE STUDY · 2025",
      title: "Teaching Gemini\nto See.",
      subtitle:
        "Gemini Live Video & Visual Overlays — designing what it feels like when a model can look at what you're looking at.",
      glyphs: ["👁️"],
    },
    sections: [
      {
        kind: "prose",
        label: "THE PROBLEM · 01",
        labelTone: "mustard",
        title: "Gemini Live\ncould <em>hear</em> you.\nIt couldn't see.",
        kicker:
          "A broken faucet. A foreign menu. A strange rash. Gemini had no input channel for any of it.",
        body: [
          "Gemini Live was voice-only. You could have a back-and-forth conversation, but the model couldn't see what you were talking about. The interface was rich in voice, empty in vision — a strange gap for a product people were already reaching for to help them understand the physical world.",
          "Research was clear about where users were actually going. Roughly a fifth to a third of phone calls in the U.S. are already video. Project Astra showed video input meaningfully extended session length vs. voice-only. Competitive pressure was converging on the same capability, in the same window, with the same deadline.",
          "The deadline was Samsung Unpacked. Leadership wanted a working, shipping feature. Two months, prototype to product.",
        ],
        stats: [
          { value: "~20–30%", label: "of phone calls\nare already video", tone: "mustard" },
          { value: "2 months", label: "prototype\nto shipped product", tone: "terracotta" },
          { value: "Unpacked", label: "Samsung's stage\nwas the deadline", tone: "mint" },
        ],
        imageWell: {
          caption: "Broken-boot demo prototype, pre-workshop",
          aspect: "wide",
        },
      },
      {
        kind: "prose",
        label: "MY ROLE · 02",
        labelTone: "rose",
        title: "What ships in two months\nis the <em>tip of the iceberg</em>.",
        kicker:
          "The ship was fast. The work underneath was not.",
        body: [
          "This wasn't a feature assignment that came across my desk. I've owned the input framework for Gemini — mic, camera, keyboard — since the original tiger team that pitched the product to Sundar. Live Video was the tip of years of quiet investment in how people should be able to talk to this thing.",
          "The key reframe: what looks like a two-month sprint is actually a long, compounding exploration of multimodal input finally clicking into a shippable shape. The ship was fast. The work underneath was not.",
          "That distinction matters for how you read what follows.",
        ],
        imageWell: {
          caption: "Multimodal input framework — long view",
          aspect: "wide",
        },
      },
      {
        kind: "act",
        label: "ACT I · NEW YORK · NOV 2024",
        tone: "rose",
        act: "I.",
        title: "Defining the real problem.",
        city: "nyc",
        stamp: { city: "NEW YORK", date: "NOV · 2024" },
        setup:
          "Ten people in a room. AI research team, a small group of conversation designers, and me.",
        body: [
          "On the table: a primitive working prototype. Point a phone at a broken boot — the canonical demo — and Gemini walked you through how to fix it. The prototype worked. The prototype was also wrong.",
          "The UI was visually dense, with persistent affordances for capabilities the model couldn't reliably deliver. The interaction model implied a visual product, but the research data said users were reaching for it like a voice product with eyes. The boot demo was a vertical slice. We had no framework for the breadth of things users would actually point a camera at.",
          "The week didn't produce a design. It produced a frame: real-world scenarios clustered from research transcripts into a usable taxonomy, a clear line between capabilities the model reliably had and ones the UI was promising, and a map of interaction patterns against voice-first vs. visual-first mental models.",
          "That frame became the north star every downstream decision in Zurich and Mexico City would be measured against.",
        ],
        pullQuote:
          "The <em>model</em> is the product. The <em>capability</em> is the experience. The UI's job isn't to add chrome — its job is to get out of the way and only earn the pixels that help users trust what they're seeing.",
        imageWell: {
          caption: "Workshop wall · NYC · Nov 2024",
          aspect: "square",
        },
      },
      {
        kind: "act",
        label: "ACT II · ZURICH · JAN 2025",
        tone: "navy",
        act: "II.",
        title: "The shipping sprint.",
        city: "zurich",
        stamp: { city: "ZÜRICH", date: "JAN · 2025" },
        setup:
          "Two days. One room. Small teams from engineering, product, and UX — just enough of each function to cover the decisions without creating committee drag.",
        body: [
          "The brief was simple: leave with the shipping UI fully designed. The NYC frame needed to translate into pixel-level decisions, and every decision had a latency cost engineering could quote to the millisecond. Async would have stretched this into weeks and diluted the frame with committee compromises.",
          "What was actually hard in the room: latency above all else. Any treatment that slowed the model's response got cut, regardless of how it looked. A lot of the work was saying no to new affordances, states, and indicators — including my own ideas. Discoverability was unsolved, and we knew it. Invisible features in conversational AI products have no native surface. We shipped Live Video knowing that gap existed. It's the gap Act III would try to close.",
          "The full shipping UI came out of two to three days. Live Video shipped in time for Samsung Unpacked and was featured there and at Google I/O 2025.",
        ],
        pullQuote:
          "Two days. <em>One room.</em> Shipping UI designed.",
        imageWell: {
          caption: "Shipping UI · Live Video",
          aspect: "phone",
        },
      },
      {
        kind: "act",
        label: "ACT III · MEXICO CITY · SUMMER 2025",
        tone: "mustard",
        act: "III.",
        title: "Chasing the user signal.",
        city: "mxcity",
        stamp: { city: "CIUDAD DE MÉXICO", date: "SUMMER · 2025" },
        setup:
          "Post-launch research surfaced a real behavior worth designing for.",
        body: [
          "Verbal disambiguation broke down in cluttered scenes. Session recordings showed users struggling to talk Gemini onto a specific screw, spice jar, or button when the frame had multiple candidates. Users spontaneously asked Gemini to \"point at this\" or \"look at that,\" projecting a capability the model didn't yet have. The strongest kind of feature request: the behavior itself.",
          "The response was Visual Overlays. Let Gemini reference a specific object in the frame by drawing a bounding box around it. I ran the workshop remote from Mexico City — one week, cross-functional, aligning two engineering teams: Astra (experimental, prototype owners) and Gemini Live (production, shipping). Different cadences, different assumptions, different models of what was possible. Framed as design. Real output was shared understanding of model capability — what the bounding box could anchor to, how stable the tracking was, what inputs broke it.",
          "The bounding box itself was visually simple. A thin rectangle. What took months to resolve was the choreography between the model's speech and the box's appearance: timing, acknowledgment, and what \"natural\" actually felt like. Does the model announce the box? Describe what it's pointing at without acknowledging the box as UI? Say nothing at all, letting the box carry its own meaning? Does the box appear before, during, or after the relevant phrase in speech?",
          "Each answer produced a distinct feel. Overexplaining read robotic. Silent pointing read confusing. The version that worked felt like the model was glancing at something while it talked, not performing a UI action. A 3D mask that wrapped around the selected object was cut on latency. A soft purple/blue glow effect was cut on latency. The shipped solution: a clean, thin bounding box. Restraint as craft, not timidity.",
          "Visual Overlays shipped as a follow-on feature inside Live Video later that year.",
        ],
        pullQuote:
          "We weren't designing a visual element. We were designing the <em>relationship</em> between an element and a voice.",
        imageWell: {
          caption: "Visual Overlays · bounding box choreography",
          aspect: "wide",
        },
      },
      {
        kind: "impact",
        label: "IMPACT · 03",
        labelTone: "mint",
        title: "By the numbers.",
        stats: [
          { value: "+13%", label: "Gemini Live\nDAU lift", tone: "mint" },
          { value: "+17%", label: "week-over-week\nretention, causal", tone: "mustard" },
          { value: "+3.34%", label: "sustained\nday-over-day lift", tone: "terracotta" },
          { value: "97%", label: "positive-to-neutral\ninitial reactions", tone: "rose" },
        ],
        pressQuotes: [
          {
            quote: "It's genuinely shocking how useful it is.",
            attribution: "Marques Brownlee",
            tone: "navy",
          },
          {
            quote:
              "Lindsay Lohan used it live in an interview to ask Gemini what eye makeup went with her lipstick.",
            attribution: "A public figure using the product as a real tool, not a demo.",
            tone: "rose",
          },
        ],
        notes: [
          "Featured at Samsung Unpacked 2025 and Google I/O 2025.",
          "Hero feature of Samsung's Q2 2025 multimillion-dollar campaign refresh.",
          "MWC 2025 — Android Authority Best of MWC · GLOMO Breakthrough Device Innovation · House of Technology Best AI Innovation · Wired Top New Gadgets.",
        ],
        honest:
          "Visual Overlays — the honest version: adoption came in below projections. More on why that's interesting in Reflections.",
      },
      {
        kind: "reflections",
        label: "REFLECTIONS · 04",
        labelTone: "terracotta",
        title: "Three things\nI'm still pulling on.",
        items: [
          {
            heading: "Design with the grain of the model.",
            body: "Good design in this space starts with a deep understanding of the model itself: what it can actually do, where its edges are, how it behaves under the hood. That understanding is what makes real restraint possible. The UI's job isn't to dress up the model's work. It's to give users the easiest, most intuitive access to what the model is capable of.",
          },
          {
            heading: "In-person collaboration has no real substitute.",
            body: "Remote work is genuinely great, and most of this work happened that way — Mexico City included. But when a decision needs a tight group to converge fast, nothing replaces being in the same room. Zurich produced a shipping UI in two days because we were all there.",
          },
          {
            heading: "Discoverability in conversational AI is an open problem.",
            body: "Visual Overlays underperformed on adoption, and I think the cause is structural. Invisible features need a surface to live on, but every solution currently on the shelf — discovery cards, tooltips, overflow menus — violates the minimalism that makes these products work. That's the tension I most want to keep pulling on.",
          },
        ],
      },
    ],
  },
];

export function getCaseStudyDetail(slug: string): CaseStudyDetail | undefined {
  return caseStudyDetails.find((c) => c.slug === slug);
}

// ——— CONTACT ———
export const contact = {
  email: "hello@whatispeterup.to",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/peterhershey/" },
  ],
};



/* ═══════════════════════════════════════════════════════════════════
   FOLDERSTUFF — the "figjam mode" that explodes out of the folder.
   A wall of polaroid-framed photos and embedded videos.
   ═══════════════════════════════════════════════════════════════════ */

export const FOLDERSTUFF = { w: 3360, h: 2380 };

type FSTone =
  | "terracotta" | "mint" | "mustard" | "rose" | "navy" | "paper" | "neutral";

export type FolderstuffKind = "polaroid" | "video" | "image";

export type FolderstuffItem = {
  id: string;
  kind: FolderstuffKind;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  // polaroid: which color to tint the placeholder photo
  tint?: FSTone;
  // both: caption
  kicker?: string;
  label?: string;
  // video: youtube id + optional start time in seconds
  youtubeId?: string;
  startAt?: number;
};

export const folderstuffItems: FolderstuffItem[] = [
  /* ── VIDEOS — embedded YouTube ── */
  { id: "fs-v1", kind: "video", x:  120, y:  140, w: 380, h: 320, rotate: -2.5,
    youtubeId: "vRs7v0saJlc", kicker: "VIDEO · 01", label: "Watch ↗" },
  { id: "fs-v2", kind: "video", x:  860, y:   80, w: 380, h: 320, rotate:  1.5,
    youtubeId: "lWUAY9wcQac", startAt: 79, kicker: "VIDEO · 02", label: "Watch ↗" },
  { id: "fs-v3", kind: "video", x: 1620, y:  160, w: 380, h: 320, rotate: -1.5,
    youtubeId: "c-vywhqQlYc", kicker: "VIDEO · 03", label: "Watch ↗" },
  { id: "fs-v4", kind: "video", x: 2400, y:  100, w: 380, h: 320, rotate:  2,
    youtubeId: "mYICoM5uGAU", kicker: "VIDEO · 04", label: "Watch ↗" },
  { id: "fs-v5", kind: "video", x:  500, y: 1340, w: 380, h: 320, rotate:  2,
    youtubeId: "nxf7qxUKbDM", kicker: "VIDEO · 05", label: "Watch ↗" },
  { id: "fs-v6", kind: "video", x: 2120, y: 1400, w: 380, h: 320, rotate: -1.5,
    youtubeId: "wHaCAAzEz-A", kicker: "VIDEO · 06", label: "Watch ↗" },

  /* ── POLAROIDS — career & life ── */
  { id: "fs-p01", kind: "polaroid", x:  580, y:  500, w: 280, h: 320, rotate: -3, tint: "mustard",    kicker: "2014",            label: "Washington Post homepage" },
  { id: "fs-p02", kind: "polaroid", x: 1280, y:  490, w: 280, h: 320, rotate:  2, tint: "terracotta", kicker: "GOOGLE I/O '25",  label: "Veo 3 reveal" },
  { id: "fs-p03", kind: "polaroid", x: 2080, y:  510, w: 280, h: 320, rotate: -2, tint: "rose",       kicker: "GEMINI LIVE",     label: "Marques Brownlee demo" },
  { id: "fs-p04", kind: "polaroid", x: 2780, y:  500, w: 280, h: 320, rotate:  2, tint: "mint",       kicker: "MWC 2024",        label: "Live demo, day 1" },
  { id: "fs-p05", kind: "polaroid", x:   80, y:  720, w: 280, h: 320, rotate:  3, tint: "navy",       kicker: "VIOLIN",          label: "Solo recital, age 16" },
  { id: "fs-p06", kind: "polaroid", x:  140, y: 1040, w: 280, h: 320, rotate: -2, tint: "mustard",    kicker: "CARTOONS",        label: "Weekly newspaper, age 15" },
  { id: "fs-p07", kind: "polaroid", x:  920, y:  860, w: 280, h: 320, rotate: -1, tint: "terracotta", kicker: "STOP-MOTION",     label: "Playmobil castle, age 9" },
  { id: "fs-p08", kind: "polaroid", x: 1620, y:  860, w: 280, h: 320, rotate:  2, tint: "mint",       kicker: "DOCUMENTARY",     label: "Myanmar + Thailand" },
  { id: "fs-p09", kind: "polaroid", x: 2320, y:  870, w: 280, h: 320, rotate: -2, tint: "navy",       kicker: "TOUCHDESIGNER",   label: "Generative art set" },
  { id: "fs-p10", kind: "polaroid", x: 2980, y:  860, w: 280, h: 320, rotate:  1, tint: "rose",       kicker: "AI ART",          label: "TouchDesigner → Veo" },
  { id: "fs-p11", kind: "polaroid", x:   80, y: 1380, w: 280, h: 320, rotate:  2, tint: "rose",       kicker: "CAPITOL HILL",    label: "Freelance photography" },
  { id: "fs-p12", kind: "polaroid", x: 1000, y: 1280, w: 280, h: 320, rotate:  2, tint: "navy",       kicker: "USDA",            label: "Farm-bill portal" },
  { id: "fs-p13", kind: "polaroid", x: 1680, y: 1290, w: 280, h: 320, rotate: -2, tint: "mustard",    kicker: "USPS",            label: "Informed delivery" },
  { id: "fs-p14", kind: "polaroid", x: 2620, y: 1290, w: 280, h: 320, rotate:  2, tint: "terracotta", kicker: "DEEPMIND",        label: "London offsite, 2024" },
  { id: "fs-p15", kind: "polaroid", x:   80, y: 1740, w: 280, h: 320, rotate: -2, tint: "mint",       kicker: "TRAVEL",          label: "Kyoto, 2023" },
  { id: "fs-p16", kind: "polaroid", x:  920, y: 1700, w: 280, h: 320, rotate:  1, tint: "mustard",    kicker: "LANCASTER",       label: "Home, Pennsylvania" },
  { id: "fs-p17", kind: "polaroid", x: 1600, y: 1740, w: 280, h: 320, rotate: -1, tint: "rose",       kicker: "DC",              label: "Restaurant scene, late 2010s" },
  { id: "fs-p18", kind: "polaroid", x: 2620, y: 1740, w: 280, h: 320, rotate: -2, tint: "navy",       kicker: "FILM",            label: "Edit bay, 2018" },
  { id: "fs-p19", kind: "polaroid", x:  500, y: 1980, w: 280, h: 320, rotate:  3, tint: "terracotta", kicker: "PORTRAIT",        label: "Peter · SF, 2025" },
  { id: "fs-p20", kind: "polaroid", x: 1240, y: 2080, w: 280, h: 320, rotate: -2, tint: "mint",       kicker: "PATENT",          label: "US-039122 · multimodal" },
  { id: "fs-p21", kind: "polaroid", x: 1960, y: 2060, w: 280, h: 320, rotate:  2, tint: "mustard",    kicker: "VEO",             label: "Stage demo, 2025" },
  { id: "fs-p22", kind: "polaroid", x: 2740, y: 2080, w: 280, h: 320, rotate: -1, tint: "rose",       kicker: "GATES",           label: "Global health dashboard" },

  /* ── IMAGES — borderless tinted squares, pure visual filler ── */
  { id: "fs-i01", kind: "image", x:  440, y:  240, w: 200, h: 200, rotate: -4, tint: "mint" },
  { id: "fs-i02", kind: "image", x: 1220, y:  220, w: 220, h: 220, rotate:  3, tint: "navy" },
  { id: "fs-i03", kind: "image", x: 1960, y:  260, w: 180, h: 180, rotate: -2, tint: "mustard" },
  { id: "fs-i04", kind: "image", x:  400, y: 1040, w: 180, h: 180, rotate:  4, tint: "rose" },
  { id: "fs-i05", kind: "image", x: 2020, y: 1180, w: 200, h: 200, rotate: -3, tint: "terracotta" },
  { id: "fs-i06", kind: "image", x: 2840, y: 1640, w: 220, h: 220, rotate:  2, tint: "mint" },
];
