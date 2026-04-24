import type { SectionId } from "./stories";

export type TickerTone = "neutral" | "warn" | "critical";

export type Block =
  | {
      kind: "hero-feature";
      featureId: string;
      briefIds: string[];
      opinionIds: string[];
    }
  | {
      kind: "hero-standard";
      ledeId: string;
      secondaryIds: string[];
      opinionIds: string[];
    }
  | {
      kind: "hero-breaking";
      ledeId: string;
      secondaryIds: string[];
      updates?: { time: string; text: string }[];
    }
  | {
      kind: "opinions";
      opinionIds: string[];
    }
  | {
      kind: "row";
      // proportional widths on desktop, e.g. [2, 1] or [3, 1, 1]
      weights?: number[];
      children: Block[];
    }
  | {
      kind: "ticker";
      tone: TickerTone;
      items: string[];
    }
  | {
      kind: "live-updates";
      title: string;
      items: { time: string; text: string; emphasis?: boolean }[];
    }
  | {
      kind: "band";
      title: string;
      section: SectionId;
      variant: "wide" | "split" | "list";
      leadId: string;
      secondaryIds: string[];
      tailIds: string[];
    }
  | {
      kind: "band-investigation";
      title: string;
      storyId: string;
    }
  | {
      kind: "briefs";
      title: string;
      storyIds: string[];
    };

export type Edition = {
  id: number;
  label: string;
  blurb: string;
  accent: string;
  dateline?: string;
  blocks: Block[];
};

export const EDITIONS: Edition[] = [
  // ─── 0 · ALL QUIET ──────────────────────────────────────────────────────
  {
    id: 0,
    label: "All Quiet",
    blurb: "A genuinely uneventful day.",
    accent: "#8a9b84",
    dateline: "Monday, April 13, 2026 — The Morning Edition",
    blocks: [
      {
        kind: "hero-feature",
        featureId: "l0-lede",
        briefIds: ["l0-s1", "l0-s2"],
        opinionIds: ["l0-o1", "l0-o2", "l0-o3", "l0-o4", "l0-o5"],
      },
      {
        kind: "band",
        title: "Politics",
        section: "politics",
        variant: "wide",
        leadId: "l0p1",
        secondaryIds: ["l0p2", "l0p3"],
        tailIds: ["l0p4", "l0p5"],
      },
      {
        kind: "band",
        title: "World",
        section: "world",
        variant: "split",
        leadId: "l0w1",
        secondaryIds: ["l0w2", "l0w3"],
        tailIds: ["l0w4", "l0w5"],
      },
      {
        kind: "band",
        title: "Business & Tech",
        section: "business",
        variant: "wide",
        leadId: "l0b1",
        secondaryIds: ["l0b2", "l0b3"],
        tailIds: ["l0b4", "l0b5"],
      },
      {
        kind: "briefs",
        title: "Around the country",
        storyIds: ["l0p3", "l0p4", "l0p5", "l0w3", "l0w4", "l0w5", "l0b3", "l0b4"],
      },
      {
        kind: "band",
        title: "Style & Well+Being",
        section: "style",
        variant: "list",
        leadId: "l0s1",
        secondaryIds: ["l0s2", "l0s3", "l0s4"],
        tailIds: ["l0s5"],
      },
    ],
  },

  // ─── 1 · SLOW DAY ───────────────────────────────────────────────────────
  {
    id: 1,
    label: "A Slow Day",
    blurb: "Process, not drama.",
    accent: "#c8b898",
    dateline: "Tuesday, April 14, 2026 — Today's Edition",
    blocks: [
      {
        kind: "hero-standard",
        ledeId: "l1-lede",
        secondaryIds: ["l1-s1", "l1-s2"],
        opinionIds: ["l1-o1", "l1-o2", "l1-o3", "l1-o4", "l1-o5"],
      },
      {
        kind: "band",
        title: "Politics",
        section: "politics",
        variant: "wide",
        leadId: "l1p1",
        secondaryIds: ["l1p2", "l1p3"],
        tailIds: ["l1p4", "l1p5"],
      },
      {
        kind: "band",
        title: "World",
        section: "world",
        variant: "split",
        leadId: "l1w1",
        secondaryIds: ["l1w2", "l1w3"],
        tailIds: ["l1w4", "l1w5"],
      },
      {
        kind: "band",
        title: "Business & Tech",
        section: "business",
        variant: "wide",
        leadId: "l1b1",
        secondaryIds: ["l1b2", "l1b3"],
        tailIds: ["l1b4", "l1b5"],
      },
      {
        kind: "band",
        title: "Style & Well+Being",
        section: "style",
        variant: "list",
        leadId: "l1s1",
        secondaryIds: ["l1s2", "l1s3", "l1s4"],
        tailIds: ["l1s5"],
      },
    ],
  },

  // ─── 2 · DAY WITH TEETH ─────────────────────────────────────────────────
  {
    id: 2,
    label: "A Day With Teeth",
    blurb: "Standoffs, scrambles, investigations.",
    accent: "#b67a5e",
    dateline: "Wednesday, April 15, 2026 — Today's Edition",
    blocks: [
      {
        kind: "hero-standard",
        ledeId: "l2-lede",
        secondaryIds: ["l2-s1", "l2-s2"],
        opinionIds: ["l2-o1", "l2-o2", "l2-o3", "l2-o4", "l2-o5"],
      },
      {
        kind: "band",
        title: "Politics",
        section: "politics",
        variant: "wide",
        leadId: "l2p1",
        secondaryIds: ["l2p2", "l2p3"],
        tailIds: ["l2p4", "l2p5"],
      },
      {
        kind: "band",
        title: "World",
        section: "world",
        variant: "split",
        leadId: "l2w1",
        secondaryIds: ["l2w2", "l2w3"],
        tailIds: ["l2w4", "l2w5"],
      },
      {
        kind: "band-investigation",
        title: "The Ledger Investigates",
        storyId: "l2b1",
      },
      {
        kind: "band",
        title: "Business & Tech",
        section: "business",
        variant: "list",
        leadId: "l2b2",
        secondaryIds: ["l2b3", "l2b4"],
        tailIds: ["l2b5"],
      },
      {
        kind: "band",
        title: "Style & Well+Being",
        section: "style",
        variant: "wide",
        leadId: "l2s1",
        secondaryIds: ["l2s2", "l2s3", "l2s4"],
        tailIds: ["l2s5"],
      },
    ],
  },

  // ─── 3 · STORM WARNINGS ─────────────────────────────────────────────────
  {
    id: 3,
    label: "Storm Warnings",
    blurb: "Escalation across fronts. Markets flinch.",
    accent: "#a3132a",
    dateline: "Thursday, April 16, 2026 — Developing Edition",
    blocks: [
      {
        kind: "ticker",
        tone: "warn",
        items: [
          "OIL $164/bbl ▲",
          "DOW HALTED · −1,400",
          "GOLD +6.4%",
          "VIX 42",
          "FOUR STATES DECLARE EMERGENCY",
          "DHS OVERNIGHT BRIEFING",
        ],
      },
      {
        kind: "hero-breaking",
        ledeId: "l3-lede",
        secondaryIds: ["l3-s1", "l3-s2"],
        updates: [
          { time: "23:41", text: "Second carrier group departs Norfolk, ordered to the Gulf" },
          { time: "22:18", text: "Regional grid operator confirms coordinated intrusion across four states" },
          { time: "21:04", text: "Tehran releases statement promising 'wider response'; analysts parse the wording" },
          { time: "19:15", text: "NYSE halts trading for the second time; oil closes at $164" },
        ],
      },
      {
        kind: "row",
        weights: [2, 1],
        children: [
          {
            kind: "live-updates",
            title: "Washington, overnight",
            items: [
              { time: "03:12", text: "Senate leadership whips votes on emergency war-powers measure" },
              { time: "02:40", text: "White House counsel files memo asserting expanded Article II authority", emphasis: true },
              { time: "02:05", text: "Supreme Court agrees to hear emergency challenge on Monday" },
              { time: "01:28", text: "DOJ opens probe into alleged destruction of classified records" },
              { time: "00:44", text: "Governors federate emergency mutual-aid compact" },
            ],
          },
          {
            kind: "opinions",
            opinionIds: ["l3-o1", "l3-o2", "l3-o3", "l3-o4", "l3-o5"],
          },
        ],
      },
      {
        kind: "band",
        title: "Politics",
        section: "politics",
        variant: "wide",
        leadId: "l3p1",
        secondaryIds: ["l3p2", "l3p3"],
        tailIds: ["l3p4", "l3p5"],
      },
      {
        kind: "band",
        title: "World",
        section: "world",
        variant: "split",
        leadId: "l3w1",
        secondaryIds: ["l3w2", "l3w3"],
        tailIds: ["l3w4", "l3w5"],
      },
      {
        kind: "band",
        title: "Markets",
        section: "business",
        variant: "wide",
        leadId: "l3b1",
        secondaryIds: ["l3b2", "l3b3"],
        tailIds: ["l3b4", "l3b5"],
      },
      {
        kind: "band",
        title: "Well+Being",
        section: "style",
        variant: "list",
        leadId: "l3s1",
        secondaryIds: ["l3s2", "l3s3", "l3s4"],
        tailIds: ["l3s5"],
      },
    ],
  },

  // ─── 4 · SHTF ───────────────────────────────────────────────────────────
  {
    id: 4,
    label: "Shit Hits The Fan",
    blurb: "Compounding crises. The guardrails are named.",
    accent: "#2a2e33",
    dateline: "Friday, April 17, 2026 — Crisis Edition · Updated continuously",
    blocks: [
      {
        kind: "ticker",
        tone: "critical",
        items: [
          "GLOBAL MARKETS SUSPENDED",
          "OIL LAST: $212 (HALTED)",
          "GOLD ALL-TIME HIGH",
          "MARTIAL LAW · 4 STATES",
          "88M WITHOUT POWER",
          "U.S. AIRSPACE CLOSED",
          "NATO ARTICLE 4 CONSULTATIONS",
        ],
      },
      {
        kind: "hero-breaking",
        ledeId: "l4-lede",
        secondaryIds: ["l4-s1", "l4-s2"],
        updates: [
          { time: "04:22", text: "President addresses nation from Raven Rock; full transcript posted" },
          { time: "03:58", text: "AG resigns via one-sentence letter; Deputy AG refuses to sign orders" },
          { time: "03:30", text: "Supreme Court issues 6–3 emergency order; White House signals noncompliance" },
          { time: "02:47", text: "Cloud providers confirm 'significant disruption' in three U.S. regions" },
          { time: "01:12", text: "14 oil facilities confirmed hit overnight; Strait of Hormuz closed" },
        ],
      },
      {
        kind: "row",
        weights: [2, 1],
        children: [
          {
            kind: "live-updates",
            title: "The last twelve hours",
            items: [
              { time: "05:04", text: "Senate invokes extraordinary session; impeachment articles drafted", emphasis: true },
              { time: "04:41", text: "Two of the Joint Chiefs reportedly 'reviewing lawful orders'" },
              { time: "04:02", text: "Governors of CA, NY, IL convene joint emergency briefing" },
              { time: "03:14", text: "Russia moves 40,000 troops toward a third Ukrainian border sector" },
              { time: "02:55", text: "China seizes a Taiwanese-flagged vessel; Taipei elevates alert" },
              { time: "02:18", text: "North Korea test-fires two ICBMs within an hour" },
              { time: "01:44", text: "Saudi Arabia closes airspace; Doha and Abu Dhabi evacuate diplomats" },
            ],
          },
          {
            kind: "opinions",
            opinionIds: ["l4-o1", "l4-o2", "l4-o3", "l4-o4", "l4-o5"],
          },
        ],
      },
      {
        kind: "band-investigation",
        title: "Constitutional Crisis",
        storyId: "l4p1",
      },
      {
        kind: "band",
        title: "The War",
        section: "world",
        variant: "wide",
        leadId: "l4w1",
        secondaryIds: ["l4w2", "l4w3"],
        tailIds: ["l4w4", "l4w5"],
      },
      {
        kind: "band",
        title: "Markets · Halted",
        section: "business",
        variant: "wide",
        leadId: "l4b1",
        secondaryIds: ["l4b2", "l4b3"],
        tailIds: ["l4b4", "l4b5"],
      },
      {
        kind: "band",
        title: "Politics",
        section: "politics",
        variant: "list",
        leadId: "l4p2",
        secondaryIds: ["l4p3", "l4p4"],
        tailIds: ["l4p5"],
      },
      {
        kind: "band",
        title: "How to get through today",
        section: "style",
        variant: "split",
        leadId: "l4s1",
        secondaryIds: ["l4s2", "l4s3", "l4s4"],
        tailIds: ["l4s5"],
      },
    ],
  },
];

export const DEFAULT_EDITION = 2;
