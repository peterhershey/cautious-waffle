"use client";

import { HomeView } from "../views/HomeView";
import { StatusLine } from "./StatusLine";
import { TrafficLights } from "./TrafficLights";
import { useTerminal } from "../TerminalContext";

const DEFAULT_TITLE = "peter@portfolio — zsh";

/** The Mac terminal window: title bar, scrollable transcript body, status
 *  footer. CSS-only chrome reusing the deck's glass/radius/shadow tokens. */
export function TerminalWindow() {
  const { beats, state } = useTerminal();

  // Title bar follows the last beat (≤ active) that sets a title — reads like
  // switching context/tabs as you move between sections.
  let title = DEFAULT_TITLE;
  for (let i = state.index; i >= 0; i--) {
    if (beats[i].title) {
      title = beats[i].title as string;
      break;
    }
  }

  return (
    <div className="term-window glass">
      <div className="term-titlebar">
        <TrafficLights />
        <span className="term-title term-dim">{title}</span>
        <div className="term-controls" aria-hidden="true">
          <span className="term-control">⊟</span>
          <span className="term-control">⤢</span>
        </div>
      </div>
      <div className="term-body">
        <HomeView />
      </div>
      <StatusLine />
    </div>
  );
}
