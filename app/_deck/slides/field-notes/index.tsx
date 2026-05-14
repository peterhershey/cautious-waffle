"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDeck } from "../../Deck";
import { fieldNotes } from "@/app/content";
import { BUCKETS } from "./manifest.generated";
import {
  INITIAL_TILES,
  LAYOUT_EDITORIAL,
  buildTiles,
  registerAspect,
  type Tile,
  type TileSize,
} from "./tiles";

const SHUFFLE_FLIP_MS = 620;
/* Faint overshoot — playful, not springy. ~3% past the target. */
const SHUFFLE_FLIP_EASE = "cubic-bezier(0.32, 1.18, 0.64, 1)";

/* ── Breathing pulse ──────────────────────────────────────────────────
   Each tile defaults to its layout size (1x1 squares for the image sea,
   2x2 for the five anchors, 2x1/2x2 for cards). On a slow rhythmic
   pulse a randomly-picked image temporarily expands toward its actual
   aspect — landscape → 2x1, portrait → 1x2 — then collapses back. */
// Breathing override — the size to render at, regardless of slot's
// intrinsic size. Set as `data-breathing="<size>"` on the tile.
type BreathOverride = "1x1" | "2x1" | "1x2";
// Resting-breath rhythm: a new pulse every ~6s, held expanded ~3s,
// 1.2s in/out. One pair (expander + shrinker) at a time.
const BREATH_INTERVAL_MS = 6000;
const BREATH_INTERVAL_JITTER = 0.35;
const BREATH_HOLD_MS = 3000;
const BREATH_TRANSITION_MS = 1200;
const BREATH_TRANSITION_EASE = "cubic-bezier(0.4, 0.0, 0.2, 1)";
const BREATH_MAX_PAIRS = 1;
const BREATH_ROW_TOLERANCE_PX = 6; // tiles within this top-px count as same row
const BREATH_VIEWPORT_PADDING_PX = 60;
const BREATHING_BUCKET_DENYLIST = new Set(["europalette"]);

type OverlayState = "closed" | "opening" | "open" | "closing";

const SLIDE_ID = "field-notes";
const CLOSE_MS = 500;

/* ── Portal hover-dwell tuning ──────────────────────────────────────
   Internal `value` accumulates linearly; the displayed dwell (--dwell)
   is smoothstep(value) (ease-in/out cubic). Starts visibly responsive
   from frame 1 — pure t*t leaves the first ~150ms imperceptible and
   reads as "stuck before it suddenly takes off." Smoothstep keeps the
   slow-start feel but stops the curve from being dead at the origin. */
const DWELL_HOLD_MS = 1500; // hover this long to commit
const DWELL_RELEASE_MS = 320; // un-hover decay (faster than fill)
const easeDwell = (t: number) => t * t * (3 - 2 * t);
const RING_RADIUS = 46; // svg units, 0..100 viewBox
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function readSlideActive(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.querySelector<HTMLElement>(`[data-slide-id="${SLIDE_ID}"]`)?.dataset
      .active === "true"
  );
}

/* ── Magnetic drift constants ─────────────────────────────────────── */
const DRIFT_MAX_PX = 3; // ceiling for drift offset, applied uniformly to all images
const DRIFT_RADIUS = 600; // px — how far cursor influence reaches
const SPRING_STIFFNESS = 0.025; // how fast tiles chase target (lower = slower / heavier)
const SPRING_DAMPING = 0.92; // velocity persistence (higher = more glide / inertia)

/* ── FPS performance gate ─────────────────────────────────────────── */
const FPS_SAMPLE_SIZE = 30;
const FPS_THRESHOLD = 28; // drop magnetic drift below this

const SCROLL_END_TOLERANCE = 8;

export function FieldNotesSlide() {
  const { setImmersive, next, prev, bumpNavKey } = useDeck();
  const [state, setState] = useState<OverlayState>("closed");
  const [isActive, setIsActive] = useState(readSlideActive);
  const [tiles, setTiles] = useState<Tile[]>(() => INITIAL_TILES);
  // Per-slot breathing phase. Lives separately from `tiles` so that
  // a pulse mutation only re-renders the affected TileCard and does
  // NOT re-trigger the shuffle FLIP useLayoutEffect (which depends on
  // `tiles`). See plan: two FLIP effects, two captured-rect refs.
  const [breathing, setBreathing] = useState<Record<number, BreathOverride>>({});
  // While "previewing", the overlay is mounted with a circular clip-path
  // around the folder so the user can literally peer through into the
  // gallery. Distinct from "opening" so we can drive the clip-path with
  // a hover-dwell value without committing to the open transition yet.
  const [previewing, setPreviewing] = useState(false);

  const slideRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  // Mirror of `tiles` for the rAF loop, which closes over a stale value
  // otherwise. Updated synchronously each render via useLayoutEffect.
  const tilesRef = useRef<Tile[]>(tiles);
  // Mirror of `breathing` so the scheduler interval reads fresh state.
  const breathingRef = useRef<Record<number, BreathOverride>>(breathing);
  // When dwell completes the gallery is already painted behind the folder,
  // so the tidal-reveal effect should not try to hide below-fold tiles —
  // they're already visible to the user through the portal.
  const committedFromPreviewRef = useRef(false);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]); // outer tile wrappers
  const tileInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  /* FLIP buffer — populated just before a shuffle by capturing every
     visible tile's bounding rect, then read by the post-render layout
     effect which inverts the delta and animates back to identity. */
  const prevTileRectsRef = useRef<Map<number, DOMRect>>(new Map());
  /* Separate FLIP buffer for breath-driven layout changes — lives apart
     from the shuffle buffer so the two effects don't stomp each other. */
  const prevBreathRectsRef = useRef<Map<number, DOMRect>>(new Map());

  // Keep tilesRef synchronously up to date so the rAF loop reads fresh
  // tile data without restarting on each shuffle.
  useLayoutEffect(() => {
    tilesRef.current = tiles;
  }, [tiles]);
  useLayoutEffect(() => {
    breathingRef.current = breathing;
  }, [breathing]);

  // Track data-active via MutationObserver so isActive is a real subscription,
  // not a synchronous DOM read during render. Seed from the current attribute
  // so a slide mounted while already active doesn't miss the initial state —
  // the observer only fires on changes.
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(
      `[data-slide-id="${SLIDE_ID}"]`,
    );
    if (!el) return;
    setIsActive(el.dataset.active === "true");
    const obs = new MutationObserver(() => {
      setIsActive(el.dataset.active === "true");
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-active"] });
    return () => obs.disconnect();
  }, []);

  const open = useCallback(() => {
    if (state !== "closed") return;
    setState("opening");
    setImmersive(true);
    // Mount overlay in collapsed state, then flip to open on the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setState("open"));
    });
  }, [state, setImmersive]);

  const close = useCallback(() => {
    if (state !== "open") return;
    setState("closing");
    setImmersive(false);
    window.setTimeout(() => {
      setState("closed");
      committedFromPreviewRef.current = false;
    }, CLOSE_MS);
  }, [state, setImmersive]);

  // Commit straight to "open" from the preview state. Skips the standard
  // "opening" intermediate (which would briefly fade to black via the
  // opacity transition) — the gallery is already painted behind the folder
  // through the portal, we just need to lift the clip-path.
  const commitPortal = useCallback(() => {
    committedFromPreviewRef.current = true;
    setImmersive(true);
    setPreviewing(false);
    setState("open");
  }, [setImmersive]);

  const shuffle = useCallback(() => {
    // FLIP — capture First positions of every mounted tile.
    const captured = new Map<number, DOMRect>();
    tileRefs.current.forEach((el, idx) => {
      if (el) captured.set(idx, el.getBoundingClientRect());
    });
    prevTileRectsRef.current = captured;
    // Clear any in-flight breaths so we don't FLIP from a half-expanded
    // pre-state; the breathing scheduler will repopulate over time.
    setBreathing({});
    setTiles(buildTiles(BUCKETS, { pattern: LAYOUT_EDITORIAL }));
    overlayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* FLIP — runs after the shuffle re-render. Compares each tile's
     current rect to the captured one, sets an inverse transform so the
     tile visually still sits in its old slot, then on the next frame
     animates to identity with a touch-of-bounce ease. Skip when no
     prior rects (initial mount, or if shuffle wasn't the trigger). */
  useLayoutEffect(() => {
    const prevRects = prevTileRectsRef.current;
    if (prevRects.size === 0) return;
    prevTileRectsRef.current = new Map();
    const animated: HTMLDivElement[] = [];
    tileRefs.current.forEach((el, idx) => {
      if (!el) return;
      const oldRect = prevRects.get(idx);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      const sx = oldRect.width / Math.max(1, newRect.width);
      const sy = oldRect.height / Math.max(1, newRect.height);
      if (
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(sx - 1) < 0.01 &&
        Math.abs(sy - 1) < 0.01
      ) {
        return;
      }
      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      animated.push(el);
    });
    if (!animated.length) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animated.forEach((el) => {
          el.style.transition = `transform ${SHUFFLE_FLIP_MS}ms ${SHUFFLE_FLIP_EASE}`;
          el.style.transform = "";
        });
      });
    });
    const cleanup = window.setTimeout(() => {
      animated.forEach((el) => {
        el.style.transition = "";
        el.style.transformOrigin = "";
        el.style.transform = "";
      });
    }, SHUFFLE_FLIP_MS + 80);
    return () => window.clearTimeout(cleanup);
  }, [tiles]);

  /* ── Breath FLIP ──────────────────────────────────────────────────
     A second FLIP effect, keyed on the `breathing` map. The scheduler
     captures rects into prevBreathRectsRef just before flipping a key
     in the map; this effect then reads those rects post-commit and
     animates the deltas. Uses `transitionend` (not setTimeout) for
     cleanup so overlapping pulses self-resolve.

     Size changes animate via inline width/height in pixels (NOT
     transform: scale). With object-fit: cover on the image, the cover
     crop recomputes against the tile's actual dimensions every frame
     — Figma frame-fill behavior, no stretch in between, no snap at
     the end. Position deltas still go through transform: translate. */
  useLayoutEffect(() => {
    const prevRects = prevBreathRectsRef.current;
    if (prevRects.size === 0) return;
    prevBreathRectsRef.current = new Map();
    type Record = { el: HTMLDivElement; newW: number; newH: number; sizeChanged: boolean };
    const animated: Record[] = [];
    tileRefs.current.forEach((el, idx) => {
      if (!el) return;
      const oldRect = prevRects.get(idx);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      const sizeChanged =
        Math.abs(oldRect.width - newRect.width) > 0.5 ||
        Math.abs(oldRect.height - newRect.height) > 0.5;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && !sizeChanged) {
        return;
      }
      el.style.transition = "none";
      if (sizeChanged) {
        // Pin to old pixel dimensions so the grid stretch doesn't
        // immediately snap us to the new layout size. Grid spans have
        // already updated; this inline override decouples visual size
        // from grid track allocation for the duration of the transition.
        el.style.width = `${oldRect.width}px`;
        el.style.height = `${oldRect.height}px`;
      }
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        el.style.transformOrigin = "top left";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      animated.push({
        el,
        newW: newRect.width,
        newH: newRect.height,
        sizeChanged,
      });
    });
    if (!animated.length) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animated.forEach(({ el, newW, newH, sizeChanged }) => {
          const transitions: string[] = [
            `transform ${BREATH_TRANSITION_MS}ms ${BREATH_TRANSITION_EASE}`,
          ];
          if (sizeChanged) {
            transitions.push(
              `width ${BREATH_TRANSITION_MS}ms ${BREATH_TRANSITION_EASE}`,
              `height ${BREATH_TRANSITION_MS}ms ${BREATH_TRANSITION_EASE}`,
            );
          }
          el.style.transition = transitions.join(", ");
          el.style.transform = "";
          if (sizeChanged) {
            el.style.width = `${newW}px`;
            el.style.height = `${newH}px`;
          }
        });
      });
    });
    const handlers = new Map<HTMLDivElement, (e: TransitionEvent) => void>();
    animated.forEach(({ el, sizeChanged }) => {
      // When sizeChanged we'd ideally listen for 'width' end — but
      // transform and width transition durations are identical, and
      // width events don't fire if the value was already at target.
      // Listening for the longest-running prop (transform if present,
      // else width) is robust enough; cleanup is idempotent.
      const watchProp = sizeChanged ? "width" : "transform";
      const handleEnd = (e: TransitionEvent) => {
        if (e.propertyName !== watchProp) return;
        if (e.target !== el) return;
        el.style.transition = "";
        el.style.transformOrigin = "";
        el.style.transform = "";
        // Clear inline width/height so grid stretch resumes ownership.
        // The current rendered size already matches the new grid track,
        // so this is a no-op visually.
        el.style.width = "";
        el.style.height = "";
        el.removeEventListener("transitionend", handleEnd);
        handlers.delete(el);
      };
      handlers.set(el, handleEnd);
      el.addEventListener("transitionend", handleEnd);
    });
    return () => {
      handlers.forEach((h, el) => {
        el.removeEventListener("transitionend", h);
      });
    };
  }, [breathing]);

  /* ── Breathing scheduler ──────────────────────────────────────────
     Runs only while the gallery is open. Each tick (recursive setTimeout
     with jitter) picks one eligible tile and pulses it: capture rects,
     mutate breathing[idx] = aspect, schedule a collapse setTimeout that
     captures rects again and clears the key. Skipped under reduced-
     motion. Paused via `document.visibilitychange` so a backgrounded
     tab doesn't queue a burst when it returns. */
  useEffect(() => {
    if (state !== "open") return;
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const collapseTimers = new Map<number, number>();
    let nextTick = 0;
    let cancelled = false;

    const captureRectsForBreath = () => {
      const captured = new Map<number, DOMRect>();
      tileRefs.current.forEach((el, idx) => {
        if (el) captured.set(idx, el.getBoundingClientRect());
      });
      prevBreathRectsRef.current = captured;
    };

    type Candidate = {
      idx: number;
      effectiveSize: TileSize;
      rect: DOMRect;
    };

    const inViewport = (rect: DOMRect, vp: DOMRect | undefined) => {
      if (!vp) return true;
      const top = vp.top - BREATH_VIEWPORT_PADDING_PX;
      const bottom = vp.bottom + BREATH_VIEWPORT_PADDING_PX;
      return rect.bottom >= top && rect.top <= bottom;
    };

    /* Pick a same-row pair: an "expander" 1x1 grows to 2x1 while a
       "shrinker" 2x1 in the same row contracts to 1x1. Net cell count
       per row stays the same — no tile jumps rows. */
    const pickEligiblePair = (): { expander: number; shrinker: number } | null => {
      const live = tilesRef.current;
      const map = breathingRef.current;
      const activePairs = Object.keys(map).length / 2;
      if (activePairs >= BREATH_MAX_PAIRS) return null;
      const overlay = overlayRef.current;
      const vp = overlay?.getBoundingClientRect();

      const candidates: Candidate[] = [];
      for (let i = 0; i < live.length; i++) {
        const tile = live[i];
        if (tile.kind !== "image") continue;
        if (map[i] !== undefined) continue;
        if (tile.bucket && BREATHING_BUCKET_DENYLIST.has(tile.bucket)) continue;
        const el = tileRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (!inViewport(rect, vp)) continue;
        // Effective size = intrinsic slot size (no overrides since we
        // already filtered map[i] === undefined).
        if (tile.size !== "1x1" && tile.size !== "2x1") continue;
        candidates.push({ idx: i, effectiveSize: tile.size, rect });
      }
      if (candidates.length < 2) return null;

      // Group by row (top within tolerance).
      const rows: Candidate[][] = [];
      for (const c of candidates) {
        const row = rows.find((r) => Math.abs(r[0].rect.top - c.rect.top) < BREATH_ROW_TOLERANCE_PX);
        if (row) row.push(c);
        else rows.push([c]);
      }

      // Keep only rows that have at least one of each kind.
      const eligibleRows = rows.filter(
        (r) =>
          r.some((c) => c.effectiveSize === "1x1") &&
          r.some((c) => c.effectiveSize === "2x1"),
      );
      if (!eligibleRows.length) return null;

      const row = eligibleRows[Math.floor(Math.random() * eligibleRows.length)];
      const expanders = row.filter((c) => c.effectiveSize === "1x1");
      const shrinkers = row.filter((c) => c.effectiveSize === "2x1");
      const expander = expanders[Math.floor(Math.random() * expanders.length)];
      const shrinker = shrinkers[Math.floor(Math.random() * shrinkers.length)];
      return { expander: expander.idx, shrinker: shrinker.idx };
    };

    const tick = () => {
      if (cancelled) return;
      const pair = pickEligiblePair();
      if (pair) {
        captureRectsForBreath();
        setBreathing((prev) => ({
          ...prev,
          [pair.expander]: "2x1",
          [pair.shrinker]: "1x1",
        }));
        const collapse = window.setTimeout(() => {
          if (cancelled) return;
          captureRectsForBreath();
          setBreathing((prev) => {
            const next = { ...prev };
            delete next[pair.expander];
            delete next[pair.shrinker];
            return next;
          });
          collapseTimers.delete(pair.expander);
        }, BREATH_HOLD_MS);
        collapseTimers.set(pair.expander, collapse);
      }
      const jitter = 1 + (Math.random() * 2 - 1) * BREATH_INTERVAL_JITTER;
      nextTick = window.setTimeout(tick, BREATH_INTERVAL_MS * jitter);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (nextTick) window.clearTimeout(nextTick);
        nextTick = 0;
      } else if (!nextTick && !cancelled) {
        nextTick = window.setTimeout(tick, BREATH_INTERVAL_MS);
      }
    };

    nextTick = window.setTimeout(tick, BREATH_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (nextTick) window.clearTimeout(nextTick);
      collapseTimers.forEach((t) => window.clearTimeout(t));
      collapseTimers.clear();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [state]);

  /* SSR uses INITIAL_TILES (seeded, deterministic) so server and first
     client paint match. After hydration we resample the buckets with
     Math.random so the first open already looks fresh. */
  useEffect(() => {
    setTiles(buildTiles(BUCKETS, { pattern: LAYOUT_EDITORIAL }));
  }, []);

  /* ── Hover-dwell portal trigger ─────────────────────────────────────
     Hovering the folder mounts the gallery overlay underneath, masked by
     a circular clip-path centered on the folder. The dwell value (0..1)
     is set as the `--dwell` CSS variable on the slide root and drives:
       • the ring fill around the folder (stroke-dashoffset via calc)
       • aura/folder/label transforms on the trigger
       • the overlay's clip-path circle radius (the portal aperture)
     When dwell completes we commit straight to "open" — the clip-path
     transitions out to fullscreen via CSS, finishing the portal effect.
     Click still opens immediately for keyboard/touch users. */
  useEffect(() => {
    if (state !== "closed" || !isActive) return;

    const trigger = triggerRef.current;
    const slide = slideRef.current;
    if (!trigger || !slide) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let raf = 0;
    let value = 0;
    let holding = false;
    let lastTime = 0;
    let committed = false;

    const apply = (v: number) => {
      slide.style.setProperty("--dwell", easeDwell(v).toFixed(4));
    };

    const tick = () => {
      const now = performance.now();
      // Clamp to ~2 frames so a blocked main thread (React mount, GC pause)
      // can't translate into a visible --dwell jump.
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;

      const rate = holding ? 1 / DWELL_HOLD_MS : -1 / DWELL_RELEASE_MS;
      value = Math.max(0, Math.min(1, value + dt * rate));
      apply(value);

      if (value >= 1 && !committed) {
        committed = true;
        raf = 0;
        commitPortal();
        return;
      }
      if (!holding && value <= 0) {
        raf = 0;
        apply(0);
        setPreviewing(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (raf) return;
      // Defer setting lastTime to the start of the next animation frame.
      // If we set it synchronously in mouseenter, dt on the first tick
      // is contaminated by React's render pass and the browser's first
      // paint of any newly-revealed content — that produces a ~16–32ms
      // jump out of frame 1 instead of a clean ramp from zero.
      raf = requestAnimationFrame(() => {
        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      });
    };
    const onEnter = () => {
      if (committed) return;
      holding = true;
      setPreviewing(true);
      startTick();
    };
    const onLeave = () => {
      holding = false;
      startTick();
    };

    trigger.addEventListener("mouseenter", onEnter);
    trigger.addEventListener("mouseleave", onLeave);
    apply(0);

    return () => {
      cancelAnimationFrame(raf);
      trigger.removeEventListener("mouseenter", onEnter);
      trigger.removeEventListener("mouseleave", onLeave);
      apply(0);
    };
  }, [state, isActive, commitPortal]);

  // Arrow-key paging: while this slide is the active one, intercept arrows
  // before the deck handler so the folder opens, then pages through the
  // gallery, then advances to the next slide at the end. Symmetric upward.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      const activeSlide = document.querySelector<HTMLElement>(
        '.wipu-slide[data-active="true"]',
      );
      if (activeSlide?.dataset.slideId !== SLIDE_ID) return;

      // Block arrow input mid-transition so a held key can't queue weird states.
      if (state === "opening" || state === "closing") {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === " " ||
          e.key === "PageDown" ||
          e.key === "PageUp"
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      const isForward =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey);
      const isBack =
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey);

      if (e.key === "Escape" && state === "open") {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }

      if (isForward) {
        if (state === "closed") return; // let deck advance — folder only opens via click
        const overlay = overlayRef.current;
        if (!overlay) return;
        e.preventDefault();
        e.stopPropagation();
        const atBottom =
          overlay.scrollTop + overlay.clientHeight >=
          overlay.scrollHeight - SCROLL_END_TOLERANCE;
        if (atBottom) {
          bumpNavKey();
          close();
          next();
        } else {
          const step = Math.round(overlay.clientHeight * 0.85);
          overlay.scrollBy({ top: step, behavior: "smooth" });
        }
        return;
      }

      if (isBack) {
        if (state === "closed") return; // let deck handle prev-slide nav
        const overlay = overlayRef.current;
        if (!overlay) return;
        e.preventDefault();
        e.stopPropagation();
        const atTop = overlay.scrollTop <= SCROLL_END_TOLERANCE;
        if (atTop) {
          bumpNavKey();
          close();
          prev();
        } else {
          const step = Math.round(overlay.clientHeight * 0.85);
          overlay.scrollBy({ top: -step, behavior: "smooth" });
        }
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [state, close, next, prev, bumpNavKey]);

  // If the user navigates away from the field-notes slide, auto-close overlay.
  // Edge-triggered: only fires on the active→inactive transition.
  const prevActiveRef = useRef(isActive);
  useEffect(() => {
    const wasActive = prevActiveRef.current;
    prevActiveRef.current = isActive;
    if (!wasActive || isActive) return;
    if (state === "open" || state === "opening") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot transition reset, not a cascading render
      setState("closed");
      setImmersive(false);
      committedFromPreviewRef.current = false;
    }
    // Cancel any in-flight portal preview when the slide loses focus.
    if (previewing) {
      setPreviewing(false);
      slideRef.current?.style.setProperty("--dwell", "0");
    }
  }, [isActive, state, previewing, setImmersive]);

  /* ── Tidal Scroll: IntersectionObserver reveal ──────────────────── */
  useEffect(() => {
    if (state !== "open") return;
    // When committed from the portal preview the gallery was already
    // visible behind the folder — running tidal-reveal would yank below-
    // fold tiles back to opacity 0 ~750ms after commit, causing a flash.
    if (committedFromPreviewRef.current) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Small delay so explosion animation finishes first
    let observer: IntersectionObserver | null = null;
    const revealTimer = window.setTimeout(() => {
      const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!tiles.length) return;

      if (reduce) {
        tiles.forEach((el) => el.setAttribute("data-revealed", "true"));
        return;
      }

      // Split: tiles already in viewport get revealed immediately (no flash),
      // tiles below the fold start hidden and reveal on scroll.
      const belowFold: HTMLDivElement[] = [];
      tiles.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.setAttribute("data-revealed", "true");
        } else {
          el.setAttribute("data-revealed", "false");
          belowFold.push(el);
        }
      });

      if (!belowFold.length) return;

      // Stagger delay based on horizontal position within each batch
      observer = new IntersectionObserver(
        (entries) => {
          const entering = entries.filter(
            (e) => e.isIntersecting && e.target.getAttribute("data-revealed") === "false",
          );
          if (!entering.length) return;

          // Sort left-to-right for stagger
          entering.sort(
            (a, b) =>
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
          entering.forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.setProperty("--reveal-delay", String(i * 60));
            el.setAttribute("data-revealed", "true");
          });
        },
        {
          root: overlayRef.current,
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.15,
        },
      );

      belowFold.forEach((el) => observer!.observe(el));
    }, 750); // wait for explosion to settle

    return () => {
      window.clearTimeout(revealTimer);
      observer?.disconnect();
    };
  }, [state]);

  /* Wheel smoothing for the overlay. Each wheel event accumulates into a
     target scrollTop; an rAF lerp eases scrollTop toward it. Trackpads keep
     feeling native (events fire densely; lerp tracks close to live), and
     mouse wheels gain a touch of weight instead of snapping per notch. */
  useEffect(() => {
    if (state !== "open") return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    let target = overlay.scrollTop;
    let raf = 0;
    let lastWheelAt = 0;
    const QUIET_MS = 240;
    const LERP = 0.22;

    const tick = () => {
      raf = 0;
      const cur = overlay.scrollTop;
      const dist = target - cur;
      if (Math.abs(dist) < 0.5) {
        overlay.scrollTop = target;
        return;
      }
      overlay.scrollTop = cur + dist * LERP;
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheelAt > QUIET_MS) target = overlay.scrollTop;
      lastWheelAt = now;
      const max = Math.max(0, overlay.scrollHeight - overlay.clientHeight);
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    overlay.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      overlay.removeEventListener("wheel", onWheel);
    };
  }, [state]);

  /* Header fade-on-scroll. While scrolled past the top, fade and lift
     the sticky header so it gets out of the way. The CSS entry transition
     still drives the initial fade-in at scrollTop=0 (no inline override). */
  useEffect(() => {
    if (state !== "open") return;
    const overlay = overlayRef.current;
    const header = headerRef.current;
    if (!overlay || !header) return;

    const FADE_DISTANCE = 240;
    const onScroll = () => {
      const progress = Math.min(1, Math.max(0, overlay.scrollTop / FADE_DISTANCE));
      if (progress === 0) {
        header.style.transition = "";
        header.style.opacity = "";
        header.style.transform = "";
      } else {
        header.style.transition = "opacity 140ms linear, transform 140ms linear";
        header.style.opacity = String(1 - progress);
        header.style.transform = `translateY(${(-progress * 8).toFixed(2)}px)`;
      }
    };
    overlay.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      overlay.removeEventListener("scroll", onScroll);
      header.style.transition = "";
      header.style.opacity = "";
      header.style.transform = "";
    };
  }, [state]);

  /* ── Combined rAF loop: parallax + magnetic drift ───────────────── */
  useEffect(() => {
    if (state === "closed") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // ── Mouse tracking (magnetic drift) ──
    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    overlay.addEventListener("mousemove", onMove, { passive: true });
    overlay.addEventListener("mouseleave", onLeave, { passive: true });

    // ── Gyroscope fallback for mobile ──
    const gyro = { x: 0, y: 0, active: false };
    let gyroHandler: ((e: DeviceOrientationEvent) => void) | null = null;
    if ("ontouchstart" in window) {
      gyroHandler = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        // Normalize to -1..1 range (gamma: -90..90, beta: -180..180)
        gyro.x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 30));
        gyro.y = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 45) / 30));
        gyro.active = true;
      };
      window.addEventListener("deviceorientation", gyroHandler, { passive: true });
    }

    // ── Per-tile spring state ──
    // Lazily allocated since tile count varies across shuffles. Index is
    // the tile slot index (matches tilesRef.current).
    const springs: { x: number; y: number; vx: number; vy: number }[] = [];
    const getSpring = (i: number) =>
      springs[i] ?? (springs[i] = { x: 0, y: 0, vx: 0, vy: 0 });

    // ── FPS monitor ──
    let frameTimes: number[] = [];
    let lastFrameTime = performance.now();
    let driftEnabled = true;

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = now - lastFrameTime;
      lastFrameTime = now;

      // FPS sampling — check every N frames
      frameTimes.push(dt);
      if (frameTimes.length >= FPS_SAMPLE_SIZE) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = 1000 / avg;
        if (fps < FPS_THRESHOLD) {
          driftEnabled = false; // disable magnetic drift, keep parallax
        }
        frameTimes = [];
      }

      const vh = window.innerHeight;
      const vpCenter = vh / 2;

      const liveTiles = tilesRef.current;
      for (let i = 0; i < tileInnerRefs.current.length; i++) {
        const el = tileInnerRefs.current[i];
        if (!el) continue;
        const tile = liveTiles[i];
        if (!tile) continue;

        // Cards are excluded from magnetic drift entirely — they sit still.
        if (tile.kind === "card") {
          el.style.transform = "translate3d(0, 0, 0)";
          continue;
        }

        const host = el.parentElement;
        if (!host) continue;
        const rect = host.getBoundingClientRect();

        // Skip tiles fully offscreen
        if (rect.bottom < -100 || rect.top > vh + 100) continue;

        // ── Compute magnetic drift for this image tile ──
        let driftX = 0;
        let driftY = 0;

        if (driftEnabled) {
          const maxDrift = DRIFT_MAX_PX;
          const tileCX = rect.left + rect.width / 2;
          const tileCY = rect.top + rect.height / 2;

          let targetX = 0;
          let targetY = 0;

          if (mouse.active) {
            const dx = mouse.x - tileCX;
            const dy = mouse.y - tileCY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < DRIFT_RADIUS) {
              const influence = 1 - dist / DRIFT_RADIUS;
              const pull = influence * influence; // quadratic falloff
              targetX = (dx / (dist || 1)) * maxDrift * pull;
              targetY = (dy / (dist || 1)) * maxDrift * pull;
            }
          } else if (gyro.active) {
            targetX = gyro.x * maxDrift;
            targetY = gyro.y * maxDrift;
          }

          // Spring physics
          const spring = getSpring(i);
          const ax = (targetX - spring.x) * SPRING_STIFFNESS;
          const ay = (targetY - spring.y) * SPRING_STIFFNESS;
          spring.vx = (spring.vx + ax) * SPRING_DAMPING;
          spring.vy = (spring.vy + ay) * SPRING_DAMPING;
          spring.x += spring.vx;
          spring.y += spring.vy;

          // Snap to zero if negligible (avoid sub-pixel jitter)
          if (Math.abs(spring.x) < 0.01 && Math.abs(spring.vx) < 0.01) {
            spring.x = 0;
            spring.vx = 0;
          }
          if (Math.abs(spring.y) < 0.01 && Math.abs(spring.vy) < 0.01) {
            spring.y = 0;
            spring.vy = 0;
          }

          driftX = spring.x;
          driftY = spring.y;
        }

        // ── Image tiles: parallax + drift ──
        if (tile.rate === 0 && driftX === 0 && driftY === 0) {
          el.style.transform = "translate3d(0, 0, 0)";
          continue;
        }

        // Parallax + drift
        let parallaxY = 0;
        if (tile.rate !== 0) {
          const delta = rect.top + rect.height / 2 - vpCenter;
          const raw = delta * tile.rate;
          const max = rect.height * 0.08;
          parallaxY = Math.max(-max, Math.min(max, raw));
        }
        el.style.transform = `translate3d(${driftX.toFixed(2)}px, ${(parallaxY + driftY).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      overlay.removeEventListener("mousemove", onMove);
      overlay.removeEventListener("mouseleave", onLeave);
      if (gyroHandler) {
        window.removeEventListener("deviceorientation", gyroHandler);
      }
    };
  }, [state]);

  // Overlay is mounted whenever the slide is active OR open OR being
  // previewed. Pre-mounting on isActive means the first hover doesn't
  // pay the 50+ tile mount cost — the paint happens during the deck's
  // slide-entry transition instead, where it's hidden. data-state
  // distinguishes the visual modes (clip-path mask, opacity, transitions).
  const overlayMounted = state !== "closed" || previewing || isActive;
  const overlayDataState = state === "closed" && previewing ? "previewing" : state;

  return (
    <div ref={slideRef} className="field-notes-slide" data-state={state}>
      {/* Intro — portal entry point. Hover dwell fills the ring while a
          circular aperture opens behind the folder, revealing the gallery.
          Once the ring fills, the aperture expands to fullscreen and the
          gallery is open. Click opens immediately (keyboard/touch). */}
      <div className="field-notes-intro" aria-hidden={state !== "closed"}>
        <button
          ref={triggerRef}
          type="button"
          className="field-notes-portal-trigger"
          onClick={open}
          aria-label="Open field notes"
          disabled={state !== "closed"}
        >
          <span className="field-notes-portal-disc">
            <span className="field-notes-portal-aura" aria-hidden />
            <svg
              className="field-notes-portal-ring"
              viewBox="0 0 100 100"
              aria-hidden
              focusable="false"
            >
              <circle
                className="field-notes-portal-ring-track"
                cx="50"
                cy="50"
                r={RING_RADIUS}
              />
              <circle
                className="field-notes-portal-ring-fill"
                cx="50"
                cy="50"
                r={RING_RADIUS}
                style={{ strokeDasharray: RING_CIRCUMFERENCE }}
              />
            </svg>
            <span className="field-notes-portal-icon" aria-hidden>
              📁
            </span>
          </span>
          <span className="field-notes-portal-lbl">Archive.final_FINAL_V2</span>
        </button>
      </div>

      {/* Exploded overlay — also serves as the portal preview when
          `previewing`. data-state="previewing" applies the circular
          clip-path mask centered on the folder. */}
      {overlayMounted && (
        <div
          ref={overlayRef}
          className="field-notes-overlay"
          data-state={overlayDataState}
          data-allow-scroll="true"
          role="dialog"
          aria-label="Field notes — image gallery"
          aria-modal="true"
        >
          <header ref={headerRef} className="field-notes-header" aria-hidden={state !== "open"}>
            <h1 className="field-notes-header-title">
              {fieldNotes.header.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="field-notes-header-sub">
              {fieldNotes.header.subtitle}
            </p>
          </header>
          <div className="field-notes-grid">
            {tiles.map((tile, slotIdx) => (
              <TileCard
                key={slotIdx}
                tile={tile}
                index={slotIdx}
                breathing={breathing[slotIdx]}
                tileRef={(el) => {
                  tileRefs.current[slotIdx] = el;
                }}
                innerRef={(el) => {
                  tileInnerRefs.current[slotIdx] = el;
                }}
              />
            ))}
          </div>
          <div
            className="field-notes-dock"
            aria-hidden={state !== "open"}
          >
            <button
              type="button"
              className="field-notes-dock-btn"
              onClick={shuffle}
              aria-label="Shuffle gallery"
            >
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M16 3h5v5" />
                <path d="M4 20 21 3" />
                <path d="M21 16v5h-5" />
                <path d="m15 15 6 6" />
                <path d="m4 4 5 5" />
              </svg>
            </button>
            <button
              type="button"
              className="field-notes-dock-btn"
              onClick={close}
              aria-label="Exit gallery"
            >
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TileCard({
  tile,
  index,
  breathing,
  tileRef,
  innerRef,
}: {
  tile: Tile;
  index: number;
  breathing: BreathOverride | undefined;
  tileRef: (el: HTMLDivElement | null) => void;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const sizeClass = `field-notes-tile-${tile.size}`;
  /* Gel-loading state — image/video starts hidden behind a purple noise
     shroud (the case-study Gel pattern, scoped to per-tile). When media
     finishes loading we flip data-loaded; CSS fades the shroud out and
     the media in. Combined with lazy loading the result cascades down
     the page as the user scrolls. */
  const [loaded, setLoaded] = useState(false);
  if (tile.kind === "image") {
    const innerStyle: React.CSSProperties = { ["--i" as string]: index } as React.CSSProperties;
    const isVideo = /\.(mp4|mov|webm)$/i.test(tile.src);
    const mediaStyle: React.CSSProperties | undefined = tile.objectPosition
      ? { objectPosition: tile.objectPosition }
      : undefined;
    const onVideoMeta = (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget;
      if (v.videoWidth > 0 && v.videoHeight > 0) {
        registerAspect(tile.src, v.videoWidth, v.videoHeight);
      }
    };
    return (
      <div
        ref={tileRef}
        className={`field-notes-tile field-notes-tile-image ${sizeClass}`}
        style={innerStyle}
        data-bucket={tile.bucket}
        data-breathing={breathing}
        data-loaded={loaded ? "true" : "false"}
      >
        <div ref={innerRef} className="field-notes-tile-inner">
          <div className="field-notes-tile-gel" aria-hidden />
          {isVideo ? (
            <video
              src={tile.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              draggable={false}
              style={mediaStyle}
              onLoadedMetadata={onVideoMeta}
              onLoadedData={() => setLoaded(true)}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tile.src}
              alt={tile.alt}
              loading="lazy"
              draggable={false}
              style={mediaStyle}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>
    );
  }
  return (
    <div
      ref={tileRef}
      className={`field-notes-tile field-notes-tile-card field-notes-tone-${tile.tone} ${sizeClass}`}
      style={{ ["--i" as string]: index }}
    >
      <div ref={innerRef} className="field-notes-tile-inner">
        <div className="field-notes-card-title">{tile.title}</div>
        <p className="field-notes-card-body">{tile.body}</p>
      </div>
    </div>
  );
}
