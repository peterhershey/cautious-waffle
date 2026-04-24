export type Tone = "slate" | "sand" | "sage" | "clay" | "ink" | "none";
export type Size = "lede" | "large" | "medium" | "small" | "text";
export type SectionId =
  | "top"
  | "politics"
  | "world"
  | "opinions"
  | "business"
  | "style";

export type Story = {
  id: string;
  kicker?: string;
  headline: string;
  dek?: string;
  byline?: string;
  meta?: string;
  tone?: Tone;
  size: Size;
  live?: boolean;
  subStories?: Story[];
  bullets?: string[];
};

export type SectionBlock = {
  id: SectionId;
  title: string;
  stories: Story[];
};

export const TONE_BG: Record<Exclude<Tone, "none">, string> = {
  slate: "#5a6672",
  sand: "#c8b898",
  sage: "#8a9b84",
  clay: "#b67a5e",
  ink: "#2a2e33",
};

export const MASTHEAD_NAV = [
  "Politics",
  "Opinions",
  "Style",
  "Investigations",
  "Climate",
  "Well+Being",
  "Business",
  "Tech",
  "World",
  "D.C., Md. & Va.",
  "Sports",
  "LG Intelligence",
  "Ask The Ledger AI",
];

export const TOP_LEDE: Story = {
  id: "lede-1",
  kicker: "Breaking",
  live: true,
  headline:
    "U.S. imposes naval blockade as Trump demands Iran end nuclear program",
  dek:
    "The standoff in the Strait of Hormuz pushed oil past $128 a barrel and sent allies scrambling for a ceasefire framework before the weekend.",
  byline: "By Mara Hendricks and Suazrmon Goolge",
  tone: "slate",
  size: "lede",
};

export const TOP_SECONDARY: Story[] = [
  {
    id: "sec-1",
    headline:
      "As war drags on, midterm forecasts for Republicans get even worse",
    dek:
      "Internal polling shows slippage across seven battleground districts, with suburban women moving fastest.",
    byline: "By Devon Hayes",
    size: "medium",
    tone: "sand",
  },
  {
    id: "sec-2",
    headline:
      "Treasury quietly widens sanctions list to cover a dozen shell entities",
    size: "small",
    subStories: [
      {
        id: "sec-2a",
        headline: "How the sanctions reach Hong Kong intermediaries",
        size: "text",
      },
      {
        id: "sec-2b",
        headline: "Banks scramble to comply before Monday's open",
        size: "text",
      },
    ],
  },
];

export const TOP_OPINIONS: Story[] = [
  {
    id: "op-1",
    kicker: "Editorial Board",
    headline: "The lessons of Viktor Orbán's defeat",
    size: "text",
    tone: "clay",
  },
  {
    id: "op-2",
    kicker: "Marc A. Thiessen",
    headline: "Trump flips the script in the Strait of Hormuz",
    size: "text",
    tone: "sand",
  },
  {
    id: "op-3",
    kicker: "George Weigel",
    headline:
      "The fundamental misunderstanding behind the Trump vs. Pope Leo mess",
    size: "text",
    tone: "slate",
  },
  {
    id: "op-4",
    kicker: "Max Boot",
    headline: "Orbán's loss shows the Achilles' heel of populist power",
    size: "text",
    tone: "sage",
  },
  {
    id: "op-5",
    kicker: "Jennifer Rubin",
    headline: "A Democratic bench that, for once, is not lacking",
    size: "text",
    tone: "ink",
  },
];

export const SECTIONS: SectionBlock[] = [
  {
    id: "politics",
    title: "Politics",
    stories: [
      {
        id: "p-1",
        kicker: "Analysis",
        headline:
          "Inside the 72-hour scramble to rewrite the war-powers resolution",
        dek:
          "Four senators, one blank Word document, and a phone call from the West Wing that nobody wanted.",
        byline: "By Ellison Carter",
        tone: "ink",
        size: "large",
        subStories: [
          {
            id: "p-1a",
            headline: "The four senators trying to narrow the authorization",
            size: "text",
          },
          {
            id: "p-1b",
            headline: "White House counsel's memo, annotated",
            size: "text",
          },
        ],
      },
      {
        id: "p-2",
        headline:
          "House GOP leadership quietly revives a discharge petition on voting rights",
        byline: "By Ruth Paek",
        size: "medium",
        bullets: [
          "Five Republicans said to be considering the move",
          "Floor vote could come by Thursday if signatures hold",
          "Leadership denies knowledge; members describe 'quiet encouragement'",
        ],
      },
      {
        id: "p-3",
        headline: "A Senate staffer's 2 a.m. email that changed the bill",
        size: "small",
      },
      {
        id: "p-4",
        headline:
          "Governors in seven states move to pre-empt a federal rollback on abortion data",
        size: "small",
      },
      {
        id: "p-5",
        headline: "Fact-checking last night's prime-time address",
        meta: "14 min read",
        size: "text",
      },
    ],
  },
  {
    id: "world",
    title: "World",
    stories: [
      {
        id: "w-1",
        kicker: "Dispatch",
        headline:
          "In a quiet Warsaw neighborhood, Ukrainian teenagers build a newsroom",
        dek:
          "They publish in three languages, from a converted bakery, on a deadline nobody imposed.",
        byline: "By Kaja Lindqvist",
        tone: "sage",
        size: "large",
      },
      {
        id: "w-2",
        headline: "China pauses rare-earth exports to a third trading partner",
        size: "medium",
        tone: "sand",
        subStories: [
          {
            id: "w-2a",
            headline: "Why Detroit is already feeling the squeeze",
            size: "text",
          },
          {
            id: "w-2b",
            headline: "The one alternative mine nobody can get permitted",
            size: "text",
          },
        ],
      },
      {
        id: "w-3",
        headline:
          "Egypt's new capital, four years in, finds its first neighborhoods",
        size: "small",
      },
      {
        id: "w-4",
        headline:
          "A quiet purge inside Argentina's statistics bureau raises alarms",
        size: "small",
      },
      {
        id: "w-5",
        headline: "What the French dockworkers are actually asking for",
        size: "text",
      },
      {
        id: "w-6",
        headline: "Seoul's housing market has a new, very strange listing",
        size: "text",
      },
    ],
  },
  {
    id: "business",
    title: "Business & Tech",
    stories: [
      {
        id: "b-1",
        kicker: "Investigation",
        headline:
          "The payments startup that paid itself: a six-month investigation",
        dek:
          "Regulators ignored three complaints. The board chair personally approved the last one.",
        byline: "By The Ledger Investigates team",
        tone: "clay",
        size: "large",
        bullets: [
          "Over $240M in looping internal transfers",
          "Two former auditors on record, one still employed",
          "Read the full 14,000-word story",
        ],
      },
      {
        id: "b-2",
        headline: "Why every major model launch this quarter slipped",
        size: "medium",
        tone: "slate",
        subStories: [
          {
            id: "b-2a",
            headline: "The GPU shipment that didn't arrive",
            size: "text",
          },
          { id: "b-2b", headline: "Post-training is the new pre-training", size: "text" },
        ],
      },
      {
        id: "b-3",
        headline:
          "Apple's services business just quietly passed its hardware unit",
        size: "small",
      },
      { id: "b-4", headline: "A Fed governor breaks ranks, on the record", size: "small" },
      {
        id: "b-5",
        headline: "The one line item analysts are watching on Thursday",
        size: "text",
      },
    ],
  },
  {
    id: "style",
    title: "Style & Well+Being",
    stories: [
      {
        id: "s-1",
        kicker: "The look",
        headline: "Grief, tailored: a generation rethinks what to wear to funerals",
        dek: "Charcoal is out. Cream, unexpectedly, is in.",
        byline: "By Mira Okonkwo",
        tone: "sand",
        size: "large",
      },
      {
        id: "s-2",
        headline: "The quiet return of the dinner party, on Tuesdays",
        size: "medium",
        tone: "sage",
      },
      {
        id: "s-3",
        headline:
          "What your sleep tracker still refuses to tell you, and why",
        size: "small",
      },
      { id: "s-4", headline: "A chef who only cooks one thing, very well", size: "small" },
      { id: "s-5", headline: "The walking routine nobody is marketing", size: "text" },
      { id: "s-6", headline: "On the tyranny of the 5 a.m. morning", size: "text" },
    ],
  },
];
