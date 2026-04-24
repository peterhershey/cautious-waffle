// Narrative beats tied to scroll progress (0..1).
export type SceneBeat = {
  id: string;
  at: number; // center of this beat in progress space
  title: string; // supports <em> via embedded markup; kept as plain for now
  blurb?: string;
};

export const beats: SceneBeat[] = [
  {
    id: "intro",
    at: 0.0,
    title: "Peter Hershey",
    blurb: "UX, visual, and AI product design.",
  },
  {
    id: "work",
    at: 0.35,
    title: "Selected work",
    blurb: "A working desk of things made, in progress, and considered.",
  },
  {
    id: "ai",
    at: 0.65,
    title: "On AI",
    blurb: "Designing for systems that push back as well as respond.",
  },
  {
    id: "about",
    at: 1.0,
    title: "About",
    blurb:
      "Products that feel like objects you can hold. Based in the Washington, DC area.",
  },
];

// How tall the plane is, relative to the viewport. More = more reveal on scroll.
export const PLANE_VH = 600; // 6 viewport heights — more cards, more travel
