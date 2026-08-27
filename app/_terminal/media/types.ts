/** One frame of a gallery slideshow: an image (right, in a fixed box) paired
 *  with text (left) that changes in sync as you flip. */
export type CarouselItem = {
  src: string;
  alt: string;
  name: string;
  width: number;
  height: number;
  /** Left-column text for this frame. */
  title?: string;
  date?: string;
  note?: string;
  caption?: string;
  /** Optional outbound link (e.g. a published article). When set, the pop-up
   *  footer (or article CTA) opens it in a new tab. */
  href?: string;
  /** Label for the {@link href} call-to-action. Defaults to "Open →". */
  cta?: string;
  /** Article-reader fields (used when the window `variant` is "article"). */
  kicker?: string; // e.g. "PERSPECTIVE · THE WASHINGTON POST"
  dek?: string; // standfirst / subhead
  byline?: string; // e.g. "By Peter Hershey"
};

/** A floating media window over the terminal (Quick Look-style pop-up).
 *  `variant` picks the body layout: a paged image carousel (default) or a
 *  single-item article reader (hero + headline + dek + read-on link). */
export type MediaWindow = {
  title: string;
  items: CarouselItem[];
  variant?: "carousel" | "article";
};
