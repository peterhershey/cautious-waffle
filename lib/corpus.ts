import type { Story, SectionId, Tone } from "./stories";

export type Role =
  | "lede"
  | "feature"
  | "investigation"
  | "dispatch"
  | "analysis"
  | "wire"
  | "opinion"
  | "brief"
  | "live"
  | "essay"
  | "markets"
  | "obit";

export type CorpusStory = Story & {
  section: SectionId;
  role: Role;
  weight: 1 | 2 | 3 | 4 | 5;
  intensity: 0 | 1 | 2 | 3 | 4;
};

function s(
  id: string,
  section: SectionId,
  role: Role,
  intensity: CorpusStory["intensity"],
  weight: CorpusStory["weight"],
  story: Omit<Story, "id">,
): CorpusStory {
  return { id, section, role, intensity, weight, ...story };
}

const tone = (t: Tone) => t;

// ────────────────────────────────────────────────────────────────────────────
// Intensity 0 — All Quiet
// ────────────────────────────────────────────────────────────────────────────
const LV0: CorpusStory[] = [
  s("l0-lede", "top", "feature", 0, 5, {
    kicker: "The Morning",
    headline: "After decades, the Chesapeake's oysters are back — and nobody can quite believe it",
    dek: "Three generations of watermen, a stubborn biologist, and a reef nobody thought would take. A quiet ecological comeback, told at dock level.",
    byline: "By Marin Ashford", tone: tone("sage"), size: "lede",
  }),
  s("l0-s1", "top", "feature", 0, 3, {
    headline: "A small town's library just hit 100 years — and a record year for visits",
    dek: "The secret, the head librarian says, is the chairs. Always the chairs.",
    byline: "By Elise Toma", size: "medium", tone: tone("sand"),
  }),
  s("l0-s2", "business", "wire", 0, 2, {
    headline: "Inflation cools for a fourth straight month as wages quietly keep pace",
    size: "small",
    subStories: [
      { id: "l0-s2a", headline: "What the grocery aisle is actually telling us", size: "text" },
      { id: "l0-s2b", headline: "Why economists are cautiously, finally, relaxing", size: "text" },
    ],
  }),
  s("l0-o1", "opinions", "opinion", 0, 2, { kicker: "Editorial Board", headline: "In praise of an uneventful week", size: "text", tone: tone("sage") }),
  s("l0-o2", "opinions", "opinion", 0, 2, { kicker: "Mira Dalal", headline: "The underrated civic virtue of boredom", size: "text", tone: tone("sand") }),
  s("l0-o3", "opinions", "opinion", 0, 2, { kicker: "George Weigel", headline: "Why the Pope's letter on friendship matters", size: "text", tone: tone("clay") }),
  s("l0-o4", "opinions", "opinion", 0, 2, { kicker: "Max Boot", headline: "A good week for diplomats, for once", size: "text", tone: tone("slate") }),
  s("l0-o5", "opinions", "opinion", 0, 2, { kicker: "Jennifer Rubin", headline: "The quiet bipartisan bill nobody noticed", size: "text", tone: tone("ink") }),
  s("l0p1", "politics", "analysis", 0, 4, { kicker: "On the Hill", headline: "A rare unanimous vote passes a veterans' housing bill", dek: "Sponsors from both parties describe a rare, workmanlike week.", byline: "By Ruth Paek", tone: tone("ink"), size: "large" }),
  s("l0p2", "politics", "wire", 0, 3, { headline: "Three governors pledge a joint clean-water compact", size: "medium", tone: tone("sage"), bullets: ["Signed without ceremony", "Covers four river basins", "Modeled on a 1987 agreement"] }),
  s("l0p3", "politics", "brief", 0, 2, { headline: "A quiet ethics reform clears committee, 16–1", size: "small" }),
  s("l0p4", "politics", "brief", 0, 1, { headline: "The senator who still writes handwritten replies", size: "text" }),
  s("l0p5", "politics", "brief", 0, 1, { headline: "A town hall, a question about potholes, an honest answer", size: "text" }),
  s("l0w1", "world", "dispatch", 0, 4, { kicker: "Dispatch", headline: "In a Lisbon neighborhood, a tile-maker trains her thirteenth apprentice", dek: "The craft nearly died; now there's a waitlist.", byline: "By Inês Carvalho", tone: tone("clay"), size: "large" }),
  s("l0w2", "world", "wire", 0, 3, { headline: "A long-disputed border crossing reopens without incident", size: "medium", tone: tone("sand") }),
  s("l0w3", "world", "brief", 0, 2, { headline: "Japan's bullet trains log a year with zero serious delays", size: "small" }),
  s("l0w4", "world", "brief", 0, 1, { headline: "A small island nation declares a marine reserve twice its landmass", size: "text" }),
  s("l0w5", "world", "brief", 0, 1, { headline: "The Parisian baker teaching refugees a trade, one loaf at a time", size: "text" }),
  s("l0b1", "business", "feature", 0, 4, { kicker: "Feature", headline: "The tiny company making the last American sewing needles", dek: "Six employees. One 1940s machine. A two-year backlog.", byline: "By Dana Whitlock", tone: tone("sand"), size: "large" }),
  s("l0b2", "business", "wire", 0, 3, { headline: "Tech layoffs slow for the fourth consecutive quarter", size: "medium", tone: tone("slate") }),
  s("l0b3", "business", "brief", 0, 2, { headline: "A startup is shipping phones you can actually repair yourself", size: "small" }),
  s("l0b4", "business", "brief", 0, 1, { headline: "Housing starts tick up in the Midwest", size: "text" }),
  s("l0b5", "business", "brief", 0, 1, { headline: "What a pleasant Fed meeting sounds like, in transcript", size: "text" }),
  s("l0s1", "style", "feature", 0, 4, { kicker: "The look", headline: "The return, against all odds, of the long letter", dek: "Stamps, patience, and the quiet thrill of a reply.", byline: "By Mira Okonkwo", tone: tone("sand"), size: "large" }),
  s("l0s2", "style", "wire", 0, 3, { headline: "Dinner parties, on Tuesdays, are apparently a thing", size: "medium", tone: tone("sage") }),
  s("l0s3", "style", "brief", 0, 2, { headline: "The walking club that's turned into a book club", size: "small" }),
  s("l0s4", "style", "brief", 0, 2, { headline: "A chef who only cooks one thing, very well", size: "small" }),
  s("l0s5", "style", "brief", 0, 1, { headline: "Sleep, at last, without a tracker", size: "text" }),
];

// ────────────────────────────────────────────────────────────────────────────
// Intensity 1 — A Slow Day
// ────────────────────────────────────────────────────────────────────────────
const LV1: CorpusStory[] = [
  s("l1-lede", "politics", "analysis", 1, 5, {
    kicker: "The Day",
    headline: "A modest budget deal takes shape as negotiators swap caffeine for consensus",
    dek: "The draft trims two contentious riders and extends the farm bill by a year. Both sides claim a win; nobody is angry enough to leak.",
    byline: "By Ellison Carter", tone: tone("slate"), size: "lede",
  }),
  s("l1-s1", "business", "wire", 1, 3, {
    headline: "Jobs report lands in the middle of every forecast, for the third time running",
    dek: "Hiring steady, wages steady, nobody surprised. Markets shrug.",
    byline: "By Devon Hayes", size: "medium", tone: tone("sand"),
  }),
  s("l1-s2", "top", "wire", 1, 2, {
    headline: "A storm system bends offshore, sparing the mid-Atlantic", size: "small",
    subStories: [
      { id: "l1-s2a", headline: "Why the models caught this one early", size: "text" },
      { id: "l1-s2b", headline: "Utilities still cautious, crews positioned", size: "text" },
    ],
  }),
  s("l1-o1", "opinions", "opinion", 1, 2, { kicker: "Editorial Board", headline: "A week the process worked", size: "text", tone: tone("slate") }),
  s("l1-o2", "opinions", "opinion", 1, 2, { kicker: "Marc A. Thiessen", headline: "Credit where it's due, grudgingly", size: "text", tone: tone("sand") }),
  s("l1-o3", "opinions", "opinion", 1, 2, { kicker: "George Weigel", headline: "The small virtues of small bills", size: "text", tone: tone("clay") }),
  s("l1-o4", "opinions", "opinion", 1, 2, { kicker: "Max Boot", headline: "Allies are less anxious this morning", size: "text", tone: tone("sage") }),
  s("l1-o5", "opinions", "opinion", 1, 2, { kicker: "Jennifer Rubin", headline: "The junior senators who actually did the reading", size: "text", tone: tone("ink") }),
  s("l1p1", "politics", "analysis", 1, 4, { kicker: "Analysis", headline: "Inside the two-week grind that produced a functional budget deal", dek: "Four senators, one whiteboard, fewer press releases than anyone expected.", byline: "By Ellison Carter", tone: tone("ink"), size: "large", subStories: [{ id: "l1p1a", headline: "The compromise nobody put out a statement about", size: "text" }, { id: "l1p1b", headline: "The lobbyist who agreed to go home", size: "text" }] }),
  s("l1p2", "politics", "wire", 1, 3, { headline: "A bipartisan working group quietly advances permitting reform", size: "medium", tone: tone("sage"), bullets: ["Six senators, six months", "Moves to floor vote next week", "Industry and environmentalists both signal support"] }),
  s("l1p3", "politics", "brief", 1, 2, { headline: "A governor's veto that nobody is trying to override", size: "small" }),
  s("l1p4", "politics", "brief", 1, 1, { headline: "The House chaplain's oddly touching morning prayer", size: "text" }),
  s("l1p5", "politics", "brief", 1, 1, { headline: "A state legislature adjourns early, ahead of schedule", size: "text" }),
  s("l1w1", "world", "dispatch", 1, 4, { kicker: "Dispatch", headline: "In Nairobi, a startup district hits its first profitable quarter", dek: "Eight founders, three crowded floors, and a power grid that finally cooperated.", byline: "By Achieng Otieno", tone: tone("sand"), size: "large" }),
  s("l1w2", "world", "wire", 1, 3, { headline: "NATO holds a routine summit; the communiqué is readable", size: "medium", tone: tone("slate") }),
  s("l1w3", "world", "brief", 1, 2, { headline: "Brazilian deforestation down for a seventh straight month", size: "small" }),
  s("l1w4", "world", "brief", 1, 1, { headline: "A maritime dispute is referred to arbitration, peacefully", size: "text" }),
  s("l1w5", "world", "brief", 1, 1, { headline: "Seoul's subway gets quieter, by design", size: "text" }),
  s("l1b1", "business", "feature", 1, 4, { kicker: "Profile", headline: "The mid-cap CFO who turned a boring quarter into a cult following", dek: "She explains the math. On purpose. In complete sentences.", byline: "By Priya Menon", tone: tone("slate"), size: "large" }),
  s("l1b2", "business", "wire", 1, 3, { headline: "AI model costs drop again; startups quietly expand margins", size: "medium", tone: tone("sand") }),
  s("l1b3", "business", "brief", 1, 2, { headline: "Shipping delays return to pre-pandemic norms", size: "small" }),
  s("l1b4", "business", "brief", 1, 1, { headline: "Small-business loan defaults at a five-year low", size: "text" }),
  s("l1b5", "business", "brief", 1, 1, { headline: "A quiet regulatory update that traders actually like", size: "text" }),
  s("l1s1", "style", "feature", 1, 4, { kicker: "The look", headline: "Cream is the new black, apparently", dek: "Funerals, galleries, first dates. The color has a moment.", byline: "By Mira Okonkwo", tone: tone("sand"), size: "large" }),
  s("l1s2", "style", "wire", 1, 3, { headline: "The quiet return of the dinner party, on Tuesdays", size: "medium", tone: tone("sage") }),
  s("l1s3", "style", "brief", 1, 2, { headline: "A sleep tracker finally admits what it doesn't know", size: "small" }),
  s("l1s4", "style", "brief", 1, 2, { headline: "A chef who only cooks one thing, very well", size: "small" }),
  s("l1s5", "style", "brief", 1, 1, { headline: "On the tyranny of the 5 a.m. morning", size: "text" }),
];

// ────────────────────────────────────────────────────────────────────────────
// Intensity 2 — A Day With Teeth
// ────────────────────────────────────────────────────────────────────────────
const LV2: CorpusStory[] = [
  s("l2-lede", "top", "lede", 2, 5, {
    kicker: "Breaking", live: true,
    headline: "U.S. imposes naval blockade as Trump demands Iran end nuclear program",
    dek: "The standoff in the Strait of Hormuz pushed oil past $128 a barrel and sent allies scrambling for a ceasefire framework before the weekend.",
    byline: "By Mara Hendricks and Suazrmon Goolge", tone: tone("slate"), size: "lede",
  }),
  s("l2-s1", "politics", "wire", 2, 3, {
    headline: "As war drags on, midterm forecasts for Republicans get even worse",
    dek: "Internal polling shows slippage across seven battleground districts, with suburban women moving fastest.",
    byline: "By Devon Hayes", size: "medium", tone: tone("sand"),
  }),
  s("l2-s2", "business", "wire", 2, 2, {
    headline: "Treasury quietly widens sanctions list to cover a dozen shell entities", size: "small",
    subStories: [
      { id: "l2-s2a", headline: "How the sanctions reach Hong Kong intermediaries", size: "text" },
      { id: "l2-s2b", headline: "Banks scramble to comply before Monday's open", size: "text" },
    ],
  }),
  s("l2-o1", "opinions", "opinion", 2, 2, { kicker: "Editorial Board", headline: "The lessons of Viktor Orbán's defeat", size: "text", tone: tone("clay") }),
  s("l2-o2", "opinions", "opinion", 2, 2, { kicker: "Marc A. Thiessen", headline: "Trump flips the script in the Strait of Hormuz", size: "text", tone: tone("sand") }),
  s("l2-o3", "opinions", "opinion", 2, 2, { kicker: "George Weigel", headline: "The fundamental misunderstanding behind the Trump vs. Pope Leo mess", size: "text", tone: tone("slate") }),
  s("l2-o4", "opinions", "opinion", 2, 2, { kicker: "Max Boot", headline: "Orbán's loss shows the Achilles' heel of populist power", size: "text", tone: tone("sage") }),
  s("l2-o5", "opinions", "opinion", 2, 2, { kicker: "Jennifer Rubin", headline: "A Democratic bench that, for once, is not lacking", size: "text", tone: tone("ink") }),
  s("l2p1", "politics", "analysis", 2, 4, { kicker: "Analysis", headline: "Inside the 72-hour scramble to rewrite the war-powers resolution", dek: "Four senators, one blank Word document, and a phone call from the West Wing that nobody wanted.", byline: "By Ellison Carter", tone: tone("ink"), size: "large", subStories: [
    { id: "l2p1a", headline: "The four senators trying to narrow the authorization", size: "text" },
    { id: "l2p1b", headline: "White House counsel's memo, annotated", size: "text" },
  ]}),
  s("l2p2", "politics", "wire", 2, 3, { headline: "House GOP leadership quietly revives a discharge petition on voting rights", byline: "By Ruth Paek", size: "medium", bullets: [
    "Five Republicans said to be considering the move",
    "Floor vote could come by Thursday if signatures hold",
    "Leadership denies knowledge; members describe 'quiet encouragement'",
  ]}),
  s("l2p3", "politics", "brief", 2, 2, { headline: "A Senate staffer's 2 a.m. email that changed the bill", size: "small" }),
  s("l2p4", "politics", "brief", 2, 2, { headline: "Governors in seven states move to pre-empt a federal rollback on abortion data", size: "small" }),
  s("l2p5", "politics", "brief", 2, 1, { headline: "Fact-checking last night's prime-time address", meta: "14 min read", size: "text" }),
  s("l2w1", "world", "dispatch", 2, 4, { kicker: "Dispatch", headline: "In a quiet Warsaw neighborhood, Ukrainian teenagers build a newsroom", dek: "They publish in three languages, from a converted bakery, on a deadline nobody imposed.", byline: "By Kaja Lindqvist", tone: tone("sage"), size: "large" }),
  s("l2w2", "world", "wire", 2, 3, { headline: "China pauses rare-earth exports to a third trading partner", size: "medium", tone: tone("sand"), subStories: [
    { id: "l2w2a", headline: "Why Detroit is already feeling the squeeze", size: "text" },
    { id: "l2w2b", headline: "The one alternative mine nobody can get permitted", size: "text" },
  ]}),
  s("l2w3", "world", "brief", 2, 2, { headline: "Egypt's new capital, four years in, finds its first neighborhoods", size: "small" }),
  s("l2w4", "world", "brief", 2, 2, { headline: "A quiet purge inside Argentina's statistics bureau raises alarms", size: "small" }),
  s("l2w5", "world", "brief", 2, 1, { headline: "What the French dockworkers are actually asking for", size: "text" }),
  s("l2b1", "business", "investigation", 2, 5, { kicker: "Investigation", headline: "The payments startup that paid itself: a six-month investigation", dek: "Regulators ignored three complaints. The board chair personally approved the last one.", byline: "By The Ledger Investigates team", tone: tone("clay"), size: "large", bullets: [
    "Over $240M in looping internal transfers",
    "Two former auditors on record, one still employed",
    "Read the full 14,000-word story",
  ]}),
  s("l2b2", "business", "analysis", 2, 3, { headline: "Why every major model launch this quarter slipped", size: "medium", tone: tone("slate"), subStories: [
    { id: "l2b2a", headline: "The GPU shipment that didn't arrive", size: "text" },
    { id: "l2b2b", headline: "Post-training is the new pre-training", size: "text" },
  ]}),
  s("l2b3", "business", "brief", 2, 2, { headline: "Apple's services business just quietly passed its hardware unit", size: "small" }),
  s("l2b4", "business", "brief", 2, 2, { headline: "A Fed governor breaks ranks, on the record", size: "small" }),
  s("l2b5", "business", "brief", 2, 1, { headline: "The one line item analysts are watching on Thursday", size: "text" }),
  s("l2s1", "style", "feature", 2, 4, { kicker: "The look", headline: "Grief, tailored: a generation rethinks what to wear to funerals", dek: "Charcoal is out. Cream, unexpectedly, is in.", byline: "By Mira Okonkwo", tone: tone("sand"), size: "large" }),
  s("l2s2", "style", "wire", 2, 3, { headline: "The quiet return of the dinner party, on Tuesdays", size: "medium", tone: tone("sage") }),
  s("l2s3", "style", "brief", 2, 2, { headline: "What your sleep tracker still refuses to tell you, and why", size: "small" }),
  s("l2s4", "style", "brief", 2, 2, { headline: "A chef who only cooks one thing, very well", size: "small" }),
  s("l2s5", "style", "brief", 2, 1, { headline: "The walking routine nobody is marketing", size: "text" }),
];

// ────────────────────────────────────────────────────────────────────────────
// Intensity 3 — Storm Warnings
// ────────────────────────────────────────────────────────────────────────────
const LV3: CorpusStory[] = [
  s("l3-lede", "top", "live", 3, 5, {
    kicker: "Developing", live: true,
    headline: "Second carrier group ordered to Gulf as Iranian strikes hit two U.S. bases in Iraq",
    dek: "At least eleven service members dead; Tehran warns of 'wider response.' Oil spikes to $164, Dow drops 1,400 points before halting.",
    byline: "By Mara Hendricks, Suazrmon Goolge and Jordan Veil", tone: tone("ink"), size: "lede",
  }),
  s("l3-s1", "top", "wire", 3, 3, {
    headline: "Cyberattack cripples a regional electric grid; four states declare emergencies",
    dek: "Utilities say the origin is 'consistent with state-level actors.' Restoration could take days.",
    byline: "By Lena Whit", size: "medium", tone: tone("slate"),
    bullets: ["Hospitals on backup power", "Water treatment affected in 9 counties", "DHS convening an overnight briefing"],
  }),
  s("l3-s2", "business", "markets", 3, 2, {
    headline: "Federal Reserve convenes an unscheduled session as markets seize", size: "small",
    subStories: [
      { id: "l3-s2a", headline: "Liquidity facility to reopen at dawn", size: "text" },
      { id: "l3-s2b", headline: "Banks pull overnight lending in Asia", size: "text" },
    ],
  }),
  s("l3-o1", "opinions", "opinion", 3, 2, { kicker: "Editorial Board", headline: "The guardrails, named", size: "text", tone: tone("ink") }),
  s("l3-o2", "opinions", "opinion", 3, 2, { kicker: "Marc A. Thiessen", headline: "The case for restraint the White House won't hear", size: "text", tone: tone("clay") }),
  s("l3-o3", "opinions", "opinion", 3, 2, { kicker: "Ruth Marcus", headline: "Congress, still absent, still responsible", size: "text", tone: tone("slate") }),
  s("l3-o4", "opinions", "opinion", 3, 2, { kicker: "Max Boot", headline: "Every ally is now making a list", size: "text", tone: tone("sand") }),
  s("l3-o5", "opinions", "opinion", 3, 2, { kicker: "Jennifer Rubin", headline: "What to demand from the next 72 hours", size: "text", tone: tone("sage") }),
  s("l3p1", "politics", "live", 3, 5, { kicker: "Live Updates", headline: "Congress moves to restrict war powers as White House briefs 'gloves off' posture", dek: "Bipartisan Senate group files emergency legislation; leadership signals floor vote within 48 hours.", byline: "By Ellison Carter", tone: tone("ink"), size: "large", subStories: [
    { id: "l3p1a", headline: "The four holdouts who could block the measure", size: "text" },
    { id: "l3p1b", headline: "A surprising vote switch in the House", size: "text" },
  ], bullets: ["57 senators publicly on record", "White House threatens veto within the hour", "AG's office drafting a challenge"]}),
  s("l3p2", "politics", "wire", 3, 3, { headline: "Governors federate emergency mutual-aid compact amid grid failure", size: "medium", tone: tone("slate") }),
  s("l3p3", "politics", "brief", 3, 2, { headline: "DOJ opens probe into alleged destruction of classified records", size: "small" }),
  s("l3p4", "politics", "brief", 3, 2, { headline: "Supreme Court agrees to hear an emergency challenge Monday", size: "small" }),
  s("l3p5", "politics", "brief", 3, 1, { headline: "Fact-checking the 11 p.m. Oval Office address", meta: "19 min read", size: "text" }),
  s("l3w1", "world", "dispatch", 3, 4, { kicker: "Dispatch", headline: "Israeli strikes resume in Lebanon; hundreds flee north as sirens ring in Haifa", dek: "Regional capitals issue travel advisories; shipping reroutes around a widening exclusion zone.", byline: "By Kaja Lindqvist", tone: tone("clay"), size: "large" }),
  s("l3w2", "world", "wire", 3, 3, { headline: "China sharply restricts rare-earth exports to U.S. allies", size: "medium", tone: tone("sand"), subStories: [
    { id: "l3w2a", headline: "Detroit production cuts begin within 10 days", size: "text" },
    { id: "l3w2b", headline: "The one alternative mine nobody permitted", size: "text" },
  ]}),
  s("l3w3", "world", "brief", 3, 2, { headline: "Russian troops mass along a third Ukrainian border sector", size: "small" }),
  s("l3w4", "world", "brief", 3, 2, { headline: "North Korea test-fires a second long-range missile in a week", size: "small" }),
  s("l3w5", "world", "brief", 3, 1, { headline: "Turkey threatens to close a key NATO airbase", size: "text" }),
  s("l3b1", "business", "markets", 3, 5, { kicker: "Markets", headline: "Dow halts twice; oil hits $164; safe-haven flows surge into gold and the yen", dek: "Analysts call it 'the broadest intraday risk-off in a decade.'", byline: "By Priya Menon", tone: tone("ink"), size: "large", bullets: ["Trading halted 17:42 and 19:15 ET", "Gold +6.4% on the day", "VIX hits 42 — a level not seen since 2020"] }),
  s("l3b2", "business", "wire", 3, 3, { headline: "A major payments network is disrupted amid the cyberattack", size: "medium", tone: tone("slate") }),
  s("l3b3", "business", "brief", 3, 2, { headline: "Airlines cancel 2,400 flights; insurers warn of a 'correlated claims event'", size: "small" }),
  s("l3b4", "business", "brief", 3, 2, { headline: "A Fed governor publicly splits from the Chair", size: "small" }),
  s("l3b5", "business", "brief", 3, 1, { headline: "The one credit-default swap spread everyone is watching", size: "text" }),
  s("l3s1", "style", "essay", 3, 4, { kicker: "Essay", headline: "What you text your family when the news won't stop getting worse", dek: "Notes on attention, on care, on keeping a house running through a week that will not end.", byline: "By Mira Okonkwo", tone: tone("sand"), size: "large" }),
  s("l3s2", "style", "wire", 3, 3, { headline: "Hotlines see record call volume; how to help a friend spiraling", size: "medium", tone: tone("sage") }),
  s("l3s3", "style", "brief", 3, 2, { headline: "The grocery stockpile lists, rewritten for the third time this year", size: "small" }),
  s("l3s4", "style", "brief", 3, 2, { headline: "When your feed is the crisis: a practical guide to unplugging", size: "small" }),
  s("l3s5", "style", "brief", 3, 1, { headline: "Sleep, when you cannot sleep", size: "text" }),
];

// ────────────────────────────────────────────────────────────────────────────
// Intensity 4 — Shit Hits The Fan
// ────────────────────────────────────────────────────────────────────────────
const LV4: CorpusStory[] = [
  s("l4-lede", "top", "live", 4, 5, {
    kicker: "Crisis", live: true,
    headline: "War declared in the Gulf as multiple U.S. cities go dark; martial law invoked in four states",
    dek: "Coordinated cyberattack brings down three regional grids; Tehran and Washington trade missile strikes; President addresses nation from Raven Rock. Markets closed indefinitely. Borders locked.",
    byline: "By the Ledger newsroom", tone: tone("ink"), size: "lede",
  }),
  s("l4-s1", "politics", "live", 4, 4, {
    headline: "Constitutional crisis: Supreme Court, in 6-3 emergency ruling, orders White House compliance; White House signals defiance",
    dek: "Chief Justice's unsigned order calls continued executive actions 'without legal foundation.' AG resigns within the hour.",
    byline: "By Ellison Carter", size: "medium", tone: tone("clay"),
    bullets: ["Third resignation from the Cabinet in 24 hours", "Two of the Joint Chiefs reportedly 'reviewing lawful orders'", "21 state AGs file a joint emergency brief"],
  }),
  s("l4-s2", "top", "live", 4, 3, {
    headline: "Cascading grid failure leaves an estimated 88 million without power; hospitals rationing ICU beds", size: "small",
    subStories: [
      { id: "l4-s2a", headline: "What 'black start' actually means, and why it takes days", size: "text" },
      { id: "l4-s2b", headline: "A second wave of attacks hits water utilities", size: "text" },
      { id: "l4-s2c", headline: "The outage map, updated every fifteen minutes", size: "text" },
    ],
  }),
  s("l4-o1", "opinions", "opinion", 4, 2, { kicker: "Editorial Board", headline: "This is the emergency. Say it plainly.", size: "text", tone: tone("ink") }),
  s("l4-o2", "opinions", "opinion", 4, 2, { kicker: "Ruth Marcus", headline: "The order the Court issued, and the order that must follow", size: "text", tone: tone("clay") }),
  s("l4-o3", "opinions", "opinion", 4, 2, { kicker: "Marc A. Thiessen", headline: "I was wrong about the guardrails", size: "text", tone: tone("slate") }),
  s("l4-o4", "opinions", "opinion", 4, 2, { kicker: "Max Boot", headline: "Every alliance we built is on the table tonight", size: "text", tone: tone("sand") }),
  s("l4-o5", "opinions", "opinion", 4, 2, { kicker: "Jennifer Rubin", headline: "What the next forty-eight hours require of every member of Congress", size: "text", tone: tone("sage") }),
  s("l4p1", "politics", "live", 4, 5, { kicker: "Live · Breaking", headline: "Senate invokes extraordinary session; impeachment articles drafted as White House refuses Supreme Court order", dek: "Leadership whips a two-thirds coalition overnight. Cabinet officers are said to be 'considering their obligations.' A Pentagon memo leaks to three outlets simultaneously.", byline: "By Ellison Carter and Ruth Paek", tone: tone("ink"), size: "large", subStories: [
    { id: "l4p1a", headline: "The four Republican senators now openly negotiating", size: "text" },
    { id: "l4p1b", headline: "What the Pentagon memo actually says", size: "text" },
    { id: "l4p1c", headline: "The Speaker's midnight press statement, annotated", size: "text" },
  ], bullets: ["Two-thirds threshold: 67 · currently confirmed yes: 61", "House filing expected by 6 a.m.", "Secret Service posture described as 'heightened'", "Governors of CA, NY, IL convene joint briefing"]}),
  s("l4p2", "politics", "wire", 4, 3, { headline: "National Guard mobilized in seven states; governors split on federalization", size: "medium", tone: tone("clay"), bullets: ["Three governors refuse federal orders", "Standoff at two state armories", "DOJ files against CA at 2 a.m."] }),
  s("l4p3", "politics", "brief", 4, 2, { headline: "AG resigns in a one-sentence letter; Deputy AG refuses to sign orders", size: "small" }),
  s("l4p4", "politics", "brief", 4, 2, { headline: "A senior intelligence official speaks, on the record, for the first time", size: "small" }),
  s("l4p5", "politics", "brief", 4, 1, { headline: "Every congressional leader's statement, side by side", meta: "live, updating", size: "text" }),
  s("l4w1", "world", "live", 4, 5, { kicker: "War", headline: "Gulf on fire: carriers engaged, Strait closed, 14 oil facilities hit overnight", dek: "Allied capitals convene emergency sessions; NATO Article 4 consultations begin. Russia moves 40,000 troops toward a third Ukrainian border. North Korea test-fires two ICBMs.", byline: "By Kaja Lindqvist and Jordan Veil", tone: tone("ink"), size: "large", bullets: ["U.S. casualties confirmed at three bases", "Tehran refinery destroyed, two cities under blackout", "EU triggers emergency energy-sharing protocol"] }),
  s("l4w2", "world", "wire", 4, 3, { headline: "China seizes a Taiwanese-flagged vessel; Taipei elevates alert", size: "medium", tone: tone("clay"), subStories: [
    { id: "l4w2a", headline: "Semiconductors: 48 hours of inventory, globally", size: "text" },
    { id: "l4w2b", headline: "The one phone call that hasn't happened", size: "text" },
  ]}),
  s("l4w3", "world", "brief", 4, 2, { headline: "Russian forces cross a new border sector; Kyiv declares full mobilization", size: "small" }),
  s("l4w4", "world", "brief", 4, 2, { headline: "Saudi Arabia closes airspace; Doha and Abu Dhabi evacuate diplomats", size: "small" }),
  s("l4w5", "world", "brief", 4, 1, { headline: "Ambassadors recalled from six NATO capitals by dawn", size: "text" }),
  s("l4b1", "business", "markets", 4, 5, { kicker: "Markets · Halted", headline: "Global markets closed indefinitely; Treasury invokes emergency liquidity powers unused since 2008", dek: "Oil ceases to trade at $212. Gold hits a new all-time high intraday before the exchange suspends. The dollar swings 4% in two hours.", byline: "By Priya Menon", tone: tone("ink"), size: "large", bullets: ["NYSE, LSE, Nikkei, HKEX all suspended", "Fed coordinates with ECB, BoJ on swap lines", "Two systemically-important banks request discount window access"] }),
  s("l4b2", "business", "wire", 4, 3, { headline: "Cloud providers report 'significant disruption' across three U.S. regions", size: "medium", tone: tone("slate"), subStories: [
    { id: "l4b2a", headline: "What is actually down, in plain language", size: "text" },
    { id: "l4b2b", headline: "The backup-power debate, settled in one night", size: "text" },
  ]}),
  s("l4b3", "business", "brief", 4, 2, { headline: "U.S. airspace closed for six hours; 14,000 flights cancelled", size: "small" }),
  s("l4b4", "business", "brief", 4, 2, { headline: "Ports of LA, NY, Houston halt operations on DHS order", size: "small" }),
  s("l4b5", "business", "brief", 4, 1, { headline: "Every CEO letter to employees, collected", size: "text" }),
  s("l4s1", "style", "essay", 4, 4, { kicker: "Essay", headline: "What a day at the end of normal looks like, minute by minute", dek: "A reporter's notebook from a neighborhood without power, a grocery without cash registers, and a group text that won't stop.", byline: "By Mira Okonkwo", tone: tone("ink"), size: "large" }),
  s("l4s2", "style", "wire", 4, 3, { headline: "What to keep in the car; what to keep in the hallway closet", size: "medium", tone: tone("slate"), bullets: ["Three liters per person per day", "A battery radio. Really.", "Cash, in small bills"] }),
  s("l4s3", "style", "brief", 4, 2, { headline: "The crisis lines that are still answering; how to help a friend who isn't okay", size: "small" }),
  s("l4s4", "style", "brief", 4, 2, { headline: "Children and the news: what to say, what to turn off", size: "small" }),
  s("l4s5", "style", "brief", 4, 1, { headline: "Sleep, tonight", size: "text" }),
];

export const CORPUS: CorpusStory[] = [...LV0, ...LV1, ...LV2, ...LV3, ...LV4];

const BY_ID = new Map(CORPUS.map((s) => [s.id, s]));

export function getStory(id: string): CorpusStory {
  const s = BY_ID.get(id);
  if (!s) throw new Error(`Corpus: missing story "${id}"`);
  return s;
}

export function getStories(ids: string[]): CorpusStory[] {
  return ids.map(getStory);
}
