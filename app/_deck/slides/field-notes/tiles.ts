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

/* Variant A — Mosaic. Quiet scrapbook with sparse hero moments. A field
   of 1x1 squares broken up by 2x2 anchors and 3x2 wide heroes; reads as
   a calm, dense pattern with occasional rest stops. ~54 slots, 49 image. */
export const LAYOUT_MOSAIC: SlotSpec[] = [
  ...imgSlots("2x2", 6),
  ...imgSlots("3x2", 3),
  ...CARD_SLOTS,
  ...imgSlots("2x1", 4, [0.05, 0.04, 0.06]),
  ...imgSlots("1x2", 4, [0.05, 0.06, 0.04]),
  ...imgSlots("1x1", 32, [0.05, 0.07, 0.06, 0.04, 0.08]),
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

/* Stratified shuffle: place colored cards first at evenly-spaced
   positions across the full array (with wobble bounded so cards land
   at least CARD_MIN_GAP slots apart — never adjacent), then place
   non-1x1 image anchors across the remaining gaps, then fill what's
   left with 1x1s. This keeps cards paced through the page so two
   text cards never sit side-by-side, while still mixing every
   viewport-height "page" visually. */
const CARD_MIN_GAP = 3;
function stratifiedSlotShuffle(slots: readonly SlotSpec[], rand: () => number): SlotSpec[] {
  const cards = fisherYates(slots.filter((s) => s.kind === "card"), rand);
  const bigImgs = fisherYates(
    slots.filter((s) => s.kind === "image" && s.size !== "1x1"),
    rand,
  );
  const small = fisherYates(
    slots.filter((s) => s.kind === "image" && s.size === "1x1"),
    rand,
  );
  const total = cards.length + bigImgs.length + small.length;
  if (total === 0) return [];
  const out: (SlotSpec | undefined)[] = new Array(total).fill(undefined);

  const place = (
    items: readonly SlotSpec[],
    indices: readonly number[],
    minGap: number,
  ): void => {
    if (items.length === 0 || indices.length === 0) return;
    const stride = indices.length / items.length;
    // Keep `stride - 2*wobble >= minGap` so two stratified items can
    // never land closer than `minGap` slots apart in the index pool.
    const maxWobble = Math.max(0, (stride - minGap) / 2);
    for (let i = 0; i < items.length; i++) {
      const wobble = (rand() * 2 - 1) * maxWobble;
      const targetPos = Math.max(
        0,
        Math.min(
          indices.length - 1,
          Math.floor((i + 0.5) * stride + wobble),
        ),
      );
      let pos = targetPos;
      while (out[indices[pos]]) pos = (pos + 1) % indices.length;
      out[indices[pos]] = items[i];
    }
  };

  // Cards first, across the whole array.
  const allIndices = Array.from({ length: total }, (_, i) => i);
  place(cards, allIndices, CARD_MIN_GAP);

  // Big image anchors next, into whatever gaps remain.
  const gapAfterCards: number[] = [];
  for (let i = 0; i < total; i++) if (!out[i]) gapAfterCards.push(i);
  // Modest gap (1) for image anchors — they're allowed near each other,
  // we just want them stratified so smalls don't clump.
  place(bigImgs, gapAfterCards, 1);

  // 1x1s fill the rest in shuffled order.
  let s = 0;
  for (let i = 0; i < total; i++) {
    if (!out[i]) out[i] = small[s++];
  }
  return out as SlotSpec[];
}

/* Tile dimensions in grid cells (matches the CSS span rules). */
const SIZE_DIM: Record<TileSize, { w: number; h: number }> = {
  "1x1": { w: 1, h: 1 },
  "2x1": { w: 2, h: 1 },
  "1x2": { w: 1, h: 2 },
  "2x2": { w: 2, h: 2 },
  "3x2": { w: 3, h: 2 },
};

const FIT_COLS = 7;

/* Pre-fit the stratified slot order against the desktop 7-col grid so
   the CSS auto-flow:row layout never leaves stranded empty cells. We
   walk the grid row-by-row; when the queue's next slot doesn't fit the
   remaining row width, we pull a smaller NON-CARD slot from later in
   the queue forward to fill the gap. Cards are never reordered, which
   preserves the stratified card spacing (CARD_MIN_GAP). */
function fitToGrid(slots: readonly SlotSpec[]): SlotSpec[] {
  const cols = FIT_COLS;
  const queue = slots.slice();
  const out: SlotSpec[] = [];
  const occ: boolean[][] = [];

  const isOcc = (r: number, c: number): boolean => !!occ[r]?.[c];
  const setOcc = (r: number, c: number) => {
    if (!occ[r]) occ[r] = new Array(cols).fill(false);
    occ[r][c] = true;
  };
  const fits = (slot: SlotSpec, r: number, c: number): boolean => {
    const { w, h } = SIZE_DIM[slot.size];
    if (c + w > cols) return false;
    for (let i = 0; i < h; i++)
      for (let j = 0; j < w; j++) if (isOcc(r + i, c + j)) return false;
    return true;
  };
  const place = (slot: SlotSpec, r: number, c: number) => {
    out.push(slot);
    const { w, h } = SIZE_DIM[slot.size];
    for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) setOcc(r + i, c + j);
  };

  let row = 0;
  let col = 0;
  // Bound the loop so a pathological input can't spin forever; the
  // grid never needs more iterations than (slot count * cols).
  let safety = slots.length * cols + cols;
  while (queue.length > 0 && safety-- > 0) {
    while (isOcc(row, col)) {
      col++;
      if (col >= cols) {
        col = 0;
        row++;
      }
    }
    if (fits(queue[0], row, col)) {
      const s = queue.shift()!;
      const w = SIZE_DIM[s.size].w;
      place(s, row, col);
      col += w;
      if (col >= cols) {
        col = 0;
        row++;
      }
      continue;
    }
    // queue[0] doesn't fit at the current head. Look for a later
    // non-card slot that does — never pull cards forward.
    let pulled = -1;
    for (let i = 1; i < queue.length; i++) {
      const cand = queue[i];
      if (cand.kind === "card") continue;
      if (fits(cand, row, col)) {
        pulled = i;
        break;
      }
    }
    if (pulled >= 0) {
      const s = queue.splice(pulled, 1)[0];
      const w = SIZE_DIM[s.size].w;
      place(s, row, col);
      col += w;
      if (col >= cols) {
        col = 0;
        row++;
      }
      continue;
    }
    // Nothing fits at this position — advance one cell. Eventually the
    // head wraps to the next row where queue[0] should fit.
    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  }
  // Append any leftovers (shouldn't happen, but never drop tiles).
  while (queue.length > 0) out.push(queue.shift()!);
  return out;
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
  const slots = fitToGrid(stratifiedSlotShuffle(pattern, rand));
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
