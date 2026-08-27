"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTerminal } from "../TerminalContext";
import { beatLayout } from "../beat-machine";
import { SHELL_SPRING } from "../motion";
import { Beat } from "./Beat";
import { Stage } from "./Stage";

const PAD = 22; // breathing room above an anchored command (~scroll-padding-top)

/** The transcript shell: a continuous text COLUMN (the spine of the case study,
 *  which never resets within a track) beside a sticky media STAGE.
 *
 *  Scroll model (unchanged): reaching a new top-level command ANCHORS its
 *  prompt to the top; the beat's output animates down into the canvas; only a
 *  beat taller than the screen FOLLOWS its newest line. The stage holds beside
 *  the column — the image stays put while the text scrolls past it. */
export function HomeView() {
  const { beats, state, dispatch, gallerySlide } = useTerminal();
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : SHELL_SPRING;
  const columnRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);
  const prevIndexRef = useRef(-1);

  // The column is continuous within a TRACK: it spans from the first beat of
  // the active beat's track to the active beat. Only crossing into a new track
  // (home → a case study, or between case studies) resets the column — the one
  // remaining hard cut, marking a genuine new context. Intra-track dividers no
  // longer wipe; their command just anchors to the top, scrolling prior text
  // out of view for a clean breather while the spine stays mounted.
  const sectionStart = useMemo(() => {
    const track = beats[state.index].track;
    let start = state.index;
    while (start > 0 && beats[start - 1].track === track) start--;
    return start;
  }, [beats, state.index]);

  const activeBeat = beats[state.index];
  const layout = beatLayout(activeBeat);
  // The stage is open for a framed image (always, while the beat is active) or
  // for a carousel only once its slideshow is running.
  const stageOpen =
    layout === "sxs-image" ||
    (layout === "sxs-carousel" && gallerySlide !== null);

  const reposition = (behavior: ScrollBehavior) => {
    const beatEl = activeRef.current;
    const scroller = columnRef.current?.closest<HTMLElement>(".term-body");
    if (!beatEl || !scroller) return;
    const beatRect = beatEl.getBoundingClientRect();
    const scRect = scroller.getBoundingClientRect();
    const beatTop = beatRect.top - scRect.top + scroller.scrollTop;
    const viewport = scroller.clientHeight;
    const top =
      beatRect.height <= viewport - PAD
        ? beatTop - PAD // fits → anchor command to top
        : beatTop + beatRect.height - viewport + PAD; // overflows → follow newest
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  };

  // Anchor (smooth) on beat change; reposition on each phase change.
  useEffect(() => {
    animatingRef.current = state.phase !== "done";
    const entering = state.index !== prevIndexRef.current;
    prevIndexRef.current = state.index;
    requestAnimationFrame(() => reposition(entering ? "smooth" : "auto"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, state.phase, gallerySlide]);

  // Track the streaming output as it grows (instant, so it tracks the cursor).
  useEffect(() => {
    const el = columnRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (animatingRef.current) reposition("auto");
    });
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="term-shell" data-stage-open={stageOpen} data-layout={layout}>
      <motion.div
        className="term-column"
        ref={columnRef}
        animate={{ flexBasis: stageOpen ? "52%" : "100%" }}
        transition={transition}
        suppressHydrationWarning
      >
        {beats.slice(sectionStart, state.index + 1).map((beat) => {
          const isActive = beat === beats[state.index];
          return (
            <div key={beat.id} ref={isActive ? activeRef : undefined}>
              <Beat
                beat={beat}
                isActive={isActive}
                phase={isActive ? state.phase : "done"}
                onPhaseDone={() => dispatch({ type: "PHASE_DONE" })}
              />
            </div>
          );
        })}
        <div className="term-tail" aria-hidden="true" />
      </motion.div>

      <motion.aside
        className="term-stage"
        animate={{ flexBasis: stageOpen ? "48%" : "0%" }}
        transition={transition}
        aria-hidden={!stageOpen}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {stageOpen ? (
            <motion.div
              key={activeBeat.id}
              className="term-stage-inner"
              initial={reduce ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
              transition={transition}
            >
              <Stage beat={activeBeat} gallerySlide={gallerySlide} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.aside>
    </div>
  );
}
