"use client";

import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CaseStudyScrollContext } from "../[id]/CaseStudyDeck";

export type TimelineStopAnnotation = {
  /** Corner the card sits in. Leader runs diagonally toward the figure. */
  position: "tl" | "tr" | "bl" | "br";
  text: ReactNode;
};

export type TimelineStop = {
  tint: "terracotta" | "mint" | "mustard" | "rose" | "navy";
  title: string;
  /** Optional date/eyebrow caption. Omit for slideshow-style timelines (e.g. design explorations). */
  date?: string;
  /** Optional real image. If provided, replaces the tinted gradient placeholder. */
  image?: { src: string; alt: string };
  /** Optional 2-up: side-by-side images. Takes precedence over `image`. */
  images?: { src: string; alt: string }[];
  /** Optional custom node rendered in the figure slot, replacing the
      image/placeholder entirely. Used for animated stand-ins like Gel. */
  media?: ReactNode;
  /** Optional callouts pinned to the stop's corners with dotted leaders. */
  annotations?: TimelineStopAnnotation[];
};

/* Orthogonal Manhattan leaders matching the Goal slide visual: exit
   the card vertically, run horizontally to the target column, then
   drop into the figure. End coords feed a CSS arrowhead — a marker
   inside the SVG would distort under preserveAspectRatio="none". */
const ANNO_PATHS: Record<
  TimelineStopAnnotation["position"],
  { d: string; endX: number; endY: number; endsDown: boolean }
> = {
  tl: { d: "M 15 17 V 26 H 32 V 34", endX: 32, endY: 34, endsDown: true },
  tr: { d: "M 85 17 V 26 H 68 V 34", endX: 68, endY: 34, endsDown: true },
  bl: { d: "M 15 79 V 74 H 32 V 66", endX: 32, endY: 66, endsDown: false },
  br: { d: "M 85 79 V 74 H 68 V 66", endX: 68, endY: 66, endsDown: false },
};

/* Media box in stop-relative percentage space (matches the 0–100
   viewBox the annotation svg stretches over). */
type MediaBox = { l: number; t: number; r: number; b: number };

type AnnoDir = "down" | "up" | "left" | "right";
type AnnoSeg = { d: string; endX: number; endY: number; dir: AnnoDir };

/* The static ANNO_PATHS end-columns (32% / 68%) assume a full-width
   16:10 figure. Narrow media (e.g. a portrait phone recording) leaves
   the arrow floating in empty space beside it — so when the media box
   has been measured, re-aim the leader at the media: keep the static
   path while its end column hits the media; otherwise run the rail
   horizontally and point at the media's near edge from the side. */
function annoPath(
  position: TimelineStopAnnotation["position"],
  box?: MediaBox,
): AnnoSeg {
  const f = ANNO_PATHS[position];
  const fallback: AnnoSeg = { ...f, dir: f.endsDown ? "down" : "up" };
  if (!box || box.r <= box.l) return fallback;
  if (f.endX >= box.l + 4 && f.endX <= box.r - 4) return fallback;

  const isLeft = position === "tl" || position === "bl";
  const top = position === "tl" || position === "tr";
  const startX = isLeft ? 15 : 85;
  const startY = top ? 17 : 79;
  const railY = top ? 26 : 74;

  if (railY > box.t + 3 && railY < box.b - 3) {
    // Side approach: rail height crosses the media — stop just short of
    // its near edge and point into it.
    const endX = isLeft ? box.l - 1.5 : box.r + 1.5;
    return {
      d: `M ${startX} ${startY} V ${railY} H ${endX}`,
      endX,
      endY: railY,
      dir: isLeft ? "right" : "left",
    };
  }

  // Rail clears the media vertically — keep the vertical drop but pull
  // the end column inside the media's horizontal span.
  const inset = Math.min(8, (box.r - box.l) * 0.2);
  const endX = isLeft ? box.l + inset : box.r - inset;
  return {
    d: `M ${startX} ${startY} V ${railY} H ${endX} V ${f.endY}`,
    endX,
    endY: f.endY,
    dir: fallback.dir,
  };
}

const DEFAULT_STOPS: TimelineStop[] = [
  { tint: "terracotta", title: "Lorem Ipsum", date: "FEB 2024" },
  { tint: "mustard", title: "Dolor Sit Amet", date: "MAY 2024" },
  { tint: "mint", title: "Consectetur", date: "AUG 2024" },
  { tint: "rose", title: "Adipiscing Elit", date: "FEB 2025" },
  { tint: "navy", title: "Tempor Incididunt", date: "OCT 2025" },
];

export type TimelineSampleProps = {
  /** Pass a custom list of stops; defaults to the lorem-ipsum sample set. */
  stops?: TimelineStop[];
  /** Optional eyebrow shown in the top-left of the pinned viewport. Omit to
      let an outer chrome (DeckFrame) own the slide title instead. */
  label?: { num: string; name: string };
  /** Optional modifier class appended to the root <section>, used to scope
      per-instance variants (e.g. "is-low-titles") in CSS. */
  className?: string;
};

/**
 * Scroll-pinned horizontal timeline. Outer section is
 * stops.length * 100svh tall. A sticky pin holds a single viewport
 * while vertical scroll is translated into horizontal pan across the
 * stops. rAF-throttled. Mirrors the Teaching Gemini to See pattern.
 */
export function TimelineSample({
  stops = DEFAULT_STOPS,
  label,
  className,
}: TimelineSampleProps = {}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const [mediaBoxes, setMediaBoxes] = useState<Record<number, MediaBox>>({});
  const n = stops.length;

  /* Measure each annotated stop's media box so leaders can aim at it.
     offset* values are untransformed layout space — the same space the
     annotation svg stretches over, and immune to the inactive figure's
     scale(0.86). Lazy imgs / metadata-preloaded videos re-measure on load. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const stopEls = Array.from(
      track.querySelectorAll<HTMLElement>(".wipu-sample-tl-stop"),
    );

    const measure = () => {
      const next: Record<number, MediaBox> = {};
      stopEls.forEach((el, i) => {
        if (!stops[i]?.annotations?.length) return;
        const media = el.querySelector<HTMLElement>(
          ".wipu-sample-tl-images, .wipu-sample-tl-image",
        );
        if (!media || !media.offsetWidth) return;
        let l = 0;
        let t = 0;
        let node: HTMLElement | null = media;
        while (node && node !== el) {
          l += node.offsetLeft;
          t += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (node !== el || !w || !h) return;
        next[i] = {
          l: (l / w) * 100,
          t: (t / h) * 100,
          r: ((l + media.offsetWidth) / w) * 100,
          b: ((t + media.offsetHeight) / h) * 100,
        };
      });
      setMediaBoxes(next);
    };

    measure();
    window.addEventListener("resize", measure);
    const mediaEls = Array.from(track.querySelectorAll("img, video"));
    mediaEls.forEach((m) => {
      m.addEventListener("load", measure);
      m.addEventListener("loadedmetadata", measure);
    });
    return () => {
      window.removeEventListener("resize", measure);
      mediaEls.forEach((m) => {
        m.removeEventListener("load", measure);
        m.removeEventListener("loadedmetadata", measure);
      });
    };
  }, [stops]);

  // Inside a CaseStudyDeck, the scroll source is the deck container; outside
  // (e.g. standalone preview routes) it falls back to window.
  const scrollSource = useContext(CaseStudyScrollContext);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!section || !track || !fill) return;
    const scrollEl: HTMLElement | Window = scrollSource ?? window;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 820px)");
    const isFallback = () => reduced.matches || narrow.matches;

    let raf = 0;
    let lastIdx = -1;

    const update = () => {
      raf = 0;
      if (isFallback()) {
        track.style.transform = "";
        fill.style.width = "";
        if (lastIdx !== 0) {
          setActive(0);
          lastIdx = 0;
        }
        return;
      }
      const rect = section.getBoundingClientRect();
      /* Pannable distance is derived from the section's own height (set in
         svh) rather than window.innerHeight (lvh on mobile). The snap
         markers are spaced at 100svh; using innerHeight here causes
         progress to overshoot once the URL bar collapses, which translates
         the track further left than the snap position warrants. */
      const pannable = n > 1 ? ((n - 1) / n) * rect.height : 1;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / pannable));
      const panVw = progress * (n - 1) * 100;
      track.style.transform = `translate3d(${-panVw}vw, 0, 0)`;
      fill.style.width = `${progress * 100}%`;
      const idx = Math.min(n - 1, Math.round(progress * (n - 1)));
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, scrollSource]);

  return (
    <section
      ref={sectionRef}
      className={`wipu-sample-tl${className ? ` ${className}` : ""}`}
      style={{ height: `${n * 100}svh` }}
      aria-label="Scroll-pinned timeline"
    >
      {stops.map((_, i) => (
        <div
          key={`snap-${i}`}
          className="wipu-sample-tl-snap"
          style={{ top: `${i * 100}svh` }}
          aria-hidden="true"
        />
      ))}
      <div className="wipu-sample-tl-pin">
        {label && (
          <div className="wipu-sample-slide-label">
            <strong>{label.num}</strong> {label.name}
          </div>
        )}
        <div
          ref={trackRef}
          className="wipu-sample-tl-track"
          style={{ width: `${n * 100}%` }}
          aria-hidden="true"
        >
          {stops.map((stop, i) => (
            <div
              key={i}
              className={`wipu-sample-tl-stop${
                active === i ? " is-active" : ""
              }`}
              style={{ flex: `0 0 calc(100% / ${n})` }}
            >
              <figure className="wipu-sample-tl-figure">
                {stop.media ? (
                  stop.media
                ) : stop.images && stop.images.length > 1 ? (
                  <div
                    className="wipu-sample-tl-images"
                    data-count={stop.images.length}
                  >
                    {stop.images.map((img, j) =>
                      /\.(mp4|webm|mov)$/i.test(img.src) ? (
                        <video
                          key={j}
                          className="wipu-sample-tl-image"
                          src={img.src}
                          aria-label={img.alt}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          draggable={false}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={j}
                          className="wipu-sample-tl-image"
                          src={img.src}
                          alt={img.alt}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                        />
                      ),
                    )}
                  </div>
                ) : stop.image ? (
                  /\.(mp4|webm|mov)$/i.test(stop.image.src) ? (
                    <video
                      className="wipu-sample-tl-image"
                      src={stop.image.src}
                      aria-label={stop.image.alt}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      draggable={false}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="wipu-sample-tl-image"
                      src={stop.image.src}
                      alt={stop.image.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                  )
                ) : (
                  <div
                    className="wipu-sample-tl-image"
                    data-tint={stop.tint}
                    role="img"
                    aria-label={
                      stop.date ? `${stop.title}, ${stop.date}` : stop.title
                    }
                  />
                )}
                <figcaption className="wipu-sample-tl-stop-caption">
                  <span className="wipu-sample-tl-stop-label">
                    {stop.title}
                  </span>
                  {stop.date && (
                    <span className="wipu-sample-tl-stop-date">
                      {stop.date}
                    </span>
                  )}
                </figcaption>
              </figure>
              {stop.annotations && stop.annotations.length > 0 && (
                <>
                  <svg
                    className="wipu-sample-tl-anno-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {stop.annotations.map((a, j) => {
                      const seg = annoPath(a.position, mediaBoxes[i]);
                      return (
                        <path
                          key={`anno-line-${j}`}
                          className="wipu-sample-tl-anno-line"
                          d={seg.d}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeDasharray="0 7"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </svg>
                  {stop.annotations.map((a, j) => {
                    const seg = annoPath(a.position, mediaBoxes[i]);
                    return (
                      <span
                        key={`anno-arrow-${j}`}
                        className={`wipu-sample-tl-anno-arrow is-${seg.dir}`}
                        style={{
                          left: `${seg.endX}%`,
                          top: `${seg.endY}%`,
                        }}
                        aria-hidden="true"
                      />
                    );
                  })}
                  {stop.annotations.map((a, j) => (
                    <div
                      key={`anno-text-${j}`}
                      className={`wipu-sample-tl-anno wipu-sample-tl-anno-${a.position}`}
                    >
                      {a.text}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="wipu-sample-tl-progress" aria-hidden="true">
          <div className="wipu-sample-tl-rail">
            <span ref={fillRef} className="wipu-sample-tl-fill" />
            {stops.map((stop, i) => (
              <div
                key={i}
                className={`wipu-sample-tl-tick${
                  active >= i ? " is-reached" : ""
                }${active === i ? " is-active" : ""}`}
                style={{ left: `${(i / (n - 1)) * 100}%` }}
              >
                <span className="wipu-sample-tl-tick-dot" />
                {stop.date && (
                  <span className="wipu-sample-tl-tick-label">
                    {stop.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
