"use client";

import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { Action, Beat, State } from "./beat-machine";
import type { CarouselItem, MediaWindow } from "./media/types";

export type { CarouselItem, MediaWindow };

export type TerminalContextValue = {
  beats: Beat[];
  state: State;
  dispatch: Dispatch<Action>;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  // Inline gallery slideshow on the active beat: the current frame index, or
  // null when no slideshow is running. While running, the beat goes
  // two-column (text left, image right); space flips, then it collapses back.
  gallerySlide: number | null;
  startGallery: () => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export const TerminalProvider = TerminalContext.Provider;

export function useTerminal(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error("useTerminal must be used within <TerminalProvider>");
  }
  return ctx;
}
