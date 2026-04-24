export type Turn = {
  speaker: "user" | "assistant";
  text: string;
  holdMs: number;
};

export type Scenario = {
  id: string;
  label: string;
  turns: Turn[];
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
  scenarios: Scenario[];
};

export const prototypes: Prototype[] = [
  {
    slug: "voice-chat",
    kind: "voice-chat",
    title: "Voice chat",
    year: "2026",
    summary:
      "A live, voice-first Gemini. Captions render the turn as it's spoken; the device keeps listening between replies.",
    backgroundVideo: "/prototypes/voice-chat/refining-prompt.mp4",
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
        id: "first-interview",
        label: "First interview",
        turns: [
          {
            speaker: "user",
            text: "I've got a design interview in an hour. Help me warm up?",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "Yes. Tell me about a project where you had to change a teammate's mind.",
            holdMs: 900,
          },
          {
            speaker: "user",
            text: "Okay — the onboarding redesign last spring.",
            holdMs: 500,
          },
          {
            speaker: "assistant",
            text: "Good. Walk me through the moment you realized the old flow wasn't working.",
            holdMs: 1000,
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
