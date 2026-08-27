"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BEATS } from "./beats";
import { beatLayout, initialState, makeReducer, type State } from "./beat-machine";
import { TerminalProvider } from "./TerminalContext";
import { TerminalWindow } from "./chrome/TerminalWindow";
import { CommandPalette } from "./palette/CommandPalette";
import { PopupWindow } from "./media/PopupWindow";

export function Desktop() {
  const reducer = useMemo(() => makeReducer(BEATS), []);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Inline gallery slideshow index on the active beat (null = not running).
  const [gallerySlide, setGallerySlide] = useState<number | null>(null);

  // Galleries that have already run their slideshow this session, so a revisit
  // advances instead of replaying. (The launch line can still replay it.)
  const consumedRef = useRef<Set<string>>(new Set());

  // Refs so the single keydown handler reads fresh values without re-binding.
  const stateRef = useRef<State>(state);
  stateRef.current = state;
  const paletteRef = useRef(paletteOpen);
  paletteRef.current = paletteOpen;
  const slideRef = useRef(gallerySlide);
  slideRef.current = gallerySlide;

  const startGallery = useCallback(() => setGallerySlide(0), []);
  const consumeGallery = () =>
    consumedRef.current.add(BEATS[stateRef.current.index]?.id);
  const closeGallery = useCallback(() => {
    consumedRef.current.add(BEATS[stateRef.current.index]?.id);
    setGallerySlide(null);
  }, []);

  // Space is the global "next": skip streaming, open the gallery, flip through
  // it, then collapse it and advance on the last frame.
  const forward = useCallback(() => {
    if (slideRef.current !== null) {
      const gallery = BEATS[stateRef.current.index]?.gallery;
      const last = (gallery?.items.length ?? 1) - 1;
      if (slideRef.current < last) {
        setGallerySlide((s) => (s ?? 0) + 1);
      } else {
        consumeGallery();
        setGallerySlide(null);
        dispatch({ type: "ADVANCE" });
      }
      return;
    }
    const s = stateRef.current;
    if (s.phase !== "done") {
      dispatch({ type: "ADVANCE" }); // finish the current stream
      return;
    }
    const beat = BEATS[s.index];
    if (beat.gallery && !consumedRef.current.has(beat.id)) {
      setGallerySlide(0);
      return;
    }
    dispatch({ type: "ADVANCE" });
  }, []);

  const backward = useCallback(() => {
    if (slideRef.current !== null) {
      setGallerySlide((s) => Math.max(0, (s ?? 0) - 1));
      return;
    }
    dispatch({ type: "BACK" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) return;
      }

      if (e.key === "Escape") {
        if (slideRef.current !== null) {
          e.preventDefault();
          consumeGallery();
          setGallerySlide(null);
        } else if (paletteRef.current) {
          e.preventDefault();
          setPaletteOpen(false);
        }
        return;
      }

      if (e.key === "/" && slideRef.current === null) {
        if (!paletteRef.current) {
          e.preventDefault();
          setPaletteOpen(true);
        }
        return;
      }
      if (paletteRef.current) return;

      switch (e.key) {
        case " ":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          forward();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          backward();
          break;
        case "Home":
          if (slideRef.current === null) {
            e.preventDefault();
            dispatch({ type: "JUMP", index: 0 });
          }
          break;
        case "End":
          if (slideRef.current === null) {
            e.preventDefault();
            dispatch({ type: "JUMP", index: BEATS.length - 1 });
          }
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [forward, backward]);

  const value = useMemo(
    () => ({
      beats: BEATS,
      state,
      dispatch,
      paletteOpen,
      setPaletteOpen,
      gallerySlide,
      startGallery,
    }),
    [state, paletteOpen, gallerySlide, startGallery],
  );

  const activeBeat = BEATS[state.index];
  const popupOpen =
    beatLayout(activeBeat) === "popup" &&
    gallerySlide !== null &&
    !!activeBeat.gallery;

  return (
    <TerminalProvider value={value}>
      <div className="term-desktop">
        <TerminalWindow />
        {paletteOpen ? <CommandPalette /> : null}
        <AnimatePresence>
          {popupOpen ? (
            <PopupWindow
              key={activeBeat.id}
              window={activeBeat.gallery!}
              index={gallerySlide ?? 0}
              onPrev={backward}
              onNext={forward}
              onClose={closeGallery}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </TerminalProvider>
  );
}
