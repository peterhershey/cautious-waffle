"use client";

import { Deck } from "../_deck/Deck";
import { ANTHROPIC_SLIDES } from "../_deck/slides/anthropic";

export default function Page() {
  return <Deck slides={ANTHROPIC_SLIDES} />;
}
