"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import type { Prototype } from "@/lib/prototypes";
import { ControlsPanel } from "./ControlsPanel";
import { GeminiPhone, type Platform } from "./GeminiPhone";
import {
  ALTER_KEYWORD,
  FILES,
  FOCUS_POINT,
  IMG_EDIT_STATES,
  IMG_EDIT_SINGLE_SWAPPED,
  VARIANTS,
  imageFor,
  type ImgEditChip,
  type ImgEditFocus,
} from "./imageEditingData";
import {
  DUR_DOLLY,
  DUR_FAST,
  REGEN_MS,
  SPRING_SOFT,
  dissolve,
  dolly,
  morph,
  newReveal,
  noiseFade,
  oldHold,
  popover,
} from "./imageEditMotion";

const ORIGIN = `${FOCUS_POINT.x * 100}% ${FOCUS_POINT.y * 100}%`;

// Fetch + decode an image off the interaction path so it's warm in cache by
// the time a focus change paints it. Used during the regenerate dwell to warm
// the full-frame altered image, which otherwise first loads (3MB) on the
// zoom-out click and stalls that transition for a couple seconds.
function warmImage(src: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = src;
  void img.decode?.().catch(() => {});
}

// The three non-selectable tiles, with the edge each clears toward when the
// canvas "parts" to let the selected tile grow into the card.
const SATELLITE_EXIT: Record<string, { x: string; y: string }> = {
  A: { x: "-42%", y: "-55%" },
  C: { x: "-42%", y: "55%" },
  D: { x: "42%", y: "55%" },
};
const SATELLITES = VARIANTS.filter((v) => !v.selectable);

// Bounding box that frames the car in the full single view, as percentages of
// the media card. Tweak these to re-fit the box if the crop changes.
const SWAP_BOX = { left: 10, top: 51, width: 56, height: 33 } as const;
// The "working" region during a swap — a big frosted-blur patch over the
// subject while the new image renders, rather than frosting the whole frame.
const SWAP_BLUR_BOX = { left: -14, top: 28, width: 104, height: 84 } as const;
// Beat between landing on the full lava image and the swap affordance arriving,
// so it reads as the model *noticing* the car rather than chrome popping in.
const SWAP_DELAY_MS = 1100;

// idle → prompt (affordance shown) → swapping (dwell) → swapped (result in).
type SwapStage = "idle" | "prompt" | "swapping" | "swapped";

export function ImageEditingView({
  prototype,
  embed = false,
}: {
  prototype: Prototype;
  embed?: boolean;
}) {
  const reduce = useReducedMotion();
  const [platform, setPlatform] = useState<Platform>("ios");
  const [focus, setFocus] = useState<ImgEditFocus>("grid");
  const [altered, setAltered] = useState(false);

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [openChipId, setOpenChipId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const regenTimer = useRef<number | null>(null);

  // The "Swap car" affordance — offered only on the full single view once the
  // lava variant has landed. Arrives after a beat, then a tap swaps the car.
  const [swapStage, setSwapStage] = useState<SwapStage>("idle");
  const swapTimer = useRef<number | null>(null);

  // Mobile presentation mirrors the other prototypes: the phone fills the
  // viewport and the Peter Labs chip toggles a fullscreen controls overlay.
  const [isMobile, setIsMobile] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 720px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const openControls = useCallback(() => setControlsOpen(true), []);
  const closeControls = useCallback(() => setControlsOpen(false), []);

  useEffect(
    () => () => {
      if (regenTimer.current !== null) window.clearTimeout(regenTimer.current);
      if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    },
    [],
  );

  // Offer the swap affordance a beat after the full lava image settles. Leaving
  // the single view retracts an un-taken prompt; a completed swap persists.
  useEffect(() => {
    const eligible = focus === "single" && altered && !regenerating;
    if (!eligible) {
      setSwapStage((s) => (s === "prompt" ? "idle" : s));
      return;
    }
    if (swapStage !== "idle") return;
    swapTimer.current = window.setTimeout(() => {
      warmImage(FILES.singleSwapped); // warm the result so the tap reveal is instant
      setSwapStage("prompt");
      swapTimer.current = null;
    }, SWAP_DELAY_MS);
    return () => {
      if (swapTimer.current !== null) {
        window.clearTimeout(swapTimer.current);
        swapTimer.current = null;
      }
    };
  }, [focus, altered, regenerating, swapStage]);

  // Tapping "Swap car" runs the same generative dwell as a lava edit, then
  // reveals the new image. The frosted blur is localized (see SWAP_BLUR_BOX).
  const doSwap = useCallback(() => {
    setSwapStage("swapping");
    if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      setSwapStage("swapped");
      swapTimer.current = null;
    }, REGEN_MS);
  }, []);

  // Once the car has been swapped out for the fish, the single view describes
  // what's actually on the road now instead of the original car prompt.
  const state =
    focus === "single" && swapStage === "swapped"
      ? IMG_EDIT_SINGLE_SWAPPED
      : IMG_EDIT_STATES[focus];
  const isGrid = focus === "grid";

  const labelFor = (chip: ImgEditChip) => {
    if (chip.id in edits) return edits[chip.id];
    if (altered && chip.alteredLabel) return chip.alteredLabel;
    return chip.label;
  };

  const selectVariant = () => {
    setOpenChipId(null);
    setFocus("single");
  };
  const zoomIntoRegion = () => {
    setOpenChipId(null);
    setFocus("region");
  };
  const back = () => {
    setOpenChipId(null);
    setFocus((f) => (f === "region" ? "single" : "grid"));
  };

  const pick = (id: string, alt: string) => {
    setEdits((e) => ({ ...e, [id]: alt }));
    setDirty(true);
    setOpenChipId(null);
  };

  const submit = () => {
    if (regenerating) return;
    setOpenChipId(null);
    setRegenerating(true);
    const goesLava = Object.values(edits).some((v) => v.includes(ALTER_KEYWORD));
    // Warm the altered frames during the dwell. The region-altered already
    // paints under the regenerate, but the full-frame single-altered isn't
    // shown until the user zooms back out — preloading it here keeps that
    // transition instant instead of fetching/decoding 3MB on the click.
    if (goesLava) {
      warmImage(FILES.singleAltered);
      warmImage(FILES.regionAltered);
    }
    regenTimer.current = window.setTimeout(() => {
      setAltered(goesLava);
      setRegenerating(false);
      setDirty(false);
      regenTimer.current = null;
    }, REGEN_MS);
  };

  // Jump straight to a focus level from the sidebar flow — the canvas is
  // driven entirely off `focus`, so a direct set re-lays-out cleanly.
  const jumpTo = (next: ImgEditFocus) => {
    setOpenChipId(null);
    setFocus(next);
  };

  const reset = () => {
    if (regenTimer.current !== null) {
      window.clearTimeout(regenTimer.current);
      regenTimer.current = null;
    }
    if (swapTimer.current !== null) {
      window.clearTimeout(swapTimer.current);
      swapTimer.current = null;
    }
    setSwapStage("idle");
    setOpenChipId(null);
    setEdits({});
    setAltered(false);
    setDirty(false);
    setRegenerating(false);
    setFocus("grid");
  };

  return (
    <main className="proto-stage" data-embed={embed ? "true" : undefined}>
      <div className="proto-phone-toggles">
        <div className="proto-platform-toggle" role="tablist" aria-label="Platform">
          <button
            type="button"
            role="tab"
            aria-selected={platform === "ios"}
            className="proto-platform-chip"
            data-active={platform === "ios"}
            onClick={() => setPlatform("ios")}
          >
            iOS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={platform === "android"}
            className="proto-platform-chip"
            data-active={platform === "android"}
            onClick={() => setPlatform("android")}
          >
            Android
          </button>
        </div>
      </div>

      <ControlsPanel
        prototype={prototype}
        activeScenarioId=""
        onScenarioChange={() => {}}
        status="idle"
        onPlay={() => {}}
        onPause={() => {}}
        onRestart={reset}
        mobileOpen={controlsOpen}
        onMobileClose={closeControls}
        hideScenario
        hidePlayback
      >
        <FlowSection focus={focus} onJump={jumpTo} />
        <div className="proto-panel-section">
          <span className="proto-panel-kicker">Image</span>
          <div className="proto-transport">
            <button
              type="button"
              className="proto-transport-btn"
              onClick={reset}
              disabled={focus === "grid" && !dirty && !altered && !regenerating}
            >
              Reset
            </button>
          </div>
        </div>
      </ControlsPanel>

      <section className="proto-phone-stage proto-gemini" data-theme="light">
        <div className="proto-phone-column">
          <GeminiPhone
            platform={platform}
            headerless={!isMobile}
            onLabelClick={isMobile ? openControls : undefined}
          >
            <div className="imgedit-stack">
              <div className="imgedit-canvas" data-focus={focus}>
                <LayoutGroup>
                  {/* Satellite tiles — only in grid; they part to the edges. */}
                  <AnimatePresence>
                    {isGrid
                      ? SATELLITES.map((v) => (
                          <motion.div
                            key={v.id}
                            className="imgedit-tile"
                            data-cell={v.id}
                            style={{ backgroundImage: `url("${v.src}")` }}
                            role="img"
                            aria-label={v.alt}
                            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            exit={
                              reduce
                                ? { opacity: 0 }
                                : {
                                    opacity: 0,
                                    scale: 0.86,
                                    x: SATELLITE_EXIT[v.id]?.x ?? 0,
                                    y: SATELLITE_EXIT[v.id]?.y ?? 0,
                                  }
                            }
                            transition={reduce ? dissolve : SPRING_SOFT}
                          />
                        ))
                      : null}
                  </AnimatePresence>

                  {/* The morphing surface — one persistent element whose box
                      animates from the B tile to the full media card. */}
                  <motion.div
                    className={
                      isGrid
                        ? "imgedit-tile imgedit-surface"
                        : "imgedit-media-card imgedit-surface"
                    }
                    data-cell={isGrid ? "B" : undefined}
                    layout={reduce ? false : true}
                    style={{
                      borderRadius: isGrid
                        ? "calc(30 * var(--u))"
                        : "calc(42 * var(--u))",
                    }}
                    transition={reduce ? dissolve : morph}
                    onClick={isGrid ? selectVariant : undefined}
                    role={isGrid ? "button" : undefined}
                    aria-label={isGrid ? "Refine this image" : undefined}
                  >
                    <div
                      className="imgedit-surface-fill"
                      style={{ backgroundImage: `url("${FILES.singleBase}")` }}
                    />
                    {isGrid ? (
                      <span className="imgedit-tile-pulse" aria-hidden>
                        <span className="imgedit-pulse-ring" />
                        <span className="imgedit-pulse-dot" />
                      </span>
                    ) : (
                      <CanvasMedia
                        focus={focus}
                        altered={altered}
                        regenerating={regenerating}
                        reduce={!!reduce}
                        swapStage={swapStage}
                        onSwap={doSwap}
                        onZoomIn={zoomIntoRegion}
                        onBack={back}
                      />
                    )}
                  </motion.div>
                </LayoutGroup>
              </div>

              <div className="imgedit-promptbar">
                <div className="imgedit-prompt">
                  <LayoutGroup>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {state.prompt.map((tok, i) =>
                        tok.kind === "text" ? (
                          <motion.span
                            key={`${focus}:t:${i}`}
                            className="imgedit-word"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={dissolve}
                          >
                            {tok.text}
                          </motion.span>
                        ) : (
                          <EditableChip
                            key={tok.chip.morphKey ?? tok.chip.id}
                            layoutId={reduce ? undefined : tok.chip.morphKey}
                            chip={tok.chip}
                            label={labelFor(tok.chip)}
                            edited={dirty && tok.chip.id in edits}
                            open={openChipId === tok.chip.id}
                            reduce={!!reduce}
                            onToggle={() =>
                              setOpenChipId((o) =>
                                o === tok.chip.id ? null : tok.chip.id,
                              )
                            }
                            onPick={(alt) => pick(tok.chip.id, alt)}
                          />
                        ),
                      )}
                    </AnimatePresence>
                  </LayoutGroup>
                </div>
              </div>

              <div className="imgedit-inputbar">
                <span className="imgedit-inputbar-text">Ask anything</span>
                <motion.button
                  type="button"
                  className="imgedit-inputbar-mic"
                  aria-label="Voice input"
                  layout={reduce ? false : true}
                  transition={reduce ? undefined : SPRING_SOFT}
                >
                  <span
                    className="proto-icon"
                    style={{ fontSize: "calc(22 * var(--u, 1px))" }}
                    aria-hidden
                  >
                    mic
                  </span>
                </motion.button>
                {/* Send swoops in to the right of the mic once a word is edited. */}
                <AnimatePresence>
                  {dirty && !regenerating ? (
                    <motion.button
                      key="send"
                      type="button"
                      className="imgedit-inputbar-send"
                      aria-label="Send"
                      layout={reduce ? false : true}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 22, scale: 0.7 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, x: 22, scale: 0.7 }}
                      transition={reduce ? dissolve : SPRING_SOFT}
                      whileTap={reduce ? undefined : { scale: 0.92 }}
                      onClick={submit}
                    >
                      <span
                        className="proto-icon"
                        style={{ fontSize: "calc(22 * var(--u, 1px))" }}
                        aria-hidden
                      >
                        arrow_upward
                      </span>
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </GeminiPhone>
        </div>
      </section>
    </main>
  );
}

// Sidebar flow mirroring the canvas focus — tap to jump between the variant
// grid, the single refined image, and the zoomed-in region.
const FLOW: { id: ImgEditFocus; label: string }[] = [
  { id: "grid", label: "Variants" },
  { id: "single", label: "Refine" },
  { id: "region", label: "Close-up" },
];

function FlowSection({
  focus,
  onJump,
}: {
  focus: ImgEditFocus;
  onJump: (next: ImgEditFocus) => void;
}) {
  const currentIdx = FLOW.findIndex((p) => p.id === focus);

  return (
    <div className="proto-panel-section">
      <span className="proto-panel-kicker">View</span>
      <div className="proto-flow">
        {FLOW.map((phase, i) => {
          const state =
            i < currentIdx ? "done" : i === currentIdx ? "active" : "upcoming";
          return (
            <button
              key={phase.id}
              type="button"
              className="proto-flow-item"
              data-state={state}
              onClick={() => onJump(phase.id)}
            >
              <span className="proto-flow-dot" aria-hidden />
              <span className="proto-flow-label">{phase.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CanvasMedia({
  focus,
  altered,
  regenerating,
  reduce,
  swapStage,
  onSwap,
  onZoomIn,
  onBack,
}: {
  focus: ImgEditFocus;
  altered: boolean;
  regenerating: boolean;
  reduce: boolean;
  swapStage: SwapStage;
  onSwap: () => void;
  onZoomIn: () => void;
  onBack: () => void;
}) {
  return (
    <>
      {/* Base image layer — keyed on focus only, so zooming dollies but the
          lava commit (altered) swaps underneath the denoise layer with no
          re-zoom. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={focus}
          className="imgedit-media-layer"
          style={{
            backgroundImage: `url("${imageFor(focus, altered)}")`,
            transformOrigin: ORIGIN,
          }}
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, scale: focus === "region" ? 1.28 : 1.12 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={
            reduce ? { opacity: 0 } : { opacity: 0, scale: focus === "single" ? 1.9 : 1 }
          }
          transition={reduce ? dissolve : dolly}
        />
      </AnimatePresence>

      {/* Swapped result — once the swap dwell completes, the new full-frame
          image sharpens in (blur → crisp) over the base layer and stays. */}
      <AnimatePresence>
        {swapStage === "swapped" ? (
          <motion.div
            key="swapped"
            className="imgedit-media-layer imgedit-swap-result"
            style={{
              backgroundImage: `url("${FILES.singleSwapped}")`,
              transformOrigin: ORIGIN,
            }}
            initial={
              reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(22px)" }
            }
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={
              reduce ? dissolve : { duration: 1.3, ease: [0.33, 0, 0.2, 1] }
            }
          />
        ) : null}
      </AnimatePresence>

      {/* Frosted regenerate. The new image doesn't exist yet, so the OLD image
          holds blurred under crawling noise for most of the dwell; only in the
          final ~2s does the new (orange) image fade in — still blurry — and
          then denoise sharp. */}
      <AnimatePresence>
        {/* Old image, blurred — what you're generating *from*. */}
        {regenerating && !reduce ? (
          <motion.div
            key="render-old"
            className="imgedit-render-layer"
            style={{
              backgroundImage: `url("${imageFor(focus, altered)}")`,
              transformOrigin: ORIGIN,
              filter: "blur(30px) saturate(0.92)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            // Quick exit — otherwise the layer inherits the 6.5s dwell and the
            // old image lingers (and oscillates) over the result after regen.
            exit={{ opacity: 0, transition: dissolve }}
            transition={oldHold}
          />
        ) : null}
        {/* New image fades in late, still blurry, then resolves sharp. */}
        {regenerating && !reduce ? (
          <motion.div
            key="render-new"
            className="imgedit-render-layer"
            style={{
              backgroundImage: `url("${imageFor(focus, true)}")`,
              transformOrigin: ORIGIN,
            }}
            initial={{ opacity: 0, filter: "blur(30px) saturate(0.92)", scale: 1.06 }}
            animate={{
              opacity: [0, 0, 1, 1],
              filter: [
                "blur(30px) saturate(0.92)",
                "blur(30px) saturate(0.92)",
                "blur(16px) saturate(0.97)",
                "blur(0px) saturate(1)",
              ],
              scale: [1.06, 1.06, 1.03, 1],
            }}
            exit={{ opacity: 0, transition: dissolve }}
            transition={newReveal}
          />
        ) : null}
        {/* Reduced motion — straight, quick crossfade to the sharp result. */}
        {regenerating && reduce ? (
          <motion.div
            key="render-reduced"
            className="imgedit-render-layer"
            style={{
              backgroundImage: `url("${imageFor(focus, true)}")`,
              transformOrigin: ORIGIN,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={dissolve}
          />
        ) : null}
      </AnimatePresence>

      {/* Crawling frosted-glass noise — a separate sibling so the layer's own
          blur doesn't eat the grain. Slow, organic boil; clears before the
          sharp image lands. Skipped under reduced motion. */}
      <AnimatePresence>
        {regenerating && !reduce ? (
          <motion.span
            key="render-noise"
            className="imgedit-render-noise"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.65, 0.65, 0] }}
            exit={{ opacity: 0, transition: dissolve }}
            transition={noiseFade}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {regenerating ? (
          <motion.div
            key="regen-label"
            className="imgedit-regen-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={dissolve}
          >
            <span
              className="proto-icon"
              style={{ fontSize: "calc(14 * var(--u, 1px))" }}
              aria-hidden
            >
              auto_awesome
            </span>
            Regenerating…
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Hotspot — scales in after the dolly settles; expands to fill on tap.
          Yields to the swap affordance once that takes over the single view. */}
      <AnimatePresence>
        {focus === "single" && !regenerating && swapStage === "idle" ? (
          <motion.button
            key="hotspot"
            type="button"
            className="imgedit-hotspot"
            style={{ left: `${FOCUS_POINT.x * 100}%`, top: `${FOCUS_POINT.y * 100}%` }}
            aria-label="Zoom into the waterfall"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 6 }}
            transition={
              reduce
                ? dissolve
                : { ...SPRING_SOFT, delay: DUR_DOLLY * 0.7 }
            }
            onClick={onZoomIn}
          >
            <span className="imgedit-hotspot-ring" aria-hidden />
            <span className="imgedit-hotspot-label">Zoom in</span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Localized generative blur — while the swap "renders", a big frosted
          patch boils over the subject (not the whole frame), same dwell as a
          lava edit. The base image stays sharp everywhere else. */}
      <AnimatePresence>
        {swapStage === "swapping" ? (
          <motion.div
            key="swap-render"
            className="imgedit-swap-render"
            style={{
              left: `${SWAP_BLUR_BOX.left}%`,
              top: `${SWAP_BLUR_BOX.top}%`,
              width: `${SWAP_BLUR_BOX.width}%`,
              height: `${SWAP_BLUR_BOX.height}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // Long fade out so it cross-dissolves with the result rather than
            // popping when the swap completes.
            exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="imgedit-swap-render-frost" />
            <div className="imgedit-swap-render-bloom" aria-hidden />
            {!reduce ? (
              <motion.span
                className="imgedit-render-noise"
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Swapping label — mirrors the lava "Regenerating…" pill. */}
      <AnimatePresence>
        {swapStage === "swapping" ? (
          <motion.div
            key="swap-label"
            className="imgedit-regen-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={dissolve}
          >
            <span
              className="proto-icon"
              style={{ fontSize: "calc(14 * var(--u, 1px))" }}
              aria-hidden
            >
              auto_awesome
            </span>
            Swapping…
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Swap-object affordance — a glowing box framing the car with a pill
          above it, offered only on the full lava image. Tapping swaps the car. */}
      <AnimatePresence>
        {swapStage === "prompt" ? (
          <motion.div
            key="swap-prompt"
            className="imgedit-swap"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={reduce ? dissolve : SPRING_SOFT}
          >
            <span
              className="imgedit-swap-box"
              aria-hidden
              style={{
                left: `${SWAP_BOX.left}%`,
                top: `${SWAP_BOX.top}%`,
                width: `${SWAP_BOX.width}%`,
                height: `${SWAP_BOX.height}%`,
              }}
            />
            <button
              type="button"
              className="imgedit-swap-pill"
              onClick={onSwap}
              style={{
                left: `${SWAP_BOX.left + SWAP_BOX.width / 2}%`,
                top: `${SWAP_BOX.top}%`,
              }}
            >
              <span className="proto-icon" aria-hidden>
                add_photo_alternate
              </span>
              Swap car
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Back / zoom-out — persistent across single↔region; icon crossfades. */}
      <button
        type="button"
        className="imgedit-back"
        aria-label={focus === "region" ? "Zoom out" : "Back to variants"}
        onClick={onBack}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={focus === "region" ? "out" : "back"}
            className="proto-icon"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR_FAST }}
          >
            {focus === "region" ? "zoom_out_map" : "arrow_back"}
          </motion.span>
        </AnimatePresence>
      </button>
    </>
  );
}

function EditableChip({
  chip,
  label,
  edited,
  open,
  reduce,
  layoutId,
  onToggle,
  onPick,
}: {
  chip: ImgEditChip;
  label: string;
  edited: boolean;
  open: boolean;
  reduce: boolean;
  layoutId?: string;
  onToggle: () => void;
  onPick: (alt: string) => void;
}) {
  // Order the picker so the current word sits dead-center, with alternatives
  // split above and below it — it reads as the word staying put while options
  // fan out from it.
  const half = Math.floor(chip.alternatives.length / 2);
  const options = [
    ...chip.alternatives.slice(0, half).map((alt) => ({ value: alt, current: false })),
    { value: label, current: true },
    ...chip.alternatives.slice(half).map((alt) => ({ value: alt, current: false })),
  ];

  return (
    <motion.span
      className="imgedit-chip-wrap"
      layout={reduce ? false : true}
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduce ? dissolve : { ...morph, opacity: dissolve }}
    >
      <motion.button
        type="button"
        className="imgedit-chip"
        layout={reduce ? false : true}
        transition={reduce ? undefined : morph}
        data-open={open ? "true" : undefined}
        data-edited={edited ? "true" : undefined}
        onClick={onToggle}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={label}
            className="imgedit-chip-label"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.22, ease: dissolve.ease }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="imgedit-chip-pop"
            initial={
              reduce
                ? { opacity: 0, x: "-50%", y: "-50%" }
                : { opacity: 0, x: "-50%", y: "-50%", scaleY: 0.7 }
            }
            animate={
              reduce
                ? { opacity: 1, x: "-50%", y: "-50%" }
                : { opacity: 1, x: "-50%", y: "-50%", scaleY: 1 }
            }
            exit={
              reduce
                ? { opacity: 0, x: "-50%", y: "-50%" }
                : { opacity: 0, x: "-50%", y: "-50%", scaleY: 0.7 }
            }
            transition={reduce ? dissolve : popover}
          >
            <div className="imgedit-chip-pop-scroll">
              {options.map((opt) =>
                opt.current ? (
                  <button
                    key="__current"
                    type="button"
                    className="imgedit-chip-opt"
                    data-current="true"
                    onClick={onToggle}
                  >
                    {opt.value}
                  </button>
                ) : (
                  <button
                    key={opt.value}
                    type="button"
                    className="imgedit-chip-opt"
                    onClick={() => onPick(opt.value)}
                  >
                    {opt.value}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.span>
  );
}
