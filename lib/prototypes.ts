export type DoshiRecommendation = {
  id: string;
  title: string;
  body: string;
  icon?: string;
};

// Chips can carry a tiny visual cue when the category warrants one
// (e.g. a pin for a location). Most chips are unadorned — icons are
// reserved for categories where a glyph adds real meaning.
export type DoshiChipCategory = "location" | "subject" | "condition";

export type ToastTone = "warning" | "error" | "info";

export type ToastPayload = {
  id: string;
  tone: ToastTone;
  title: string;
  body?: string;
};

export type DoshiEffect = {
  // Optional ms offset from the start of the turn. Defaults to 0 (fires
  // when the turn's first word lands). Lets a single turn pace multiple
  // chrome changes — e.g. title, then thinking, then a chip.
  at?: number;
} & (
  | { kind: "set-title"; value: string | null }
  | { kind: "set-thinking"; value: boolean }
  | { kind: "add-chip"; id: string; label: string; category?: DoshiChipCategory }
  | { kind: "set-background"; src: string }
  | { kind: "show-recommendations"; cards: DoshiRecommendation[] }
  | { kind: "set-stage"; value: 1 | 2 }
  | { kind: "show-toast"; toast: ToastPayload }
  | { kind: "clear-toast" }
);

export type Turn = {
  speaker: "user" | "assistant";
  text: string;
  holdMs: number;
  effects?: DoshiEffect[];
};

export type Scenario = {
  id: string;
  label: string;
  turns: Turn[];
  backgroundVideo?: string;
};

export type PrototypeKind = "voice-chat" | "video-generation";

export type Prototype = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  kind?: PrototypeKind;
  caseStudyHref?: string;
  caseStudyLabel?: string;
  backgroundVideo?: string;
  doshiBackgroundVideo?: string;
  doshiScenarios?: Scenario[];
  scenarios: Scenario[];
};

export const prototypes: Prototype[] = [
  {
    slug: "voice-chat",
    kind: "voice-chat",
    title: "Gemini Live Realtime Video",
    year: "2026",
    summary:
      "A live, voice-first Gemini. Captions render the turn as it's spoken; the device keeps listening between replies.",
    backgroundVideo: "/prototypes/voice-chat/refining-prompt.mp4",
    doshiBackgroundVideo: "/prototypes/voice-chat/boots/1.mp4",
    doshiScenarios: [
      {
        id: "brown-boots-repair",
        label: "Brown boots repair",
        turns: [
          {
            speaker: "assistant",
            text: "👋 Show me what you're exploring and describe how I can help.",
            holdMs: 1600,
          },
          {
            speaker: "assistant",
            text: "Okay, can you show another angle, and talk through what's wrong with them?",
            holdMs: 2200,
            effects: [
              // Title shows up first.
              { at: 0, kind: "set-title", value: "New journey" },
              // Then the thinking pill, which sits alone in the chip row.
              { at: 1400, kind: "set-thinking", value: true },
              // Title firms up.
              { at: 3200, kind: "set-title", value: "Brown boots repair" },
              // Thinking clears, first real chip arrives.
              { at: 3400, kind: "set-thinking", value: false },
              {
                at: 3500,
                kind: "add-chip",
                id: "info-1",
                label: "brown boots",
                category: "subject",
              },
            ],
          },
          {
            speaker: "assistant",
            text: "Hmm, those scuffs and the paint splatter look rough. Let me get a closer look.",
            holdMs: 1600,
            effects: [
              {
                at: 1200,
                kind: "add-chip",
                id: "info-2",
                label: "discolored with white paint",
                category: "condition",
              },
            ],
          },
          {
            speaker: "assistant",
            text: "Based on the conditions, I'd recommend professional repair by a shoe repair shop. Here are some additional options.",
            holdMs: 2400,
            effects: [
              {
                kind: "add-chip",
                id: "loc-zip",
                label: "90016",
                category: "location",
              },
              { at: 800, kind: "set-stage", value: 2 },
              {
                at: 800,
                kind: "show-recommendations",
                cards: [
                  {
                    id: "rec-pro",
                    title: "Find local shoe repair",
                    body: "Professional cobblers can re-color the leather and clean off the paint splatter for around $40–$70.",
                    icon: "🛠",
                  },
                  {
                    id: "rec-diy",
                    title: "DIY with household goods",
                    body: "Mineral oil or rubbing alcohol can lift fresh paint; finish with a matching leather conditioner.",
                    icon: "🧴",
                  },
                  {
                    id: "rec-replace",
                    title: "Shop a similar pair",
                    body: "If the upper is too far gone, here are three close matches in your size from local resellers.",
                    icon: "👞",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    scenarios: [
      {
        id: "dying-plant",
        label: "Dying plant",
        turns: [
          {
            speaker: "user",
            text: "Hey Gemini, can you help me save my dying plant?",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "Of course! I can definitely help you out. Can you show me the leaves?",
            holdMs: 900,
          },
          {
            speaker: "user",
            text: "Yeah — the tips are brown and a little crispy.",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "That usually means underwatering or too much direct sun. Where does it sit during the day?",
            holdMs: 900,
          },
          {
            speaker: "user",
            text: "South-facing window, full afternoon light.",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "Move it back about two feet and water it slowly until it drains. Check in on it tomorrow.",
            holdMs: 1200,
          },
        ],
      },
      {
        id: "messy-garage",
        label: "Messy garage",
        backgroundVideo: "/prototypes/voice-chat/messygarage.mp4",
        turns: [
          {
            speaker: "user",
            text: "I'm finally cleaning out the garage. What's the right tool for getting these old screws out of the pegboard?",
            holdMs: 600,
          },
          {
            speaker: "assistant",
            text: "Looks like Phillips heads. A #2 Phillips screwdriver will work — but if any are stripped, grab the drill with a screw extractor bit.",
            holdMs: 1100,
          },
          {
            speaker: "user",
            text: "And for cutting down those long boards leaning against the wall?",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "For straight cross-cuts, the circular saw on the bench is your best bet. The hand saw works too, but it'll take ten times as long.",
            holdMs: 1100,
          },
          {
            speaker: "user",
            text: "What about prying that old paint can lid off?",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "A flathead screwdriver under the lip will pop it. If it's really stuck, the pry bar on the shelf above gives you more leverage.",
            holdMs: 1300,
          },
        ],
      },
      {
        id: "pharmacy",
        label: "Pharmacy",
        backgroundVideo: "/prototypes/voice-chat/pharmacy.mp4",
        turns: [
          {
            speaker: "user",
            text: "Okay so this is the Lipitor and that's the Metformin and what's this white one — is it the blood pressure one or the—",
            holdMs: 600,
          },
          {
            speaker: "assistant",
            text: "Let's take it one at a time. Hold up the white bottle and I'll read the label with you.",
            holdMs: 1400,
          },
          {
            speaker: "user",
            text: "Got it — here's the white one.",
            holdMs: 600,
          },
          {
            speaker: "assistant",
            text: "That's Amlodipine, 5 milligrams. It's for blood pressure — taken once daily, ideally in the morning.",
            holdMs: 1400,
          },
        ],
      },
    ],
  },
  {
    slug: "video-generation",
    kind: "video-generation",
    title: "Video generation",
    year: "2026",
    summary:
      "A Gemini mobile flow for generating a short video from a text prompt — tool sheet, streaming prompt, live loader, looping player.",
    scenarios: [
      {
        id: "dog-pool",
        label: "Dog in the pool",
        turns: [
          {
            speaker: "user",
            text: "Generate a video of a dog swimming in a pool with a pink floaty and sunglasses",
            holdMs: 0,
          },
        ],
      },
    ],
  },
];

export function getPrototype(slug: string): Prototype | undefined {
  return prototypes.find((p) => p.slug === slug);
}
