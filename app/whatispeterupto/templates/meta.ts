export type TemplateGroup = "Structural" | "Content" | "Special";

export type TemplateMeta = {
  slug: string;
  name: string;
  group: TemplateGroup;
  use: string;
};

export const TEMPLATES: TemplateMeta[] = [
  {
    slug: "01",
    name: "Intro / Closing",
    group: "Structural",
    use: "Hero + case-study entry/exit. Case-study variant adds Role / Team / Shipped / Platforms meta bar.",
  },
  {
    slug: "02",
    name: "Text Only — Quote",
    group: "Content",
    use: "One pull quote or highlight on its own beat. Large type, minimal framing.",
  },
  {
    slug: "03",
    name: "Text Only — Informational",
    group: "Content",
    use: "Context-setting or narrative beats. Body copy block, no images.",
  },
  {
    slug: "04",
    name: "Three-Up",
    group: "Content",
    use: "Three parallel concepts, options, or press quotes side-by-side.",
  },
  {
    slug: "05",
    name: "Media Left / Text Right",
    group: "Content",
    use: "Cluster of 2–3 rounded-corner tiles on the left, text column on the right. Grid-based but nudged off-axis for a hand-placed feel.",
  },
  {
    slug: "06",
    name: "Media Right / Text Left",
    group: "Content",
    use: "Flipped version. Same cluster language — 2–3 tiles, slightly off-grid.",
  },
  {
    slug: "07",
    name: "Timeline",
    group: "Content",
    use: "Scroll-pinned sequence. One wide-format image at a time; scrolling pans through stops horizontally. Past the last stop, scroll releases to the next slide.",
  },
  {
    slug: "08",
    name: "Design Explorations",
    group: "Content",
    use: "All-image grid, no text. Visual iterations or options.",
  },
  {
    slug: "09",
    name: "Hero Metric",
    group: "Content",
    use: "One standout stat. Big number, label, optional supporting line.",
  },
  {
    slug: "10",
    name: "Metrics Collection",
    group: "Content",
    use: "Three metrics side-by-side. Impact cluster. Often composed with press quotes into an Impact section.",
  },
  {
    slug: "11",
    name: "Prototype",
    group: "Special",
    use: "Thin slide-wrapper that embeds one of the real interactive prototypes from /prototypes. Comes at the end of every case study.",
  },
  {
    slug: "12",
    name: "Archive Gallery",
    group: "Special",
    use: "Folder icon entrypoint → expands to draggable canvas of tiles. Main page only.",
  },
];

export const GROUPS = [
  { key: "Structural" as const, num: "01", name: "Structural" },
  { key: "Content" as const, num: "02", name: "Content layout" },
  { key: "Special" as const, num: "03", name: "Special" },
];

export function getTemplate(slug: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}
