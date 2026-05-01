"use client";

import { SiteFrame } from "../../components/SiteFrame";
import { useDeck } from "../Deck";

export function DeckFrame() {
  const { activeIndex, slides } = useDeck();
  const slide = slides[activeIndex];
  if (!slide) return null;
  const num = String(activeIndex + 1).padStart(2, "0");
  return (
    <SiteFrame num={num} label={slide.label} scrambleKey={activeIndex} />
  );
}
