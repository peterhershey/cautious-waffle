"use client";

import { useDeck } from "../Deck";
import { DeckFrame } from "./DeckFrame";
import { NavCorner } from "./NavCorner";
import { SettingsCorner } from "./SettingsCorner";
import { NudgeBar } from "./NudgeBar";

export function DeckChrome() {
  const { immersive } = useDeck();
  return (
    <div className="wipu-chrome" data-immersive={immersive ? "true" : undefined}>
      <DeckFrame />
      <NavCorner />
      <SettingsCorner />
      <NudgeBar />
    </div>
  );
}
