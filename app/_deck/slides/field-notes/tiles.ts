import { fieldNotes } from "@/app/content";
import { BUCKETS, type ManifestEntry } from "./manifest.generated";

export type TileSize = "1x1" | "2x1" | "1x2" | "2x2" | "3x2";

export type Aspect = "landscape" | "portrait" | "square";

export type ImageTile = {
  kind: "image";
  src: string;
  alt: string;
  bucket?: string; // source bucket name — surfaced as data-bucket for CSS hooks
  size: TileSize;
  rate: number; // parallax rate (0 = static, ~0.08 = lively)
  objectPosition?: string;
};

export type CardSize = Extract<TileSize, "2x1" | "2x2">;

export type CardTile = {
  kind: "card";
  title: string;
  body: string;
  tone: "terracotta" | "mint" | "mustard" | "rose" | "navy";
  size: CardSize;
  rate: number;
};

export type Tile = ImageTile | CardTile;

/* ── Tunables ─────────────────────────────────────────────────────────
   PER_BUCKET_CAP: default max items pulled from each bucket per render.
   BUCKET_CAP_OVERRIDES: per-bucket cap overrides (`Infinity` = uncapped).

   Slot-assignment biases live in `pickForSlot`:
     • europalette → 1x1 slots only, rendered without parallax
     • gif/video (motion) → biased toward 2x2 anchors
     • everything else → fallback */
export const PER_BUCKET_CAP = 16;
const BUCKET_CAP_OVERRIDES: Record<string, number> = {
  product: Infinity,
  "ai explorations": Infinity,
};
const EUROPALETTE_BUCKET = "europalette";
const MOTION_RE = /\.(gif|mp4|mov|webm)$/i;
const isMotion = (url: string): boolean =>
  MOTION_RE.test(decodeURIComponent(url));

/* ── Aspect cache ────────────────────────────────────────────────────
   Module-level map of src → "landscape" | "portrait" | "square".
   Pre-populated from the manifest at module load (build-time probed
   widths/heights). Videos are populated lazily via `registerAspect`
   from a `loadedmetadata` listener in index.tsx. The breathing scheduler
   reads from this via `getAspect` — pulses on tiles whose aspect is
   still unknown are skipped (they'll be picked up next pass). */
const LANDSCAPE_THRESHOLD = 1.2;
const PORTRAIT_THRESHOLD = 0.83;

const ASPECTS = new Map<string, Aspect>();

function classifyAspect(w: number, h: number): Aspect {
  if (h <= 0) return "square";
  const r = w / h;
  if (r > LANDSCAPE_THRESHOLD) return "landscape";
  if (r < PORTRAIT_THRESHOLD) return "portrait";
  return "square";
}

// Seed from manifest dimensions (jpg/png/gif/webp at build time).
for (const list of Object.values(BUCKETS)) {
  for (const entry of list) {
    if (entry.w && entry.h) {
      ASPECTS.set(entry.src, classifyAspect(entry.w, entry.h));
    }
  }
}

export function getAspect(src: string): Aspect | undefined {
  return ASPECTS.get(src);
}

export function registerAspect(src: string, w: number, h: number): void {
  if (!ASPECTS.has(src)) ASPECTS.set(src, classifyAspect(w, h));
}

/* ── Cards ──────────────────────────────────────────────────────────
   Card prose lives in app/content.ts; layout (tone, size, rate) stays
   here. Order matches content.fieldNotes.cards by index. */
const CARD_LAYOUT: { tone: CardTile["tone"]; size: CardSize; rate: number }[] = [
  { tone: "terracotta", size: "2x2", rate: 0 },
  { tone: "mint", size: "2x1", rate: 0 },
  { tone: "mustard", size: "2x1", rate: 0 },
  { tone: "rose", size: "2x2", rate: 0 },
  { tone: "navy", size: "2x1", rate: 0 },
];

export const CARDS: CardTile[] = fieldNotes.cards.map((card, i) => ({
  kind: "card",
  title: card.title,
  body: card.body,
  ...CARD_LAYOUT[i],
}));

/* ── Layout patterns ──────────────────────────────────────────────────
   Three named variants. Each is a SlotSpec[]; the picker pipeline is
   identical, only the input mix changes. Cards always occupy the same
   five slots (defined in CARDS via CARD_LAYOUT). The 7-col grid uses
   grid-auto-flow:row (not dense) so that the breathing scheduler can
   pair same-row 1x1+2x1 swaps without tiles jumping rows; this means
   over-using 2-wide tiles strands column 7. All variants keep ≥3 2x1
   and ≥22 1x1 so breathing always has eligible rows.

   IMPORTANT: card slots come first (ordered cardIdx 0..4) because the
   stratifiedSlotShuffle in index treats every non-1x1 the same; what
   matters for layout is the count and size mix, not the array order. */
export type SlotSpec =
  | {
      kind: "image";
      size: TileSize;
      rate: number;
      objectPosition?: string;
    }
  | {
      kind: "card";
      cardIdx: number;
      size: CardSize;
      rate: number;
    };

const CARD_SLOTS: SlotSpec[] = [
  { kind: "card", size: "2x2", rate: 0, cardIdx: 0 },
  { kind: "card", size: "2x1", rate: 0, cardIdx: 1 },
  { kind: "card", size: "2x1", rate: 0, cardIdx: 2 },
  { kind: "card", size: "2x2", rate: 0, cardIdx: 3 },
  { kind: "card", size: "2x1", rate: 0, cardIdx: 4 },
];

/* Helper — emit N image slots of a given size with a rotating parallax
   rate for visual variety. Reduces row noise compared to hand-listing. */
function imgSlots(
  size: TileSize,
  count: number,
  rates: number[] = [0],
): SlotSpec[] {
  const out: SlotSpec[] = [];
  for (let i = 0; i < count; i++) {
    out.push({ kind: "image", size, rate: rates[i % rates.length] });
  }
  return out;
}

/* Variant A — Mosaic. Quiet scrapbook. A sea of 1x1 squares with sparse
   accents; reads as a calm, dense pattern. ~69 slots, 64 image. */
export const LAYOUT_MOSAIC: SlotSpec[] = [
  ...imgSlots("2x2", 4),
  ...CARD_SLOTS,
  ...imgSlots("2x1", 4, [0.05, 0.04, 0.06]),
  ...imgSlots("1x2", 4, [0.05, 0.06, 0.04]),
  ...imgSlots("1x1", 52, [0.05, 0.07, 0.06, 0.04, 0.08]),
];

/* Variant B — Editorial. Magazine spread. Big squares + wide 3x2 heroes
   dominate; only a handful of small tiles. Each image earns more weight.
   ~38 slots, 33 image. */
export const LAYOUT_EDITORIAL: SlotSpec[] = [
  ...imgSlots("2x2", 8),
  ...imgSlots("3x2", 4),
  ...CARD_SLOTS,
  ...imgSlots("2x1", 3, [0.05, 0.04, 0.06]),
  ...imgSlots("1x2", 3, [0.05, 0.06, 0.04]),
  ...imgSlots("1x1", 15, [0.05, 0.07, 0.06, 0.04]),
];

/* Variant C — Salon. Full mixture, every size in active rotation. Heavy
   on landscape AND portrait mediums plus a couple 3x2 heroes; 1x1s are
   connective tissue, not the dominant element. ~61 slots, 56 image. */
export const LAYOUT_SALON: SlotSpec[] = [
  ...imgSlots("2x2", 5),
  ...imgSlots("3x2", 2),
  ...CARD_SLOTS,
  ...imgSlots("2x1", 11, [0.05, 0.04, 0.06]),
  ...imgSlots("1x2", 10, [0.05, 0.06, 0.04]),
  ...imgSlots("1x1", 28, [0.05, 0.07, 0.06, 0.04, 0.08]),
];

export type VariantId = "mosaic" | "editorial" | "salon";

export const LAYOUT_VARIANTS: Record<VariantId, SlotSpec[]> = {
  mosaic: LAYOUT_MOSAIC,
  editorial: LAYOUT_EDITORIAL,
  salon: LAYOUT_SALON,
};

/* ── PRNG ───────────────────────────────────────────────────────────── */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fisherYates<T>(arr: readonly T[], rand: () => number): T[] {
  const next = arr.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/* ── Pool builder ───────────────────────────────────────────────────── */
type Pool = { motion: string[]; still: string[]; europalette: string[] };

function buildPool(
  buckets: Record<string, readonly ManifestEntry[]>,
  cap: number,
  rand: () => number,
): Pool {
  const motion: string[] = [];
  const still: string[] = [];
  const europalette: string[] = [];
  for (const key of Object.keys(buckets).sort()) {
    const list = buckets[key];
    if (!list?.length) continue;
    const bucketCap = BUCKET_CAP_OVERRIDES[key] ?? cap;
    const take = Math.min(bucketCap, list.length);
    const shuffled = fisherYates(list, rand);
    for (let i = 0; i < take; i++) {
      const url = shuffled[i].src;
      if (key === EUROPALETTE_BUCKET) europalette.push(url);
      else if (isMotion(url)) motion.push(url);
      else still.push(url);
    }
  }
  return {
    motion: fisherYates(motion, rand),
    still: fisherYates(still, rand),
    europalette: fisherYates(europalette, rand),
  };
}

type ImageSlotSpec = Extract<SlotSpec, { kind: "image" }>;

function popAspect(list: string[], target: Aspect): string | null {
  for (let i = list.length - 1; i >= 0; i--) {
    if (ASPECTS.get(list[i]) === target) {
      const [url] = list.splice(i, 1);
      return url;
    }
  }
  return null;
}

function pickForSlot(
  pool: Pool,
  slot: ImageSlotSpec,
): { url: string; isEuropalette: boolean } | null {
  const big = slot.size === "2x2" || slot.size === "3x2";
  const small = slot.size === "1x1";

  if (small) {
    if (pool.europalette.length)
      return { url: pool.europalette.pop()!, isEuropalette: true };
    if (pool.still.length) return { url: pool.still.pop()!, isEuropalette: false };
    if (pool.motion.length) return { url: pool.motion.pop()!, isEuropalette: false };
    return null;
  }
  if (big) {
    if (pool.motion.length) return { url: pool.motion.pop()!, isEuropalette: false };
    if (pool.still.length) return { url: pool.still.pop()!, isEuropalette: false };
    return null;
  }
  // Medium — try to match the slot's orientation to the image's aspect so
  // portrait shots land in 1x2 and landscape shots land in 2x1.
  const wantLandscape = slot.size === "2x1";
  const targetAspect: Aspect = wantLandscape ? "landscape" : "portrait";
  const aspectMatched = popAspect(pool.still, targetAspect);
  if (aspectMatched) return { url: aspectMatched, isEuropalette: false };
  if (pool.still.length) return { url: pool.still.pop()!, isEuropalette: false };
  if (pool.motion.length) return { url: pool.motion.pop()!, isEuropalette: false };
  return null;
}

/* Stratified shuffle: place the larger slots (anchors, cards — anything
   not 1x1) at evenly-spaced positions across the array, then fill the
   gaps with 1x1s in random order. Combined with grid-auto-flow:dense,
   this keeps every viewport-height "page" visually mixed instead of
   leaving long tails of small squares clumped together. */
function stratifiedSlotShuffle(slots: readonly SlotSpec[], rand: () => number): SlotSpec[] {
  const big = fisherYates(
    slots.filter((s) => s.size !== "1x1"),
    rand,
  );
  const small = fisherYates(
    slots.filter((s) => s.size === "1x1"),
    rand,
  );
  const total = big.length + small.length;
  if (big.length === 0) return small;
  const out: (SlotSpec | undefined)[] = new Array(total).fill(undefined);
  const stride = total / big.length;
  // Tiny per-slot wobble so adjacent renders don't land bigs at identical
  // indices — keeps the pattern feeling alive when shuffle is hit.
  const offsetJitter = (stride - 1) * 0.4;
  for (let i = 0; i < big.length; i++) {
    const wobble = (rand() * 2 - 1) * offsetJitter;
    const target = Math.max(
      0,
      Math.min(total - 1, Math.floor((i + 0.5) * stride + wobble)),
    );
    let idx = target;
    while (out[idx]) idx = (idx + 1) % total; // collision → next slot
    out[idx] = big[i];
  }
  let s = 0;
  for (let i = 0; i < total; i++) {
    if (!out[i]) out[i] = small[s++];
  }
  return out as SlotSpec[];
}

function altFromSrc(src: string): string {
  try {
    const decoded = decodeURIComponent(src);
    const parts = decoded.split("/");
    const file = (parts[parts.length - 1] ?? "").replace(/\.[a-z0-9]+$/i, "");
    const bucket = parts[parts.length - 2] ?? "";
    return bucket ? `${bucket} — ${file}` : file || "Field note";
  } catch {
    return "Field note";
  }
}

function bucketFromSrc(src: string): string | undefined {
  try {
    const m = decodeURIComponent(src).match(/field notes\/([^/]+)\//);
    return m?.[1];
  } catch {
    return undefined;
  }
}

/* Build a fresh Tile[] for one render. */
export function buildTiles(
  buckets: Record<string, readonly ManifestEntry[]> = BUCKETS,
  opts: { cap?: number; rand?: () => number; pattern?: SlotSpec[] } = {},
): Tile[] {
  const rand = opts.rand ?? Math.random;
  const cap = opts.cap ?? PER_BUCKET_CAP;
  const pattern = opts.pattern ?? LAYOUT_MOSAIC;
  const pool = buildPool(buckets, cap, rand);
  const slots = stratifiedSlotShuffle(pattern, rand);
  const out: Tile[] = [];
  for (const slot of slots) {
    if (slot.kind === "card") {
      out.push(CARDS[slot.cardIdx]);
      continue;
    }
    const pick = pickForSlot(pool, slot);
    if (!pick) continue;
    const { url, isEuropalette } = pick;
    const tile: ImageTile = {
      kind: "image",
      src: url,
      alt: altFromSrc(url),
      bucket: bucketFromSrc(url),
      size: slot.size,
      // Europalette renders static — no parallax pan.
      rate: isEuropalette ? 0 : slot.rate,
    };
    if (slot.objectPosition) tile.objectPosition = slot.objectPosition;
    out.push(tile);
  }
  return out;
}

/* SSR-stable initial tiles — seeded so server/client first paints match. */
export const INITIAL_TILES: Tile[] = buildTiles(BUCKETS, { rand: mulberry32(0xf1e1d) });
