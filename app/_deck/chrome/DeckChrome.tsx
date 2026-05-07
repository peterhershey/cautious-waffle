"use client";

import { useDeck } from "../Deck";
import { DeckFrame } from "./DeckFrame";
import { NavCorner } from "./NavCorner";
import { NudgeBar } from "./NudgeBar";

export function DeckChrome() {
  const { immersive } = useDeck();
  return (
    <div className="wipu-chrome" data-immersive={immersive ? "true" : undefined}>
      <DeckFrame />
      <NavCorner />
      <NudgeBar />
    </div>
  );
}
