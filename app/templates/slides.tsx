"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  TextImageSlide,
  TileColor,
} from "../_deck/slides/text-image/TextImageSlide";
import { TILES } from "../_deck/slides/field-notes/tiles";
import { IntroTemplate } from "../_deck/templates/IntroTemplate";
import { ThreeUpTemplate } from "../_deck/templates/ThreeUpTemplate";
import { GoalTemplate } from "../_deck/templates/GoalTemplate";
import { EmojiHeadlineTemplate } from "../_deck/templates/EmojiHeadlineTemplate";
import { ProjectAtAGlanceTemplate } from "../_deck/templates/ProjectAtAGlanceTemplate";
import { TimelineSample } from "./sample/TimelineSample";

/* Archive image pool — pulled from the creator/archive tiles, filtered to
   still-image formats (no videos). 05b's morph picks 5 at random per mount. */
const ARCHIVE_IMAGES: string[] = TILES.filter(
  (t): t is Extract<(typeof TILES)[number], { kind: "image" }> =>
    t.kind === "image" && /\.(jpe?g|png|gif|webp)$/i.test(t.src),
).map((t) => t.src);

const LIPSUM_MED =
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";
const LIPSUM_LONG =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

/* Each slide component renders template content only. Outer layout
   (full-viewport container, optional label) is provided by the parent
   — SlideWrapper on the sample page, PreviewShell on the preview route. */

export function IntroSlide() {
  return (
    <IntroTemplate
      emoji="🍫"
      greeting={<>Hi, I&apos;m</>}
      name="Lorem Ipsum."
      note="Consectetur adipiscing elit — sed do eiusmod tempor."
    />
  );
}

export function QuoteSlide() {
  return (
    <p className="wipu-sample-quote">
      &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit.&rdquo;
      <span className="wipu-sample-quote-attr">— Lorem Ipsum, 2026</span>
    </p>
  );
}

export function InfoSlide() {
  return (
    <div className="wipu-sample-info-grid">
      <div>
        <h2 className="wipu-sample-info-title">
          Consectetur adipiscing elit, sed do eiusmod.
        </h2>
        <p className="wipu-sample-info-kicker">
          Ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className="wipu-sample-info-body">
        <p>{LIPSUM_MED}</p>
        <p>{LIPSUM_LONG}</p>
      </div>
    </div>
  );
}

export function ThreeUpSlide() {
  return (
    <ThreeUpTemplate
      blocks={[
        { eyebrow: "Lorem 01", title: "Ipsum dolor", body: LIPSUM_MED },
        { eyebrow: "Lorem 02", title: "Sit amet", body: LIPSUM_MED },
        { eyebrow: "Lorem 03", title: "Consectetur", body: LIPSUM_MED },
      ]}
    />
  );
}

export function MediaLeftSlide() {
  return (
    <TextImageSlide
      side="right"
      eyebrow="Lorem · 05"
      title={<>Ipsum dolor sit amet consectetur.</>}
      subtitle="Adipiscing elit — sed do eiusmod tempor incididunt."
    >
      <div className="wipu-ti-cluster wipu-ti-cluster-b">
        <TileColor tone="rose" />
        <TileColor tone="terracotta" />
      </div>
    </TextImageSlide>
  );
}

/* ── 05b: Media Left, animating two-box morph ──
   Each phase has a long "rest" beat (showing the photo + color clearly)
   and a short "morph" beat (quick swap to the next layout, with content
   crossfading roles). The pair of boxes flow through 5 layouts and swap
   roles each phase (photo↔color). Position interpolates linearly with a
   smoothstep ease across the morph window only — outside that window
   the box sits still on its photo. Content uses stacked per-phase
   layers with overlapping smoothstep opacity driven off the same eased
   "effective phase" so position and content always stay in lockstep. */

type MorphRect = { left: number; top: number; width: number; height: number };
const MORPH_LAYOUTS: [MorphRect, MorphRect][] = [
  [
    { left: 0, top: 0, width: 62, height: 100 },
    { left: 66, top: 0, width: 34, height: 44 },
  ],
  [
    { left: 38, top: 0, width: 62, height: 100 },
    { left: 0, top: 0, width: 34, height: 56 },
  ],
  [
    { left: 0, top: 0, width: 100, height: 60 },
    { left: 0, top: 64, width: 44, height: 36 },
  ],
  [
    { left: 0, top: 0, width: 66, height: 66 },
    { left: 70, top: 70, width: 30, height: 30 },
  ],
  [
    { left: 0, top: 28, width: 64, height: 72 },
    { left: 50, top: 0, width: 50, height: 22 },
  ],
];
const MORPH_TONES = ["rose", "terracotta", "mustard", "mint", "navy"] as const;
const MORPH_PHASE_MS = 4200; // total time per phase (rest + morph)
const MORPH_REST_FRAC = 0.72; // first 72% of phase is rest, last 28% is morph
const MORPH_PHOTO_COUNT = 5;
const MORPH_CYCLE = MORPH_LAYOUTS.length * 2; // 10 phases (5 layouts × parity)

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
function rectAt(box: "A" | "B", phase: number): MorphRect {
  const layoutIdx = mod(phase, MORPH_LAYOUTS.length);
  const aIsBig = mod(phase, 2) === 0;
  const slot = (box === "A" ? aIsBig : !aIsBig) ? 0 : 1;
  return MORPH_LAYOUTS[layoutIdx][slot];
}
function contentAt(box: "A" | "B", phase: number) {
  const isPhoto = mod(phase + (box === "A" ? 0 : 1), 2) === 0;
  const idx = mod(phase, MORPH_PHOTO_COUNT);
  return isPhoto
    ? { kind: "photo" as const, idx }
    : { kind: "tint" as const, tone: MORPH_TONES[idx] };
}
function smoothstep(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}

/* CSS-style cubic-bezier(x1, y1, x2, y2) — Newton solves x(t) = u, returns y(t).
   Matches the archive's signature ease curve `cubic-bezier(0.22, 0.8, 0.2, 1)`:
   sharp acceleration off the rest, long soft landing into the next rest. */
function makeCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDerivX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (u: number) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let t = u;
    for (let i = 0; i < 8; i++) {
      const dx = sampleDerivX(t);
      if (Math.abs(dx) < 1e-6) break;
      t -= (sampleX(t) - u) / dx;
    }
    return sampleY(t);
  };
}
const morphEase = makeCubicBezier(0.22, 0.8, 0.2, 1);

export function MediaLeftAnimatingSlide() {
  const [pickedImages, setPickedImages] = useState<string[]>(() =>
    ARCHIVE_IMAGES.slice(0, MORPH_PHOTO_COUNT),
  );

  const refA = useRef<HTMLDivElement | null>(null);
  const refB = useRef<HTMLDivElement | null>(null);
  const layersA = useRef<(HTMLDivElement | null)[]>([]);
  const layersB = useRef<(HTMLDivElement | null)[]>([]);

  // Randomize the 5 photos after mount (deterministic SSR, randomized client).
  useEffect(() => {
    if (ARCHIVE_IMAGES.length < MORPH_PHOTO_COUNT) return;
    const shuffled = [...ARCHIVE_IMAGES]
      .sort(() => Math.random() - 0.5)
      .slice(0, MORPH_PHOTO_COUNT);
    setPickedImages(shuffled);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyRect = (el: HTMLDivElement | null, r: MorphRect) => {
      if (!el) return;
      el.style.left = `${r.left}%`;
      el.style.top = `${r.top}%`;
      el.style.width = `${r.width}%`;
      el.style.height = `${r.height}%`;
    };

    if (reduce) {
      applyRect(refA.current, rectAt("A", 0));
      applyRect(refB.current, rectAt("B", 0));
      layersA.current.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? "1" : "0";
      });
      layersB.current.forEach((el, i) => {
        if (el) el.style.opacity = i === 0 ? "1" : "0";
      });
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / MORPH_PHASE_MS;
      const phaseIdx = Math.floor(elapsed);
      const localT = elapsed - phaseIdx;

      // Eased "morph progress" — 0 during rest, 0→1 (smoothstepped) during
      // the morph window. This drives BOTH position and content opacity so
      // they stay in lockstep: still on the photo, then a quick smooth
      // morph + crossfade together.
      const morphT =
        localT < MORPH_REST_FRAC
          ? 0
          : morphEase((localT - MORPH_REST_FRAC) / (1 - MORPH_REST_FRAC));

      const interp = (box: "A" | "B"): MorphRect => {
        const from = rectAt(box, phaseIdx);
        const to = rectAt(box, phaseIdx + 1);
        return {
          left: from.left + (to.left - from.left) * morphT,
          top: from.top + (to.top - from.top) * morphT,
          width: from.width + (to.width - from.width) * morphT,
          height: from.height + (to.height - from.height) * morphT,
        };
      };
      applyRect(refA.current, interp("A"));
      applyRect(refB.current, interp("B"));

      // Effective continuous phase position: integer during rest, ramps to
      // next integer during morph window. Layer opacities follow this.
      const effectivePhase = phaseIdx + morphT;
      const updateLayers = (refs: (HTMLDivElement | null)[]) => {
        for (let i = 0; i < MORPH_CYCLE; i++) {
          const el = refs[i];
          if (!el) continue;
          const tInCycle = mod(effectivePhase - i, MORPH_CYCLE);
          const dist = Math.min(tInCycle, MORPH_CYCLE - tInCycle);
          el.style.opacity = dist >= 1 ? "0" : String(smoothstep(1 - dist));
        }
      };
      updateLayers(layersA.current);
      updateLayers(layersB.current);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const renderLayer = (
    box: "A" | "B",
    i: number,
    refs: (HTMLDivElement | null)[],
  ) => {
    const c = contentAt(box, i);
    const setRef = (el: HTMLDivElement | null) => {
      refs[i] = el;
    };
    if (c.kind === "photo") {
      const src = pickedImages[c.idx];
      return (
        <div key={i} ref={setRef} className="wipu-morph-fill">
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" loading="lazy" draggable={false} />
          )}
        </div>
      );
    }
    return (
      <div
        key={i}
        ref={setRef}
        className="wipu-morph-fill"
        style={{ backgroundColor: `var(--wipu-${c.tone})` }}
      />
    );
  };

  return (
    <TextImageSlide
      side="right"
      eyebrow="Lorem · 05b"
      title={<>Ipsum dolor sit amet consectetur.</>}
      subtitle="Adipiscing elit — sed do eiusmod tempor incididunt."
    >
      <div className="wipu-morph">
        <div ref={refA} className="wipu-morph-box" aria-hidden>
          {Array.from({ length: MORPH_CYCLE }, (_, i) =>
            renderLayer("A", i, layersA.current),
          )}
        </div>
        <div ref={refB} className="wipu-morph-box" aria-hidden>
          {Array.from({ length: MORPH_CYCLE }, (_, i) =>
            renderLayer("B", i, layersB.current),
          )}
        </div>
      </div>
    </TextImageSlide>
  );
}

export function MediaRightSlide() {
  return (
    <TextImageSlide
      side="left"
      eyebrow="Lorem · 06"
      title={<>Tempor incididunt ut labore et dolore.</>}
      subtitle="Magna aliqua — ut enim ad minim veniam."
    >
      <div className="wipu-ti-cluster wipu-ti-cluster-c">
        <TileColor tone="mint" />
        <TileColor tone="mustard" />
        <TileColor tone="navy" />
      </div>
    </TextImageSlide>
  );
}

export function TimelineSlide() {
  return <TimelineSample />;
}

export function DesignExplorationsSlide() {
  const tiles = [
    { tint: "terracotta", size: "2x2" },
    { tint: "mint", size: "1x1" },
    { tint: "mustard", size: "1x2" },
    { tint: "rose", size: "2x1" },
    { tint: "navy", size: "1x1" },
    { tint: "mustard", size: "1x1" },
    { tint: "mint", size: "2x1" },
    { tint: "rose", size: "1x1" },
  ] as const;
  return (
    <div className="wipu-sample-explore">
      {tiles.map((t, i) => (
        <div
          key={i}
          className={`wipu-sample-explore-tile wipu-sample-explore-${t.size}`}
          data-tint={t.tint}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function HeroMetricSlide() {
  return (
    <div className="wipu-sample-heroMetric">
      <span className="wipu-sample-heroMetric-n">42M</span>
      <div className="wipu-sample-heroMetric-lbl">
        Lorem ipsum dolor sit amet
      </div>
      <p className="wipu-sample-heroMetric-note">{LIPSUM_MED}</p>
    </div>
  );
}

export function MetricsCollectionSlide() {
  const metrics = [
    { n: "42M", lbl: "Lorem ipsum dolor", tone: "terracotta" as const },
    { n: "3.2×", lbl: "Sit amet consectetur", tone: "mint" as const },
    { n: "98%", lbl: "Adipiscing elit tempor", tone: "mustard" as const },
  ];
  return (
    <div className="wipu-sample-metrics">
      <h2 className="wipu-sample-metrics-title">
        Consectetur adipiscing elit.
      </h2>
      {metrics.map((m) => (
        <div key={m.n}>
          <span className="wipu-sample-metric-n" data-tone={m.tone}>
            {m.n}
          </span>
          <div className="wipu-sample-metric-lbl">{m.lbl}</div>
        </div>
      ))}
    </div>
  );
}

/* YouTube IFrame Player API — gives us play/pause state for the glow's
   audio-pulse gate. True amplitude isn't reachable across the cross-origin
   iframe, so the pulse is a synthesized music-shaped envelope, on while
   playing, off otherwise. Ambient drift runs always. */
declare global {
  interface Window {
    YT?: { Player: new (id: string, opts: unknown) => YTPlayerLike };
    onYouTubeIframeAPIReady?: () => void;
  }
}
type YTPlayerLike = { destroy?: () => void };
const YT_API_SRC = "https://www.youtube.com/iframe_api";
const YT_STATE_PLAYING = 1;

export function VideoEmbedSlide() {
  const id = "3uGLjmrPorg";
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const playerElId = `wipu-video-${id}`;

  const glowRef = useRef<HTMLDivElement | null>(null);
  const playingRef = useRef(false);

  // Hook the iframe with the YT IFrame API to track play state.
  useEffect(() => {
    let player: YTPlayerLike | null = null;

    const init = () => {
      const YT = window.YT;
      if (!YT?.Player) return;
      player = new YT.Player(playerElId, {
        events: {
          onStateChange: (e: { data: number }) => {
            playingRef.current = e.data === YT_STATE_PLAYING;
          },
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
        const tag = document.createElement("script");
        tag.src = YT_API_SRC;
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
    }

    return () => {
      try {
        player?.destroy?.();
      } catch {
        /* noop */
      }
    };
  }, [playerElId]);

  // Drive the glow: always-on ambient drift + audio-shaped pulse when playing.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const start = performance.now();
    let envelope = 0; // smoothed gate: 1 while playing, 0 otherwise

    const tick = () => {
      const t = (performance.now() - start) / 1000;

      const target = playingRef.current ? 1 : 0;
      envelope += (target - envelope) * 0.03;

      // Always-on ambient — slow breathing + drift, both 0..1.
      const breathe = Math.sin(t * 0.26) * 0.5 + 0.5;
      const drift = Math.cos(t * 0.2) * 0.5 + 0.5;

      // Music-shaped pulse: layered sines at unrelated rates so the bumps
      // feel organic rather than metronomic. Sparse "beat" sine clipped at
      // the bottom for punch. Multiplied by envelope so it fades on pause.
      const bass = Math.sin(t * 1.5) * 0.5 + 0.5;
      const beat = Math.max(0, Math.sin(t * 3.1) - 0.25) / 0.75;
      const high = Math.sin(t * 5.3) * 0.5 + 0.5;
      const pulse = (bass * 0.5 + beat * 0.4 + high * 0.1) * envelope;

      const el = glowRef.current;
      if (el) {
        // Larger base scale = glow extends past all four edges. Constant
        // +5% Y translate biases more spillover below the frame while
        // keeping a softer halo above.
        const scale = 1.18 + breathe * 0.014 + pulse * 0.035;
        const tx = Math.sin(t * 0.17) * 0.4;
        const ty = 5 + Math.cos(t * 0.22) * 0.5;
        const opacity = 0.5 + drift * 0.06 + pulse * 0.2;
        const blurPx = 112 + breathe * 6 - pulse * 10;
        const sat = 1.45 + pulse * 0.4;
        el.style.transform = `translate(${tx}%, ${ty}%) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = `blur(${blurPx}px) saturate(${sat})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure className="wipu-sample-video">
      <div className="wipu-sample-video-stage">
        <div
          ref={glowRef}
          className="wipu-sample-video-glow"
          style={{ backgroundImage: `url(${thumb})` }}
          aria-hidden
        />
        <div className="wipu-sample-video-frame">
          <iframe
            id={playerElId}
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&enablejsapi=1`}
            title="Lorem ipsum video embed"
            className="wipu-sample-video-iframe"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
      <figcaption className="wipu-sample-video-title">
        Lorem ipsum dolor sit amet
      </figcaption>
    </figure>
  );
}

export function PrototypeSlide() {
  return (
    <section className="wipu-sample-proto">
      <iframe
        src="/archive/prototypes/voice-chat"
        title="Voice chat prototype"
        className="wipu-sample-proto-iframe"
        loading="lazy"
        allow="autoplay; encrypted-media"
      />
    </section>
  );
}

export function GoalSlide() {
  return (
    <GoalTemplate
      eyebrow="GOAL"
      emoji="🎯"
      goal={
        <>
          Make it <strong>simple, obvious, and delightful</strong> to do{" "}
          <strong>powerful, contextual</strong> tasks with my apps and content.
        </>
      }
      annotations={[
        {
          position: "tr",
          text: "Create an easy entrypoint that communicates value and encourages adoption",
        },
        {
          position: "bl",
          text: "Focusing on journeys that users want will promote retention",
        },
      ]}
    />
  );
}

export function EmojiHeadlineSlide() {
  return (
    <EmojiHeadlineTemplate
      emojis={["💁", "💬", "🧓"]}
      title={
        <>
          <strong>Multimodality is fundamental</strong> to natural human
          conversation
        </>
      }
    />
  );
}

export function ProjectAtAGlanceSlide() {
  return (
    <ProjectAtAGlanceTemplate
      title="Lorem Project"
      team="Lorem Ipsum + 4 designers, 2 PMs, 6 engineers"
      timeline="Q3 2025 — Q1 2026"
      role="Design Lead"
      scope="Multi-platform launch"
      platforms="iOS · Android · Web"
      awards="Webby Honoree · Communication Arts"
    />
  );
}

export function ArchiveGallerySlide() {
  return (
    <div className="wipu-sample-archive">
      <button type="button" className="wipu-sample-archive-trigger">
        <span className="wipu-sample-archive-icon" aria-hidden>
          📁
        </span>
        <span className="wipu-sample-archive-lbl">Lorem archive</span>
      </button>
      <p className="wipu-sample-archive-caption">
        Click expands to a draggable canvas of tiles (mock — no expansion on
        this sample).
      </p>
    </div>
  );
}

/* Slide slugs that render as a full custom section (no SlideWrapper /
   PreviewShell centering — they manage their own viewport). */
export const SELF_CONTAINED = new Set(["07", "11"]);

/* Slide slugs that should always render dark, regardless of root theme.
   The wrappers stamp data-theme="dark" on the section; CSS in sample.css
   redeclares the dark tokens scoped to that section. */
export const DARK_SLIDES = new Set(["13"]);

export const BY_SLUG: Record<string, ComponentType> = {
  "01": IntroSlide,
  "02": QuoteSlide,
  "03": InfoSlide,
  "04": ThreeUpSlide,
  "05": MediaLeftSlide,
  "05b": MediaLeftAnimatingSlide,
  "06": MediaRightSlide,
  "07": TimelineSlide,
  "08": DesignExplorationsSlide,
  "09": HeroMetricSlide,
  "10": MetricsCollectionSlide,
  "13": VideoEmbedSlide,
  "14": GoalSlide,
  "15": EmojiHeadlineSlide,
  "16": ProjectAtAGlanceSlide,
  "11": PrototypeSlide,
  "12": ArchiveGallerySlide,
};
