/* Data model for the image-editing prototype.

   The whole experience is one idea: the prompt is a live reflection of what
   you're looking at. Each "focus" (the variant grid, a single image, a zoomed
   region) carries its own tokenized prompt. Zooming swaps the focus — and with
   it the words. Editing a chip swaps a word; submitting regenerates the image.

   The scripted demo: tap variant B → see the full image → zoom into the
   waterfall → change the waterfall to a LAVA waterfall → submit (regenerate)
   → unzoom to find the lava now in the full image. Real before/after assets
   back every step, so "altered" is a genuine image swap, not a fake. */

export const IMG_BASE = "/prototypes/image-editing";

export const FILES = {
  variants: {
    A: `${IMG_BASE}/car_A.jpeg`,
    B: `${IMG_BASE}/car_B.jpeg`,
    C: `${IMG_BASE}/car_C.jpeg`,
    D: `${IMG_BASE}/car_D.jpeg`,
  },
  // The selectable variant (B), full-frame — base and lava-regenerated.
  singleBase: `${IMG_BASE}/car_B.jpeg`,
  singleAltered: `${IMG_BASE}/car_B-altered.jpeg`,
  // The waterfall region of B, zoomed in — base and lava-regenerated.
  regionBase: `${IMG_BASE}/car_B-zoom.jpg`,
  regionAltered: `${IMG_BASE}/car_B-zoom-altered.jpeg`,
  // Full-frame B after the car is swapped out via the "Swap car" affordance,
  // offered only once the lava variant is in place.
  singleSwapped: `${IMG_BASE}/car_B-swapped.jpeg`,
} as const;

export type ImgEditChip = {
  id: string;
  label: string;
  /** Alternative words shown when the chip is tapped. */
  alternatives: string[];
  /** Once the image is regenerated to the lava variant, the chip reads this
      so the prompt stays in sync across zoom levels. */
  alteredLabel?: string;
  /** Shared identity for a word that persists across focus changes (e.g. the
      car or the waterfall, described differently at each zoom level). Chips
      with the same morphKey slide to their new position instead of swapping,
      so the sentence reflows rather than repaints. */
  morphKey?: string;
};

export type ImgEditToken =
  | { kind: "text"; text: string }
  | { kind: "chip"; chip: ImgEditChip };

export type ImgEditFocus = "grid" | "single" | "region";

export type ImgEditState = {
  focus: ImgEditFocus;
  /** Trailing tag on the bottom "Refine this image · ___" pill. */
  tag: string;
  prompt: ImgEditToken[];
};

export type ImgEditVariant = {
  id: string;
  src: string;
  alt: string;
  /** The tile that expands into the single-image focus on tap. */
  selectable?: boolean;
};

// ── Helpers for terse prompt authoring ───────────────────────────────────
const t = (text: string): ImgEditToken => ({ kind: "text", text });
const c = (
  id: string,
  label: string,
  alternatives: string[],
  extra?: Partial<ImgEditChip>,
): ImgEditToken => ({ kind: "chip", chip: { id, label, alternatives, ...extra } });

/** Picking an alternative containing this word is what regenerates the image
    into the lava variant — the only edit with real before/after assets. */
export const ALTER_KEYWORD = "lava";

// ── The 2×2 variant grid (B is the selectable one, top-right) ────────────
export const VARIANTS: ImgEditVariant[] = [
  { id: "A", src: FILES.variants.A, alt: "Silver car on a sunny alpine meadow" },
  { id: "B", src: FILES.variants.B, alt: "Silver car with glowing teal wheels beside a waterfall", selectable: true },
  { id: "C", src: FILES.variants.C, alt: "Silver car on a moody dusk mountain road" },
  { id: "D", src: FILES.variants.D, alt: "Dark car on a glowing forest road" },
];

/** Where the waterfall sits in the single image (0–1) — the zoom hotspot and
    the transform-origin for the zoom-in animation. */
export const FOCUS_POINT = { x: 0.51, y: 0.32 };

// ── The three focus states, each with its own prompt ─────────────────────
export const IMG_EDIT_STATES: Record<ImgEditFocus, ImgEditState> = {
  grid: {
    focus: "grid",
    tag: "Style",
    prompt: [
      t("an "),
      c("medium", "image", ["a photo", "a painting", "a 3D render", "a sketch"]),
      t(" of a "),
      c("subject", "futuristic car", ["vintage car", "sports car", "concept car", "muscle car"], {
        morphKey: "w-car",
      }),
      t(" on a "),
      c("setting", "winding mountain road", ["coastal highway", "desert trail", "forest path", "city street"], {
        morphKey: "w-road",
      }),
      t(" surrounded by "),
      c("surround", "dramatic nature", ["wildflowers", "fresh snow", "autumn forest", "rolling fog"]),
    ],
  },
  single: {
    focus: "single",
    tag: "Composition",
    prompt: [
      t("a "),
      c("car", "futuristic silver car", ["matte black car", "candy-red car", "chrome car", "pearl white car"], {
        morphKey: "w-car",
      }),
      t(" with "),
      c("wheels", "glowing teal wheels", ["glowing amber wheels", "violet wheels", "white wheels", "magenta wheels"]),
      t(" rounds a "),
      c("road", "winding mountain road", ["straight highway", "cliffside road", "tunnel road", "stone bridge"], {
        morphKey: "w-road",
      }),
      t(" past a "),
      c("feature", "waterfall", ["lava waterfall", "river", "glacier", "canyon"], {
        alteredLabel: "lava waterfall",
        morphKey: "w-falls",
      }),
    ],
  },
  region: {
    focus: "region",
    tag: "Color",
    prompt: [
      t("a "),
      c("falls", "tall, narrow waterfall", ["lava waterfall", "frozen falls", "wide cascade", "misty veil"], {
        alteredLabel: "cascading lava fall",
        morphKey: "w-falls",
      }),
      t(" over "),
      c("cliffs", "dark mossy cliffs", ["red rock walls", "sheer granite", "snowy ledges", "basalt columns"]),
      t(" beneath "),
      c("atmosphere", "heavy grey mist", ["a clear blue sky", "golden haze", "rolling storm clouds", "soft fog"], {
        alteredLabel: "ember-lit smoke",
      }),
    ],
  },
};

/** After the "Swap car" affordance replaces the car with a giant fish, the
    single-view prompt reflows to describe what's now on the road. The lava
    edit is already committed by this point, so the waterfall reads as lava.
    Reuses the w-car / w-road / w-falls morphKeys so the surviving words slide
    into place rather than repaint; the "glowing teal wheels" clause simply
    drops away with the car. */
export const IMG_EDIT_SINGLE_SWAPPED: ImgEditState = {
  focus: "single",
  tag: "Composition",
  prompt: [
    t("a "),
    c("car", "giant silver fish", ["beached koi", "blue marlin", "humpback whale", "great white shark"], {
      morphKey: "w-car",
    }),
    t(" stranded on a "),
    c("road", "winding mountain road", ["straight highway", "cliffside road", "tunnel road", "stone bridge"], {
      morphKey: "w-road",
    }),
    t(" below a "),
    c("feature", "lava waterfall", ["waterfall", "river", "glacier", "canyon"], {
      morphKey: "w-falls",
    }),
  ],
};

/** Image to show for a given focus, depending on whether the lava edit has
    been committed. */
export function imageFor(focus: ImgEditFocus, altered: boolean): string {
  if (focus === "single") return altered ? FILES.singleAltered : FILES.singleBase;
  if (focus === "region") return altered ? FILES.regionAltered : FILES.regionBase;
  return FILES.singleBase; // grid handles its own tiles
}
