export type Era = {
  id: number;
  year: string;
  label: string;
  blurb: string;
  accent: string;
};

export const ERAS: Era[] = [
  {
    id: 0,
    year: "1996",
    label: "Table-Layout Web",
    blurb: "Left rail, blue banners, hyperlink purple on visit. Fixed 900px.",
    accent: "#003366",
  },
  {
    id: 1,
    year: "2004",
    label: "Early Digital",
    blurb: "Newsprint beige, Times New Roman, visitor counter banner.",
    accent: "#0033aa",
  },
  {
    id: 2,
    year: "2014",
    label: "Responsive Era",
    blurb: "Cleaner sans, bigger photos, first real responsive grids.",
    accent: "#c8102e",
  },
  {
    id: 3,
    year: "2026",
    label: "Today",
    blurb: "Fraunces, editorial grid, interlocked sections.",
    accent: "#111111",
  },
];

export const DEFAULT_ERA = 3;
