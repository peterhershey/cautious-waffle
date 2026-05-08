"use client";

import { useDeck } from "../Deck";
import { DeckFrame } from "./DeckFrame";
import { NavCorner } from "./NavCorner";
import { NudgeBar } from "./NudgeBar";

export type DeckChromeProps = {
  /** Render the page nav corner. Off on the home deck for now. */
  nav?: boolean;
};

export function DeckChrome({ nav = false }: DeckChromeProps) {
  const { immersive } = useDeck();
  return (
    <div className="wipu-chrome" data-immersive={immersive ? "true" : undefined}>
      <DeckFrame />
      {nav && <NavCorner />}
      <NudgeBar />
    </div>
  );
}
