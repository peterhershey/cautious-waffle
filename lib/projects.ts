export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  image: string;
  width: number;
  height: number;
  tags: string[];
};

// Placement on the vertical "plane" the scroll pans across.
// x, y: 0..100 (% of viewport width / plane height)
// drift: extra vertical travel across full scroll, in viewport heights.
//        negative = floats up faster than the plane; positive = lags behind
// rotateDrift: additional degrees added from scroll 0 → 1
export type Placement = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
  drift: number;
  rotateDrift: number;
};

export type ProjectEntry = Project & { placement: Placement };

const W = 1150;
const H = 1235;

export const projects: ProjectEntry[] = [
  // --- Scene: Intro (0-25% of plane) ---
  {
    slug: "kowloon", title: "Kowloon", year: "2024", role: "Visual / Editorial",
    summary: "Street-level studies in density and light.",
    image: "/assets/samples/hongkong-slideshow_0000_Layer-3.png",
    width: W, height: H, tags: ["Visual", "Photo"],
    placement: { x: 18, y: 6, rotate: -7, scale: 0.85, z: 3, drift: -0.35, rotateDrift: 5 },
  },
  {
    slug: "signal", title: "Signal", year: "2024", role: "Visual",
    summary: "Late-night color as wayfinding.",
    image: "/assets/samples/hongkong-slideshow_0000_Layer-6.png",
    width: W, height: H, tags: ["Visual"],
    placement: { x: 55, y: 4, rotate: 4, scale: 0.75, z: 2, drift: -0.2, rotateDrift: -6 },
  },
  {
    slug: "neon", title: "Neon", year: "2024", role: "Visual / Motion",
    summary: "A study on the ambient palette of commercial light.",
    image: "/assets/samples/hongkong-slideshow_0001_Layer-2.png",
    width: W, height: H, tags: ["Visual"],
    placement: { x: 78, y: 12, rotate: 8, scale: 0.9, z: 4, drift: 0.25, rotateDrift: -5 },
  },
  {
    slug: "drift", title: "Drift", year: "2024", role: "Visual",
    summary: "Film frames lifted from a walk.",
    image: "/assets/samples/hongkong-slideshow_0001_Layer-5.png",
    width: W, height: H, tags: ["Photo"],
    placement: { x: 35, y: 16, rotate: -3, scale: 0.7, z: 5, drift: -0.15, rotateDrift: 8 },
  },

  // --- Scene: Work (25-50%) ---
  {
    slug: "transit", title: "Transit", year: "2024", role: "UX Research",
    summary: "Wayfinding and micro-interactions across a city in motion.",
    image: "/assets/samples/hongkong-slideshow_0002_Layer-1.png",
    width: W, height: H, tags: ["UX", "Research"],
    placement: { x: 62, y: 26, rotate: 2, scale: 1.0, z: 6, drift: -0.1, rotateDrift: 3 },
  },
  {
    slug: "ledger", title: "Ledger", year: "2023", role: "Product",
    summary: "A quiet interface for keeping daily count.",
    image: "/assets/samples/hongkong-slideshow_0002_Layer-4.png",
    width: W, height: H, tags: ["Product"],
    placement: { x: 22, y: 32, rotate: -9, scale: 0.8, z: 3, drift: 0.3, rotateDrift: -7 },
  },
  {
    slug: "atlas", title: "Atlas", year: "2025", role: "AI Product Design",
    summary: "A conversational cartography tool for unfamiliar data.",
    image: "/assets/samples/hongkong-slideshow_0003_Layer-3.png",
    width: W, height: H, tags: ["AI", "Product"],
    placement: { x: 82, y: 38, rotate: -6, scale: 0.95, z: 4, drift: 0.4, rotateDrift: 6 },
  },
  {
    slug: "shoreline", title: "Shoreline", year: "2023", role: "Visual",
    summary: "Edges where systems meet people.",
    image: "/assets/samples/hongkong-slideshow_0003_PH_464_P400_008941-R1-071-34.png",
    width: W, height: H, tags: ["Visual"],
    placement: { x: 45, y: 42, rotate: 5, scale: 0.85, z: 2, drift: -0.25, rotateDrift: 4 },
  },
  {
    slug: "salt", title: "Salt", year: "2024", role: "UX / Visual",
    summary: "Editorial system for a newsroom experimenting with slow reading.",
    image: "/assets/samples/hongkong-slideshow_0004_Layer-2.png",
    width: W, height: H, tags: ["UX", "Editorial"],
    placement: { x: 14, y: 48, rotate: 3, scale: 0.9, z: 5, drift: -0.2, rotateDrift: -3 },
  },
  {
    slug: "porch", title: "Porch", year: "2022", role: "Visual",
    summary: "Ambient color outside the frame.",
    image: "/assets/samples/hongkong-slideshow_0004_PH_464_P400_008941-R1-053-25.png",
    width: W, height: H, tags: ["Photo"],
    placement: { x: 72, y: 52, rotate: -4, scale: 0.75, z: 3, drift: 0.15, rotateDrift: 7 },
  },

  // --- Scene: On AI (50-75%) ---
  {
    slug: "lumen", title: "Lumen", year: "2024", role: "Visual / Brand",
    summary: "Identity and product surface for an ambient lighting startup.",
    image: "/assets/samples/hongkong-slideshow_0005_000005080003.png",
    width: W, height: H, tags: ["Brand", "Visual"],
    placement: { x: 38, y: 58, rotate: -2, scale: 1.05, z: 6, drift: 0.1, rotateDrift: 4 },
  },
  {
    slug: "marrow", title: "Marrow", year: "2023", role: "AI Research",
    summary: "A thinking partner that remembers the question.",
    image: "/assets/samples/hongkong-slideshow_0005_Layer-1.png",
    width: W, height: H, tags: ["AI"],
    placement: { x: 82, y: 62, rotate: 9, scale: 0.8, z: 3, drift: -0.3, rotateDrift: -8 },
  },
  {
    slug: "kite", title: "Kite", year: "2023", role: "AI Product Design",
    summary: "A drafting companion that pushes back on your first instinct.",
    image: "/assets/samples/hongkong-slideshow_0006_000005080021.png",
    width: W, height: H, tags: ["AI", "Writing"],
    placement: { x: 18, y: 66, rotate: 7, scale: 0.88, z: 4, drift: -0.2, rotateDrift: -5 },
  },
  {
    slug: "folio", title: "Folio", year: "2022", role: "Editorial",
    summary: "Paper-first thinking in a screen-first world.",
    image: "/assets/samples/hongkong-slideshow_0006_PH_464_P400_008941-R1-071-34.png",
    width: W, height: H, tags: ["Editorial"],
    placement: { x: 58, y: 70, rotate: -7, scale: 0.78, z: 2, drift: 0.25, rotateDrift: 6 },
  },
  {
    slug: "prairie", title: "Prairie", year: "2023", role: "UX Research",
    summary: "Field research and service design for rural broadband access.",
    image: "/assets/samples/hongkong-slideshow_0007_000005080013.png",
    width: W, height: H, tags: ["Research", "Service"],
    placement: { x: 30, y: 74, rotate: -5, scale: 0.95, z: 5, drift: 0.35, rotateDrift: 3 },
  },
  {
    slug: "resin", title: "Resin", year: "2022", role: "Visual",
    summary: "Materials with memory.",
    image: "/assets/samples/hongkong-slideshow_0007_PH_464_P400_008941-R1-053-25.png",
    width: W, height: H, tags: ["Visual"],
    placement: { x: 76, y: 78, rotate: 4, scale: 0.72, z: 3, drift: -0.15, rotateDrift: 8 },
  },

  // --- Scene: About (75-100%) ---
  {
    slug: "quartz", title: "Quartz", year: "2022", role: "Visual / Motion",
    summary: "A visual system built around refracted light and negative space.",
    image: "/assets/samples/hongkong-slideshow_0008_000005080003.png",
    width: W, height: H, tags: ["Visual", "Motion"],
    placement: { x: 52, y: 82, rotate: 6, scale: 1.0, z: 5, drift: -0.25, rotateDrift: -4 },
  },
  {
    slug: "tidal", title: "Tidal", year: "2021", role: "Product",
    summary: "Rhythms for slow software.",
    image: "/assets/samples/hongkong-slideshow_0008_000005080004.png",
    width: W, height: H, tags: ["Product"],
    placement: { x: 18, y: 86, rotate: -8, scale: 0.82, z: 3, drift: 0.2, rotateDrift: 7 },
  },
  {
    slug: "tether", title: "Tether", year: "2022", role: "Product",
    summary: "Interfaces for the quiet edges of always-on systems.",
    image: "/assets/samples/hongkong-slideshow_0009_000005080021.png",
    width: W, height: H, tags: ["Product"],
    placement: { x: 74, y: 90, rotate: 3, scale: 0.9, z: 4, drift: 0.3, rotateDrift: 5 },
  },
  {
    slug: "terra", title: "Terra", year: "2021", role: "Research",
    summary: "Notes toward a softer grid.",
    image: "/assets/samples/hongkong-slideshow_0010_000005080013.png",
    width: W, height: H, tags: ["Research"],
    placement: { x: 38, y: 94, rotate: -3, scale: 0.78, z: 2, drift: -0.2, rotateDrift: -6 },
  },
  {
    slug: "vellum", title: "Vellum", year: "2021", role: "Visual",
    summary: "Surfaces that remember being touched.",
    image: "/assets/samples/hongkong-slideshow_0011_000005080004.png",
    width: W, height: H, tags: ["Visual"],
    placement: { x: 62, y: 97, rotate: 8, scale: 0.75, z: 3, drift: 0.15, rotateDrift: 4 },
  },
];

export function getProject(slug: string): ProjectEntry | undefined {
  return projects.find((p) => p.slug === slug);
}
