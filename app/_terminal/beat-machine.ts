/* The discrete beat state-machine. The whole conceit lives here: a beat is a
 * command that types, (optionally) "runs", then streams its answer — and then
 * the machine PARKS and waits for a keypress. Nothing auto-advances past `done`.
 *
 * This is deliberately NOT the deck's spring-scroll engine (continuous flip-
 * through). Here every reveal is driven. */

import type { ReactNode } from "react";
import type { MediaWindow } from "./media/types";

export type Register = "plain" | "graphical";

/** Which "track" a beat belongs to — drives the dynamic jump palette. */
export type Track = "home" | "gemini" | "veo";

/** How a beat arranges the persistent shell (a continuous text column + a
 *  sticky media stage beside it). The column never resets within a track;
 *  the layout only controls what happens *around* it:
 *  - `fullwidth` — text fills the window, no stage.
 *  - `inline`    — text fills the window; an image rides inside the flow.
 *  - `sxs-image` — text narrows left, a framed image slides into the stage.
 *  - `sxs-carousel` — like sxs-image, but the stage pages through frames.
 *  - `popup`     — a second terminal window moves in over the first. */
export type BeatLayout =
  | "fullwidth"
  | "inline"
  | "sxs-image"
  | "sxs-carousel"
  | "popup";

/** What the media stage (or popup) shows for a beat. */
export type BeatMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "carousel"; window: MediaWindow }
  | { kind: "popup"; window: MediaWindow };

/** A single piece of output inside a beat, revealed in sequence.
 *  - `line`: a run of text streamed character-by-character.
 *  - `gap`:  a blank line (instant).
 *  - `node`: a custom component (e.g. the ASCII title). It receives `active`
 *            (animate now) and `onDone` (call when its reveal finishes so the
 *            sequence can advance). */
export type OutputBlock =
  | { kind: "line"; text: string; className?: string }
  | { kind: "gap" }
  | {
      kind: "node";
      key: string;
      // `active`     — this block is the streaming cursor (drives onDone).
      // `beatActive` — the whole beat is the current one (drives side effects
      //                like opening a window, regardless of skip/stream).
      render: (p: {
        active: boolean;
        beatActive: boolean;
        onDone?: () => void;
      }) => ReactNode;
    };

export type Beat = {
  id: string;
  label: string; // status / jump-palette label
  command: string; // what gets "typed" at the prompt
  bootLines?: string[]; // faux "running…" lines streamed before output
  output: OutputBlock[];
  register: Register;
  /** Section boundary. When the active beat is at/after a `clear` beat, the
   *  transcript renders only from that beat onward — the screen "clears", the
   *  way `clear` or a new tab would. Gives slide-like breaks between sections. */
  clear?: boolean;
  /** Overrides the window title bar from this beat onward (until the next
   *  beat that sets one) — reads like switching context / tabs. */
  title?: string;
  /** A "big" beat (e.g. a pull quote). Gets vertical breathing room and
   *  scrolls so prior history is pushed out of view — clean space, without a
   *  full `clear`. */
  feature?: boolean;
  /** A carousel attached to this beat. Space (the global "next") opens it,
   *  flips through it, then closes it and advances on the last frame. */
  gallery?: MediaWindow;
  /** A framed media panel shown beside the output (two-column layout) — e.g.
   *  the chocolate gif on the title slide. Always visible, not streamed.
   *  @deprecated prefer `layout: "sxs-image"` + `media`. Still honored. */
  aside?: { src: string; alt: string };
  /** Explicit shell layout. When omitted it is derived: a beat with `aside`
   *  is `sxs-image`, one with `gallery` is `sxs-carousel`, else `fullwidth`.
   *  See {@link beatLayout}. */
  layout?: BeatLayout;
  /** The media this beat puts in the stage / popup. When omitted it is derived
   *  from `aside` / `gallery` for backwards compatibility. */
  media?: BeatMedia;
  /** Which track this beat belongs to (home / a case study). Drives the
   *  context-aware jump palette. Defaults to "home". */
  track?: Track;
  /** If set, this beat is a navigable landmark — it appears in the jump
   *  palette for its track under this label. */
  navLabel?: string;
};

export type Phase = "typing" | "booting" | "streaming" | "done";

export type State = {
  index: number; // current beat
  phase: Phase; // phase of the current beat
};

export type Action =
  | { type: "ADVANCE" } // space / →  (skip-if-streaming, else next beat)
  | { type: "BACK" } // ←  (history is always fully shown)
  | { type: "JUMP"; index: number } // palette
  | { type: "PHASE_DONE" } // a stream finished; chain to the next phase
  | { type: "FINISH" }; // force the active beat to `done` (skip animation)

function entryPhase(beat: Beat): Phase {
  // index 0 (kickoff) and every beat start by typing the command first.
  return "typing";
}

/** Phase chain for the active beat, driven by PHASE_DONE callbacks. */
function nextPhase(beat: Beat, phase: Phase): Phase {
  switch (phase) {
    case "typing":
      return beat.bootLines && beat.bootLines.length > 0
        ? "booting"
        : "streaming";
    case "booting":
      return "streaming";
    case "streaming":
      return "done";
    default:
      return "done";
  }
}

export function makeReducer(beats: Beat[]) {
  const last = beats.length - 1;

  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "PHASE_DONE": {
        if (state.phase === "done") return state;
        const beat = beats[state.index];
        return { ...state, phase: nextPhase(beat, state.phase) };
      }

      case "FINISH": {
        if (state.phase === "done") return state;
        return { ...state, phase: "done" };
      }

      case "ADVANCE": {
        // Mid-beat: complete the current stream instead of advancing.
        if (state.phase !== "done") return { ...state, phase: "done" };
        if (state.index >= last) return state;
        const nextIndex = state.index + 1;
        return { index: nextIndex, phase: entryPhase(beats[nextIndex]) };
      }

      case "BACK": {
        if (state.index <= 0) return state;
        // History never re-animates.
        return { index: state.index - 1, phase: "done" };
      }

      case "JUMP": {
        const i = Math.max(0, Math.min(last, action.index));
        if (i === state.index) return { ...state, phase: "done" };
        // Jumping forward animates the target; jumping back shows it done.
        const phase = i > state.index ? entryPhase(beats[i]) : "done";
        return { index: i, phase };
      }

      default:
        return state;
    }
  };
}

export const initialState: State = { index: 0, phase: "typing" };

// ── Layout derivation ─────────────────────────────────────────────────
// A beat's effective shell layout. Explicit `layout` wins; otherwise it's
// inferred from the legacy `aside` / `gallery` fields so existing beats keep
// working unchanged.
export function beatLayout(beat: Beat): BeatLayout {
  if (beat.layout) return beat.layout;
  if (beat.aside) return "sxs-image";
  if (beat.gallery) return "sxs-carousel";
  return "fullwidth";
}

// The media a beat puts in the stage / popup. Explicit `media` wins; otherwise
// it's lifted from `aside` / `gallery`.
export function beatMedia(beat: Beat): BeatMedia | null {
  if (beat.media) return beat.media;
  if (beat.aside) return { kind: "image", ...beat.aside };
  if (beat.gallery) return { kind: "carousel", window: beat.gallery };
  return null;
}
