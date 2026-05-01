import type { CaseStudyDeckEntry } from "../CaseStudyDeck";
import { teachingGeminiToSee } from "./teaching-gemini-to-see";
import { veoInGemini } from "./veo-in-gemini";

export const DECKS: Record<string, CaseStudyDeckEntry> = {
  "teaching-gemini-to-see": teachingGeminiToSee,
  "veo-in-gemini": veoInGemini,
};
